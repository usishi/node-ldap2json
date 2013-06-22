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
            if (itm.objectClass.indexOf('organizationalUnit')>-1){
              var o={};
              o.type='OU';
              o.name=itm.ou;
              o.path=itm.distinguishedName;
              retitems.push(o);
            }
            if (itm.objectClass.indexOf('person')>-1){
              var o={};
              o.type='USER';
              o.name=itm.cn;
              o.path=itm.distinguishedName;
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