var ldap      = require('ldapjs')


exports.searchInLdap=function(options,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'one'
  };
  
  client.bind(options.adminuser,options.pass,function(e){
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
            var o= new Object();
            o.path=itm.distinguishedName;
            o.hide=(itm.showInAdvancedViewOnly=="TRUE") ? true : false;
            if (itm.objectClass.indexOf('organizationalUnit')>-1){
              o.type='OU';
              o.name=itm.ou;
              retitems.push(o);
            } else if (itm.objectClass.indexOf('person')>-1){
              o.type='USER';
              o.name=itm.cn;
              retitems.push(o);
            } else if(itm.objectClass.indexOf('container')>-1){
              o.type='CN';
              o.name=itm.cn;
              retitems.push(o);
            } else if(itm.objectClass.indexOf('group')>-1){
              o.type='GROUP';
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


exports.getAllInLdap=function(options,cb){
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

exports.getUser=function(options,username,password,cb){

  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });

  var opts = {
    scope: 'sub',
    filter: '(&(objectClass=user)(sAMAccountName='+username+'))'
  };
  var items=[];
  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      cb(e.message,null);
      return;
    } else {
      client.search(options.base,opts,function(err,res) {
        if (err){
          console.log("hata"+err);
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

