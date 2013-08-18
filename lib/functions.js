var ldap      = require('ldapjs')



function lditem2obj(lditem){
  var o= new Object();
  o.path=lditem.distinguishedName;
  o.hide=(lditem.showInAdvancedViewOnly=="TRUE") ? true : false;
  if ((lditem.cn!=undefined)||(lditem.ou!=undefined)) {
    if (lditem.objectClass.indexOf('organizationalUnit')>-1){
      o.type='OU';
      o.name=lditem.ou;
    } else if (lditem.objectClass.indexOf('person')>-1){
      o.type='USER';
      o.name=lditem.cn;
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

exports.search=function(options,keyword,objecttype,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'sub',
    filter: '(&(objectClass='+objecttype+')(cn=*'+keyword+'*))'
  };
  //console.log("searchInLdap:SearchBase:"+options.base);
  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      console.log("search:ClientBind:"+e.message);
      cb(e.message,null);
      return;
    } 
    var items = [];

    client.search(options.base,opts,function(err,res){
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
        }          
      });
    });
  });
}

exports.searchInLdap=function(options,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'one',
    filter: '(|(objectClass=container)(objectClass=group)(objectClass=organizationalUnit))'
  };
  //console.log("searchInLdap:SearchBase:"+options.base);
  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      console.log("searchInLdap:ClientBind:"+e.message);
      cb(e.message,null);
      return;
    } 
    var items = [];

    client.search(options.base,opts,function(err,res){
      if (err) {
        console.log("searchInLdap:ClientSearchParamErr:"+err.message);
        cb(e.message,null);
        return;
      }
      res.on('searchEntry', function(entry) {
        items.push(entry.object);
      });
      res.on('error', function(err2) {
        console.log();
        console.log("\033[41m\033[33m searchInLdap:ClientSearch:"+err2.message+"\033[0m");
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
        }          
      });
    });
  });
}


exports.getAllInLdap=function(options,cb){
  if (options==null){
    cb("null options",null);
    return;
  }
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'sub'
  };
  
  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      cb(e.message,null);
      return;
    } 
    var items = [];
    client.search(options.base,opts,function(err,res){
      if (err) {
        cb(e.message,null);
        return;
      }
      res.on('searchEntry', function(entry) {
        items.push(entry.object);
      });
      res.on('error', function(err) {
        cb(err.message,null);
        return;
      });
      res.on('end', function(result) {
        var count=items.length;
        if (count==0) {
          cb(null,[]);
        } else {
          retitems = [];
          items.forEach(function(itm){
            if(itm.objectClass.indexOf('group')>-1){
              var o= new Object();
              o.path=itm.distinguishedName;
              o.name=itm.cn;
              retitems.push(o);
            }
            count--;
            if (count<=0){
              cb(null,retitems);
            }
          });
        }        
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
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'sub',
    filter: '(&(objectClass=group))'

  };

  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      cb(e.message,null);
      console.log("getSGroupsInLdap:"+e.message);
      return;
    } 
    var items = [];
    client.search(options.base,opts,function(err,res){
      if (err) {
        cb(e.message,null);
        return;
      }
      res.on('searchEntry', function(entry) {
        items.push(entry.object);
      });
      res.on('error', function(err) {
        cb(err.message,null);
        console.log("getSGroupsInLdap:"+err.message);
        return;
      });
      res.on('end', function(result) {
        var count=items.length;
        if (count==0) {
          cb(null,[]);
        } else {
          retitems = [];
          items.forEach(function(itm){
            var o= new Object();
            o.path=itm.distinguishedName;
            o.name=itm.cn;
            retitems.push(o);
            count--;
            if (count<=0){
              cb(null,retitems);
            }
          });
        }        
      });
    });
  });
}

exports.getUser=function(options,username,password,cb){


  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
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
      client.search(options.base,opts,function(err,res) {
        if (err){
        }
        res.on('searchEntry', function(entry) {
          items.push(entry.object);
        });
        res.on('error', function(err) {
          cb(err.message,null);
          return;
        });
        res.on('end', function(result) {
          if (items.length>0) {
            var userclient=ldap.createClient({url:'ldap://'+options.host+':389'});
            userclient.bind(options.adminuser.split('\\')[0]+'\\'+username,password,function(e){
              if (e){
                cb(e.message,null);
              } else {
                cb(null,{dn:items[0].distinguishedName,class:items[0].objectClass,username:username,name:items[0].displayName,groups:items[0].memberOf,sid:items[0].objectSid});  
              }          
            });
          } else {
            cb('user not found',null);
          }
        });

      });  
    }
  });
}

