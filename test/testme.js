var 
	ldap2json = require('../lib/ldap2json')
	,assert   = require('assert')
  ,should  = require('should')
	;


var testVariables = {

  TreeOptions : {
    host : '192.168.11.100',
    adminuser : 'usishi\\Administrator',
    adminpass : '1',
    base : 'dc=usishi,dc=pvt' 
  },
  testuser:'fatih',
  testuserpass : '1',
  searchkeyword : 'gök',
  searchguid : 'ed386d41-2888-4333-bd10-de6d2dcb193a'
}

//<GUID=ed386d41-2888-4333-bd10-de6d2dcb193a>

describe('Ldap2Json',function(){
  this.timeout(50000);
  describe('CheckUser',function(){
    it('returns a user',function(done){
      ldap2json.checkUser(testVariables.TreeOptions,testVariables.testuser,testVariables.testuserpass,function(e,usr){
        if (e) throw e;
        usr.should.be.object;
        done();
      });
    });
  });
    describe('Get Security Groups',function(){
    it('returns an array',function(done){
      ldap2json.getSecurityGroups(testVariables.TreeOptions,function(e,grps){
        if (e) throw e;
        grps.should.be.object;
        grps.length.should.be.above(10);
        console.log(grps.length);
        done();
      });
    });
  });
  describe('Get Domain Tree',function(){
    it('returns a tree with items',function(done){
      ldap2json.getJson(testVariables.TreeOptions,function(e,tree){
        if (e) throw e;
        tree.should.be.object;
        tree.items.length.should.be.above(1);
        console.log(tree.items.length);
        done();
      });
    });
  });

  describe('Search Users',function(){
    it('returns an array',function(done){
      ldap2json.searchUser(testVariables.TreeOptions,testVariables.searchkeyword,function(e,items){
        if (e) throw e;
        items.should.be.object;
        items.length.should.be.above(0);
        done();
      });
    });
  });
  describe('Get Object With GUID',function(){
    it('returns a user',function(done){
      ldap2json.getObjectWithGuid(testVariables.TreeOptions,testVariables.searchguid,function(e,usr){
        if (e) throw e;
        usr.should.be.object;
        done();
      });
    });
  });
}); 

