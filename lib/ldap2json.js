var 
extend = require('util')._extend,
lib=require('./functions');



var fillChilds=function(itm,options,cr,cb){
	var newSearchOptions= extend({},options);

	if (itm.type=="OU"){
	  newSearchOptions.base='ou='+itm.name+','+options.base;
		cr.getJson(newSearchOptions,function(e,t){
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
	    if (count==0){
	      cb(null,me);
	    } else {
	    	items.forEach(function(itm){ 
		      fillChilds(itm,options,recfunc,function(obj){
		        me.items.push(obj);
		        count--;
		        if(count<=0){
		          cb(null,me);
		        }
		      }) 
	    	});
	    }
	  });
	}
