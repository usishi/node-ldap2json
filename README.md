#node-ldap2json [![Build Status](https://secure.travis-ci.org/usishi/node-ldap2json.png)](http://travis-ci.org/usishi/node-ldap2json)
==============

LDAP2JSON makes a json return from LDAP Tree

## Usage : 

``` js
	var getTreeOptions = {
	  host : '10.1.60.5',
	  username : 'bh\\Administrator',
	  password : 'Public1234',
	  base : 'ou=Customers,dc=bh,dc=pvt' 
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

```