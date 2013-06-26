var 
	ldap2json = require('../lib/ldap2json')
	,vows 		= require('vows')
	;


var getTreeOptions = {
  host : '10.1.60.5',
  username : 'bh\\Administrator',
  password : 'Genel1234',
  base : 'dc=bh,dc=pvt' 
}


/// FIND A PUBLIC LDAP Server for testing	


ldap2json.checkUser(getTreeOptions,function(e){
	if (e){
		console.log("Error : : : : "+e);
	} else {
		console.log("Authentication OK");  
	}
});


ldap2json.getJson(getTreeOptions,function(e,tree){
	if (e){
		console.log("Error : : : : "+e);
	} else {
		console.log("Recieved Object: \n"+JSON.stringify(tree));  
	}
})


ldap2json.getSecurityGroups(getTreeOptions,function(e,groups){
	if (e){
		console.log("Error : : : : "+e);
	} else {
		groups.forEach(function(grp){
			console.log(grp.name);
		});	
	}
});

