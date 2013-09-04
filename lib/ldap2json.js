var 
extend = require('util')._extend,
lib=require('./functions');



var fillChilds=function(itm,options,cr,cb){
	if (itm.hide){
		cb(null);
		return;
	}
	var newSearchOptions= extend({},options);
	var searchChild=true;

	if(itm.type=="OU"){
		newSearchOptions.base='ou='+itm.name+','+options.base;
	} else if (itm.type=="CN") {
		newSearchOptions.base='cn='+itm.name+','+options.base;
	} else {
		searchChild=false;
	}

	if (searchChild){
		cr.getJson(newSearchOptions,function(e,t){
			if (e){
				console.log("fillChilds:"+e);
				console.log("fillChilds:"+JSON.stringify(newSearchOptions));
				return;
			}
	  	if (t.items.length>0){
	  		itm.haschilds=true;		
	  		itm.items=t;
	  	} else {
	  		itm.haschilds=false;
	  	}
	    cb(itm);
	  });   
	} else {
  	itm.haschilds=false;
  	cb(itm);
	} 
}


function checkOptions(options,cb){
	if (options.adminuser==undefined){
		options.adminuser=options.uname;
		options.adminpass=options.pwd;
  } 
  if (options.base==null) { 
  	options.base="dc="+options.domain.replace(".",",dc=").replace(".",",dc=").replace(".",",dc=").replace(".",",dc=").replace(".",",dc="); 
  }
  cb(options);
}

exports.getJson=function(options,cb){
	var recfunc=this;
	var me={base:options.base,items:[]};
 	checkOptions(options,function(newoptions){
 		options=newoptions;
 		lib.searchInLdap(options,function(e,items){	
	  	if (e){
	  		console.log("getJson:"+e);
	  		cb(e,null);
	  		return;
	  	}
	  	
	    var count=items.length;
	    if (count==0) {
	      cb(null,me);
	    } else {
	    	items.forEach(function(itm){ 
		      fillChilds(itm,options,recfunc,function(obj){
		        if (obj!=null){
		        	me.items.push(obj);
		        }
		        count--;
		        if(count<=0){
		          cb(null,me);
		        }
		      }) 
	    	});
	    }
	  });
 	})
}

exports.getSecurityGroups=function(options,cb){
	checkOptions(options,function(newoptions){
 		options=newoptions;
	  lib.getSGroupsInLdap(options,function(e,items){	
	  	if (e){
	  		console.log("getSecurityGroups:"+e);
	  		cb(e,null);
	  	} else {
	    	cb(null,items);
	  	}
	  });
	});
}

exports.checkUser=function(options,username,password,cb){
	checkOptions(options,function(newoptions){
 		options=newoptions;
	  lib.getUser(options,username,password,function(e,user){	
	  	if (e){
	  		console.log("CheckUser err :"+e+'\n'+JSON.stringify(options)+'\n'+username+'\n'+password);
	  		cb(e,null);
	  	} else {
	  		cb(null,user);	
	  	}
	  });
	});
}

exports.searchUser=function(options,keyword,cb){
	checkOptions(options,function(newoptions){
 		options=newoptions;
		lib.search(options,keyword,'user',function(e,items){
			if (e){
				cb(e,null);
			} else {
				cb(null,items);	
			}
		});
	});
}

