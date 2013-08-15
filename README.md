#node-ldap2json [![Build Status](https://secure.travis-ci.org/usishi/node-ldap2json.png)](http://travis-ci.org/usishi/node-ldap2json)
==============

[![NPM](https://nodei.co/npm/node-ldap2json.png?downloads=true)](https://nodei.co/npm/node-ldap2json/)

LDAP2JSON makes shortcuts LDAP.JS



## Usage : 

``` js

  var ldap2json = require('node-ldap2json');


	var getTreeOptions = {
	  host : '10.1.60.5',
	  username : 'bh\\Administrator',
	  password : 'Public1234',
	  base : 'ou=Customers,dc=bh,dc=pvt' 
	}

	//GetAD Tree

	ldap2json.getJson(getTreeOptions,function(e,tree){
		if (e){
			console.log("Error : : : : "+e);
			process.exit(code=e.code);	
		} else {
			console.log("Recieved Object: \n"+JSON.stringify(tree));
	  	process.exit(code=0)	
		}
	})


	//CheckUser
    
  ldap2json.checkUser(getTreeOptions,'serkan','1',function(e,usr){
  	...  
  });

  //Search Users

	ldap2json.searchUser(getTreeOptions,'keyword',function(e,items){
	  ...
	});

```


## Installation

    npm install node-ldap2json