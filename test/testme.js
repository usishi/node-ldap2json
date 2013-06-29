var 
	ldap2json = require('../lib/ldap2json')
	,vows 		= require('vows')
	,assert   = require('assert')
	;


var getTreeOptions = {
  host : '10.1.60.5',
  adminuser : 'bh\\Administrator',
  adminpass : 'Genel1234',
  base : 'dc=bh,dc=pvt' 
}



vows.describe('ldap2json').addBatch({   
    'CheckUser': {
      topic : function(){
      	ldap2json.checkUser(getTreeOptions,'serkan','Genel123',this.callback);
      },
      'callback':function(e,usr){
      	assert.ifError(e);
			}
    },
    'Get Domain Tree' : {
    	topic : function() {
				ldap2json.getJson(getTreeOptions,this.callback);    		
    	},
    	'callback':function(e,tree){
    		assert.ifError(e);
    	}
    },
    'Get Security Groups' : {
    	topic : function() {
				ldap2json.getSecurityGroups(getTreeOptions,this.callback);    		
    	},
    	'callback':function(e,groups){
    		assert.ifError(e);
    	}
    }
}).export(module);
