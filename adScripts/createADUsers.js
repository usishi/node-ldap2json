var
  fs = require('fs');

var ou ='ou=SGroups,ou=Bayiler,dc=bh,dc=pvt';

var arr=['a','ab','b','c','D','e','f','g','h','i','j','ju','k','ki','ku','l','m','ma','me','mu','n','na','z','y']

fs.appendFileSync('runthis.bat','dsadd ou "'+ou+'"\n');	
var grpname;

for(i=0;i<2000;i++){

	if (i%100==0){
		grpname=arr.pop();
	}
	
	fs.appendFileSync('runthis.bat','dsadd group "cn='+grpname+'SecurityG'+i+','+ou+'" -secgrp yes\n');

}