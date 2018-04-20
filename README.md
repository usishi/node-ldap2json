#node-ldap2json 
==============

[![NPM](https://nodei.co/npm/node-ldap2json.png?downloads=true)](https://nodei.co/npm/node-ldap2json/)

LDAP2JSON makes shortcuts LDAP.JS


[![Build Status](https://secure.travis-ci.org/usishi/node-ldap2json.png)](http://travis-ci.org/usishi/node-ldap2json)
Test fails, 
because of need an online ldap server for testing.

But used on that production suite :
over 20.000 users, 4000 ou, 1000 security group

## Usage : 

``` js

  var ldap2json = require('node-ldap2json');


	var treeOptions = {
	  host : '10.1.60.5',
	  uname : 'bh\\Administrator',
	  pwd : 'Public1234',
	  domain : 'usishi.pvt' 
	}

	
	//Get LDAP Tree in JSON Format
  ldap2json.getJson(treeOptions,function(e,tree){
    ...
  });
	
	//Check User 
  ldap2json.checkUser(treeOptions,'testusername','testpassword',function(e,usr){
    ...
  });
  
  // Search a User
  ldap2json.searchUser(treeOptions,testVariables.searchkeyword,function(e,items){
    ...
  });

  //Get Groups
  ldap2json.getSecurityGroups(treeOptions,function(e,grps){
    ...
  });  
  
  //Get Users In Groups
  ldap2json.getUsersInGroups(treeOptions,group,function(e,users){
    ...
  });  
  
  //Search In Security Groups
  ldap2json.searchInSGroups(treeOptions,keyword,function(e,users){
    ...
  });  

```


## Installation

    npm install node-ldap2json
