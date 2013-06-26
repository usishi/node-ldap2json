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
				console.log(e);
				console.log(newSearchOptions);
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


exports.getJson=function(options,cb){

		var recfunc=this;
		var me={base:options.base,items:[]};
	  
	  lib.searchInLdap(options.host,options.username,options.password,options.base,function(e,items){	
	  	if (e){
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
	}

exports.getSecurityGroups=function(options,cb){

  lib.getAllInLdap(options.host,options.username,options.password,options.base,function(e,items){	
  	if (e){
  		cb(e,null);
  		return;
  	}
    cb(null,items);
  });
}

exports.checkUser=function(options,cb){

  lib.tryBind(options.host,options.username,options.password,options.base,function(e,items){	
  	if (e){
  		cb(e,null);
  		return;
  	}
    cb(null,items);
  });
}	

