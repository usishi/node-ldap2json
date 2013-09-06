var 
extend = require('util')._extend,
ldap      = require('ldapjs');

var  
pagedsearch = new ldap.PagedResultsControl({value:{size:500}});
additionalfilter = "(userAccountControl\:1.2.840.113556.1.4.803\:\=512)";

console.log("obje : "+JSON.stringify(pagedsearch));




var searchParts=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
                 'p','r','s','t','u','v','y','z'];

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



function partedSearch(client,options,opts,cb){
  items=[];
        var newopts=extend({},opts);
        var working=searchParts.length;
        searchParts.forEach(function(part){
          var newClient=ldap.createClient({url:client.url.href});
          newClient.bind(options.adminuser,options.adminpass,function(e){
            addFilter='cn='+part+'*';
            newopts.filter='(&'+opts.filter+'('+addFilter+')'+')';
            newClient.search(options.base,newopts,function(e1,r1){
              r1.on('searchEntry', function(entry) {
                items.push(entry.object);
              });
              r1.on('end',function(){
                working--;
                if (working<=0){ //All parts finished, now searching others
                  var sonClient=ldap.createClient({url:client.url.href});
                  sonClient.bind(options.adminuser,options.adminpass,function(e){
                    var pw=searchParts.length;
                    var allparts='';
                    searchParts.forEach(function(p2){
                      allparts+='(cn='+p2+'*)';
                      pw--;
                      if (pw<=0){
                        newopts.filter='(&'+opts.filter+'(!(|'+allparts+')))';
                        sonClient.search(options.base,newopts,function(e2,r2){
                          if(e2){
                            console.log(e2);
                          }
                          r2.on('searchEntry', function(entry) {
                            items.push(entry.object);
                          });
                          r2.on('end',function(){
                            var count=items.length;
                            retitems = [];
                            items.forEach(function(itm){
                              retitems.push(lditem2obj(itm));
                              count--;
                              if (count<=0){
                                cb(null,retitems);
                              }
                            });
                          });
                        });
                      }
                    });
                  });
                }
              })
            });
          });
        });
}


function clientSearch(client,options,opts,cb){
  var items=[];
  if (opts.filter.indexOf(additionalfilter)<0){
    opts.filter='(&'+opts.filter+additionalfilter+')';  
  }
  opts.filter='(&'+opts.filter+additionalfilter+')';
  client.search(options.base,opts,[pagedsearch],function(err,res){
    if (err) {
      console.log("clientSearchParamErr:"+err.message);
      cb(e.message,null);
      return;
    }
    res.on('searchEntry', function(entry) {
      items.push(entry.object);
    });
    res.on('error', function(err2) {
      if (err2.message!='Size Limit Exceeded') {
        console.log("\033[41m\033[33mclientSearch:"+err2.message+"("+options.base+")\033[0m");
        cb(err2,null);
      } else {
        console.log("Size Limit Geçildi.......");
      }
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

exports.search=function(options,keyword,objecttype,cb){
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'sub',
    filter: '(&(objectClass='+objecttype+')(cn=*'+keyword+'*)'+additionalfilter+')'
  };

  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      console.log("search:ClientBind:"+e.message);
      cb(e.message,null);
      return;
    } 
    var items = [];

    client.search(options.base,opts,[pagedsearch],function(err,res){
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
  if (options==null){
    cb("null options",null);
    return;
  }
  var client=ldap.createClient({
    url:'ldap://'+options.host+':389'
  });
  var opts = {
    scope: 'one',
    filter: '(|(objectClass=container)(objectClass=group)(objectClass=organizationalUnit))'
  };

  client.bind(options.adminuser,options.adminpass,function(e){
    if (e) {
      console.log("searchInLdap:ClientBind:"+e.message);
      cb(e.message,null);
      return;
    } 
    clientSearch(client,options,opts,function(e,itms){
      cb(e,itms);
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
    clientSearch(client,options,opts,function(e,itms){
      cb(e,itms);
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

