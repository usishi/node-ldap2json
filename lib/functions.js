var ldap      = require('ldapjs')


exports.searchInLdap=function(host,usr,pwd,base,cb){
  var client=ldap.createClient({
    url:'ldap://'+host+':389'
  });
  var opts = {
    //filter: '(!(objectClass=person))',
    scope: 'one'
  };
  
  client.bind(usr,pwd,function(e){
    if (e) {
      cb(e.message,null);
      return;
    } 
    var items = [];
    client.search(base,opts,function(err,res){
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


exports.getAllInLdap=function(host,usr,pwd,base,cb){
  var client=ldap.createClient({
    url:'ldap://'+host+':389'
  });
  var opts = {
    //filter: '(!(objectClass=person))',
    scope: 'sub'
  };
  
  client.bind(usr,pwd,function(e){
    if (e) {
      cb(e.message,null);
      return;
    } 
    var items = [];
    client.search(base,opts,function(err,res){
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

exports.tryBind=function(host,usr,pwd,base,cb){
  var client=ldap.createClient({
    url:'ldap://'+host+':389'
  });
  
  client.bind(usr,pwd,function(e){
    if (e) {
      cb(e.message);
      return;
    } else {
      cb(null);
    }
  });
}