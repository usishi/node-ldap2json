var 
assert = require('assert'),
ldap2json = require('../lib/ldap2json');


var getTreeOptions = {
  host : '10.1.60.5',
  username : 'bh\\Administrator',
  password : 'Genel1234',
  base : 'ou=Bayiler,dc=bh,dc=pvt' 
}

ldap2json.getJson(getTreeOptions,function(e,tree){
	if (e){
		console.log("Error : : : : "+e);
		process.exit(code=e.code);	
	} else {
		console.log("Recieved Object: \n"+JSON.stringify(tree));  
  	process.exit(code=0)	
	}
})
