var 
	ldap2json = require('../lib/ldap2json')
	,assert   = require('assert')
  ,should  = require('should')
	;


var testVariables = {

  TreeOptions : {
    host : '10.1.60.5',
    adminuser : 'bh\\Administrator',
    adminpass : '1',
    base : 'dc=bh,dc=pvt' 
  },
  testuser:'serkan',
  testuserpass : '1',
  searchkeyword : 'gök'  
}



describe('Ldap2Json',function(){
  this.timeout(50000);
  describe('CheckUser',function(){
    it('returns a user',function(done){
      ldap2json.checkUser(testVariables.TreeOptions,testVariables.testuser,testVariables.testuserpass,function(e,usr){
        usr.should.be.object;
        done();
      });
    });
  });
    describe('Get Security Groups',function(){
    it('returns an array',function(done){
      ldap2json.getSecurityGroups(testVariables.TreeOptions,function(e,grps){
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
        items.should.be.object;
        items.length.should.be.above(0);
        done();
      });
    });
  });
}); 

