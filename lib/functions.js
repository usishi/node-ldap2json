var 
extend = require('util')._extend,
buffers       = require('buffer'),
ldap      = require('ldapjs');

//ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

function lditem2obj(lditem){
  var o= new Object();
  o.path=lditem.distinguishedName;
  o.hide=(lditem.showInAdvancedViewOnly=="TRUE") ? true : false;
  o.class=lditem.objectClass; 
  o.guid=lditem.objectGUID.replace('{','').replace('}','');
  if ((lditem.cn!=undefined)||(lditem.ou!=undefined)) {
    if (lditem.objectClass.indexOf('organizationalUnit')>-1){
      o.type='OU';
      o.name=lditem.ou;
    } else if (lditem.objectClass.indexOf('person')>-1){
      o.type='USER';
      o.name=lditem.cn;
      if (o.name=='undefined'){
        o.name=lditem.sAMAccountName;
      }
      if (lditem.telephoneNumber){
        o.phone=lditem.telephoneNumber;
      }
      o.groups=lditem.memberOf;
    } else if(lditem.objectClass.indexOf('container')>-1){
      o.type='CN';
      o.name=lditem.cn;
    } else if(lditem.objectClass.indexOf('group')>-1){
      o.type='GROUP';
      o.name=lditem.cn;
    }
    return o;
  } else return null;
}

function clientSearch(client,options,opts,cb){
  var items=[];
  client.search(options.base,opts,[new ldap.PagedResultsControl({value:{size:500}})],function(err,res){
    if (err) {
      console.log("clientSearchParamErr:"+err.message);
      cb(e.message,null);
      return;
    }
    res.on('searchEntry', function(entry) {
      items.push(entry.object);
    });
    res.on('error', function(err2) {
      console.log("\033[41m\033[33mclientSearch:"+err2.message+"("+options.base+")\033[0m");
      cb(err2,null);
      return;
    });
    res.on('end', function(result) {
      var count=items.length;
      if (count==0) {
        cb(null,[]);
      } else {
        retitems = [];
        items.forEach(function(itm){
          retitems.push(lditem2obj(itm));
          count--;
          if (count<=0){
            cb(null,retitems);
          }
        }); 
      }
    });
  });
}

exports.searchUser=function(options,keyword,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389',
    timeout : 2000
  });
  var opts = {
    scope: 'sub',
    filter: '(&(objectClass=user)(|(sAMAccountName=*'+keyword+'*)(cn=*'+keyword+'*))(userAccountControl:1.2.840.113556.1.4.803:=512)(!(isDeleted=*)))'
  };

  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      console.log("search:ClientBind:"+e.message);
      cb(e.message,null);
      return;
    } 
    var items = [];
    client.timeout=0;
    client.search(options.base,opts,[new ldap.PagedResultsControl({value:{size:500}})],function(err,res){
      if (err) {
        console.log("search:ClientSearchParamErr:"+err.message);
        cb(e.message,null);
        return;
      }
      res.on('searchEntry', function(entry) {
        items.push(entry.object);
      });
      res.on('error', function(err2) {
        console.log();
        console.log("\033[41m\033[33m search:ClientSearch:"+err2.message+"\033[0m");
        //cb(err2.message,null);
        //return;
      });
      res.on('end', function(result) {
        var count=items.length;
        if (count==0) {
          cb(null,[]);
        } else {
          retitems = [];
          items.forEach(function(itm){
            retitems.push(lditem2obj(itm));
            count--;
            if (count<=0){
              cb(null,retitems);
            }
          });
          client.unbind(function() {
            return;
          }); 
        }          
      });
    });
  });
}


exports.searchInLdap=function(options,cb){
  if (options==null){
    cb("null options",null);
    return;
  }
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389',
    timeout : 2000
  });
  var opts = {
    scope: 'one',
    filter: '(&(|(&(objectClass=group)(!(groupType:1.2.840.113556.1.4.803:=2147483648)))(objectClass=organizationalUnit)(&(objectClass=container)(cn=Users)))(!(isDeleted=*)))'
  };

  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      console.log("searchInLdap:ClientBind:"+e.message);
      cb(e.message,null);
      return;
    } 
    client.timeout=0;
    clientSearch(client,options,opts,function(e,itms){
      cb(e,itms);
      client.unbind(function() {
        return;
      }); 
    });
  });
}


exports.getSGroupsInLdap=function(options,cb){
  if (options==null){
    cb("null options",null);
    return;
  }
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389',
    timeout : 2000
  });
  var opts = {
    scope: 'sub',
    filter: '(&(objectClass=group)(groupType:1.2.840.113556.1.4.803:=2147483648))' //All security enabled groups
  };

  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      cb(e.message,null);
      console.log("getSGroupsInLdap:"+e.message);
      return;
    } 
    client.timeout=0;
    clientSearch(client,options,opts,function(e,itms){
      cb(e,itms);
      client.unbind(function() {
        return;
      }); 
    });
  });
}

exports.getUser=function(options,username,password,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389',
    timeout : 2000
  });

  var opts = {
    scope: 'sub',
    filter: '(&(samAccountType=805306368)(sAMAccountName='+username+'))'
  };
  var items=[];
  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      cb("binding error:"+e.message,null);
      return;
    } else {
      client.timeout=0;
      client.search(options.base,opts,function(err,res) {
        if (err){
        }
        res.on('searchEntry', function(entry) {
          items.push(entry.object);
        });
        res.on('error', function(err) {
          cb(err.message,null);
          client.unbind(function() {
            return;
          }); 
        });
        res.on('end', function(result) {
          if (items.length>0) {
            var userclient=ldap.createClient({url:'ldap://'+options.host+':389'});
            userclient.bind(options.adminuser.split('\\')[0]+'\\'+username,password,function(e){
              if (e){
                cb(e.message,null);
              } else {
                cb(null,lditem2obj(items[0]));  
              }          
            });
          } else {
            cb('user not found',null);
            client.unbind(function() {
              return;
            }); 
          }
        });

      });  
    }
  });
}


exports.getObject=function(options,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389',
    timeout : 2000
  });
  var opts = {
    scope:  'base',
    filter: '(objectclass=*)'
  };
  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      cb("binding error:"+e.message,null);
      return;
    } else {
      client.timeout=0;
      var items=[];
      client.search(options.base,opts,function(err,res) {
        res.on('searchEntry', function(entry) {
          items.push(entry.object);
        });
        res.on('error', function(err) {
          cb(err.message,null);
          client.unbind(function() {
            return;
          }); 
        });
        res.on('end', function(result) {
          if (items.length<1){
            cb('object not found',null);
          } else {
            cb(null,lditem2obj(items[0]));
          }
        });
      });
    }
  }); //clientbind

}