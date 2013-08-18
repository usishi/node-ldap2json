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
  describe('CheckUser',function(){
    it('returns a user',function(done){
      ldap2json.checkUser(testVariables.TreeOptions,'serkan','1',function(e,usr){
        usr.should.be.object;
        done();
      });
    });
  });
  describe('Get Domain Tree',function(){
    it('returns an array',function(done){
      ldap2json.getJson(testVariables.TreeOptions,function(e,tree){
        tree.should.be.object;
        done();
      });
    });
  });
  describe('Get Security Groups',function(){
    it('returns an array',function(done){
      ldap2json.getSecurityGroups(testVariables.TreeOptions,function(e,grps){
        grps.should.be.object;
        done();
      });
    });
  });
  describe('Search Users',function(){
    it('returns an array',function(done){
      ldap2json.searchUser(testVariables.TreeOptions,testVariables.searchkeyword,function(e,items){
        items.should.be.object;
        done();
      });
    });
  });
}); 

