/*_
 * UNICOM(R) Multichannel Bank Transformation Toolkit Source Materials 
 * Copyright(C) 2011 - 2017 UNICOM Systems, Inc. - All Rights Reserved 
 * Highly Confidential Material - All Rights Reserved 
 * THE INFORMATION CONTAINED HEREIN CONSTITUTES AN UNPUBLISHED 
 * WORK OF UNICOM SYSTEMS, INC. ALL RIGHTS RESERVED. 
 * NO MATERIAL FROM THIS WORK MAY BE REPRINTED, 
 * COPIED, OR EXTRACTED WITHOUT WRITTEN PERMISSION OF 
 * UNICOM SYSTEMS, INC. 818-838-0606 
 */

export default Type = {
	getType(T, V, C) {
		var type = _types[T] ? _types[T] : GenType;
		type.init(T, V, C);
		return type;
	}
	
}

var GenType = {
	type   : null,
	value  : null,
	params : null,
	err_pn : null,
	err_pv : null,
	errNLS : null,
	
	init : function(T, V, C){
		this.type   = T;
		this.value  = V;
		this.params = C || {};
		this.err_pn = null;
		this.err_pv = null;
		this.errNLS = null;
		return this;
	},
	
	isEmpty : function(value){
		if ( value === undefined ) value = this.value;
		return  value === undefined ||
				value === null || 
				value === "" ||
				value !== value; // NaN
	},
	
	"isMandatory" : function(){
		return this.params["isMandatory"] ? !this.isEmpty() : true;
	},
	
	isType : function(){
		return true;
	},
	
	toString : function(pattern){
		return String(this.value);
	},
	
	parse : function(value, pattern){
//			this.value = value;
//			return value;
		return ( value !== undefined ) ? value : this.value;
	},
	
	validate : function(){
		var params = Object.assign({}, this.params);

		if (!this.isMandatory())
		{
			this.err_pn = "isMandatory";
			this.err_pv = "true";
			this.errNLS = "isMandatory";
			return false;
		}
		
		if ( params["isMandatory"] !== undefined )	delete params["isMandatory"];
		
		// check Type
		if(!this.isType())
		{
			this.err_pn = "type";
			this.err_pv = this.type;
			this.errNLS = this.type;
			return false;
		}
		
		// check defined params
		for (var param in this.params)
		{
			var pv = this.params[param];
			if ( this[param] && !this[param](pv, this.value) )
			{	
				this.err_pn = param;
				this.err_pv = pv;
				this.errNLS = this.type + "_" + param;
				return false;
			}
		}
		
		return true;
	}
};


var BTTString = {
	"maximumLength" : function(paramv, value){
		if (this.isEmpty(value)) return true;
		
		var L = parseInt(paramv);
		return ("" + value).length <= L;
	},
	
	"minimumLength" : function(paramv, value){
		if (this.isEmpty(value)) return true;
		
		var L = parseInt(paramv);
		return ("" + value).length >= L;
	},
	
	"regExp" : function(paramv, value){
		if (typeof paramv != "string") return false;
		
		if (paramv.charAt(0) != "^") paramv = "^" + paramv;
		if (paramv.charAt(paramv.length-1) != "$" ) paramv += "$";
		
		return new RegExp(paramv).test(value);
	},
	
	parse : function(value, pattern){
		var v = ( value !== undefined ) ? value : this.value;
		return String(v);
	}
};

var BTTNumber = {
	"isType" : function(paramv, value){
		return this.isEmpty() || IsNumeric(this.value);
	},
		
	"maximumNumber" : function(paramv, value){
		if (this.isEmpty(value)) return true;

		var max = Number(paramv);
		var val = Number(value);
		
		if (isNaN(val)) return false;
		if (isNaN(max)) return true;
		
		return max >= val;
	},
	
	"minimumNumber" : function(paramv, value){
		if (this.isEmpty(value)) return true;

		var min = Number(paramv);
		var val = Number(value);
		
		if (isNaN(val)) return false;
		if (isNaN(min)) return true;
		
		return min <= val;
	},
	
//		"pattern" : function(paramv, value){
//			if (typeof paramv != "string") return false;
//			
//			if (paramv.charAt(0) != "^") paramv = "^" + paramv;
//			if (paramv.charAt(paramv.length-1) != "$" ) paramv += "$";
//			
//			return new RegExp(paramv).test(value);
//		},
	
	"decimalPlaces" : function(paramv, value){
		value += "";
		var lip = value.lastIndexOf (".");
		var fl = lip<0 ? 0 : value.length - lip - 1;
		var dp = parseInt(paramv);
		return fl <= dp;
	},
	
	parse : function(value, pattern){
		var v = ( value !== undefined ) ? value : this.value;
		return Number(v);
	}
};

var BTTDate = {
	"isType" : function(paramv, value){
		return this.isEmpty() || this.parse();
	},
	
	"maximumDate" : function(paramv, value){
		
		if (this.isEmpty(paramv) || this.isEmpty(value)) return true;
		
		try{				
			var d = this.parse(value);
			var md = this.parse(paramv);
			return d.getTime() <= md.getTime();
		}catch(e){}
		
		return false;
	},
	
	"minimumDate" : function(paramv, value){
		
		if (this.isEmpty(paramv) || this.isEmpty(value)) return true;
		
		try{				
			var md = this.parse(paramv);
			var d = this.parse(value);
			return d.getTime() >= md.getTime();
		}catch(e){}
		
		return false;			
	},
	
	"pattern" : function(paramv, value){
		return this.isEmpty() || this.parse();
	},
	
//		init : function(T, V, C){
//			GenType.init.call(this,T,V,C);
//			var t = this.parse(V);
//			if (t !== null) this.value = t;
//		},
	
	toString : function(){
		var value = this.parse();
		if (!value) return "";
		
		var p = this._getPattern();
		
		try{
			var y = value.getFullYear();
			var m = parseInt(value.getMonth()) + 1;
			var d = value.getDate();
			
			return p.replace("yyyy", y).replace("MM", m+"").replace("dd", d);
		}catch(e){}
		
		return "";
	},
	
	parse : function(value){
		
		if ( value === undefined ) value = this.value;
		
		if (value instanceof Date) return value;
		
		try{
			var p = this._getPattern();
			var yi = p.indexOf("yyyy");
			var y  = parseInt(value.substr(yi, 4));
			var mi = p.indexOf("MM");
			var m  = parseInt(value.substr(mi, 2));
			var di = p.indexOf("dd");
			var d  = parseInt(value.substr(di, 2));
			
			return new Date(y, m-1, d);				
		}catch(e){}
		
		return null;
	},
	
	_getPattern : function(){
		return this.params["pattern"] || "yyyy-MM-dd";
	}
};

var _types = {};
_types["GenType"] = GenType ;
_types["String"]  = Object.assign({}, GenType, BTTString);
_types["Number"]  = Object.assign({}, GenType, BTTNumber);
_types["Date"]	  = Object.assign({}, GenType, BTTDate);