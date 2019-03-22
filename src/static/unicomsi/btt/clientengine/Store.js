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
import type from './Type';

export class Store{

	// For internal use only
	/**
	* Update the store based on the response from server
	*/
	update(response){
//		this.resp = response;
		this.target = response["target"];
		this.meta = response["data"];
	};

	/**
	* Push the user input data into the store
	* Params:
	* 		input, user input data in JSON format
	*/
	push(input){
		_push(input, this.meta);
	};
		
		
	/**
	 * Validate data based on the type and parameters defined at BTT Context in server side
	 * It has below forms depending on the parameters:
	 *		validate(compositeKey) for a data element with its value at store
	 *		validate(compositeKey, value) for a data element with specified value
	 *		validate(compositeKey, onError) for a data element with onError call-back function
	 *		validate(compositeKey, onError, value) for a data element with onError and value
	 *		validate(inputSet) for the specified input set
	 *		validate(inputSet, onError) for the specified input set with onError call-back function
	 *		validate() for the whole store
	 * Params:
	 * 		compositeKey, the composite key of the data element, for example: keyedColl.keyedColl.field, keyedColl.indexedColl
	 * 		value, the data value to be validated, use the store value instead if not provide
	 * 		onError, the call-back function on error, function(element, compositeKey, value)
	 * 		inputSet, only validate the data element at inputSet but using the value at store, in JSON format
	 * Return:
	 * 		true, no error
	 * 		false, validation failure
	 */
	validate(compositeKey_or_input, onError, value){
			
		var compositeKey = typeof compositeKey_or_input=="string" ? compositeKey_or_input : null;
		var de = typeof compositeKey=="string" ? this.find(compositeKey) : this.meta;
		var inputSet = toString.call(compositeKey_or_input)=="[object Object]" ? compositeKey_or_input : de;
		if ( value===undefined && typeof onError!="function" ) value = onError;
			
		var isV = _validate(de, inputSet, value);
			
		if (!isV && typeof onError == "function")
		{
			onError.call(this, de, compositeKey, value);
		}
			
		return isV;
	};
		
		
	/**
	 * Get the Data Element with validation error from the store
	 * It has below forms depending on the parameters:
	 * 		getErrorFields() for the whole store
	 * 		getErrorFields(compositeKey) for the specified data element
	 * 		getErrorFields(inputSet) for the specified input set
	 * Params:
	 * 		compositeKey, the composite key of the data element, for example: keyedColl.keyedColl.field, keyedColl.indexedColl
	 * 		inputSet, only check the store data element defined in inputSet, in JSON format
	 * Return:
	 *		null : no error
	 *		error: {
	 *				compositeKey : de // for each of data element with error
	 *		}
	 */
	getErrorFields(compositeKey_or_input){

		var compositeKey = typeof compositeKey_or_input=="string" ? compositeKey_or_input : null;
		var de = typeof compositeKey=="string" ? this.find(compositeKey) : this.meta;
		var inputSet = toString.call(compositeKey_or_input)=="[object Object]" ? compositeKey_or_input : de;
			
		var error = {};
		_getErrorFields(error, de, compositeKey, inputSet);
		for (var n in error)
		{
			return error; // not empty, find error
		}
		
		return null;
	};
		

// should be done by UI controls inputing <--> display <--> value
//		this.format = function(compositeKey){
//		};
//		this.unformat = function(compositeKey, value){
//		};
		
		
	/**
	* Extract the data from store, in plain JSON format 
	* Return:
	* 		JSON object
	*/
	extractData(){
		return _copyData(this.meta);
	};
		
		
	/**
	* Extract the input data, which could be submitted to server , from store, in plain JSON format 
	* Return:
	* 		JSON object
	*/
	extractInputData(input){
		if (input === undefined) return _copyData(this.meta, true);
		return _intersectionCopyInputData(input, this.meta);
	};
		
		
	/**
	 * Get data value from the store
	 * Params:
	 * 		compositeKey, the composite key of the data element, for example: keyedColl.keyedColl.field, keyedColl.indexedColl
	 * Return:
	 * 		object, JSON for Record and List, value Object for data field, null if can't find
	 * 
	 */
	getValueAt(compositeKey){
		var de = this.find(compositeKey);
//		return de ? de._ : null;
		if (de == null) return null; // can't find
		if (de._ === undefined)	return _copyData(de); // Record or List
		var type = Type.getType(de.t, de._, de.c); // data field
		return type.parse();
	};
		
		
	/**
	 * Set value to the data element at store
	 * Params:
	 * 		compositeKey, the composite key of the data element, for example: keyedColl.keyedColl.field, keyedColl.indexedColl
	 * 		value, the value to be set
	 */
	setValueAt(compositeKey, value){
		var n = this.find(compositeKey);
		if (n && _validate(n, value))
		{
			n._ = value;
			return true;
		}

		return false;
	};
		
		
	// For internal use only
	/**
	 * Find/Get the raw data element at store by its compositeKey
	 */
	find(compositeKey){

		var keys = compositeKey.split(".");
		
		var i,p;
		for (i=0, p=this.meta; p && i<keys.length; i++)
		{
			p = p[keys[i]];
		}
			
		return i<keys.length ? null : p;
	};

	
}

function _push(src, dest){
	// field
	if (dest && dest._!==undefined)
	{
		if(dest.w) dest._ = src;
		return;
	}
	
	if (toString.call(src)!="[object Object]" && toString.call(src)!="[object Array]") return;
	
	for (var f in src)
	{
		_push(src[f], dest[f]);
	}
};

// validate the data element : record, array or field
function _validate(de, inputSet, value){
	
	if (!de) return false; // can't find the node
	// if (!de)
	// {
	// 	console.warn("The inputSet contains more data fields than expected!");
	// 	return true; // can't find the node
	// }

	var isV = true;
	// de is record or array
	if ( de._ === undefined && (toString.call(de)=="[object Object]" || toString.call(de)=="[object Array]"))
	{
		for (var f in inputSet)
		{
			isV = _validate(de[f], inputSet[f], value) && isV;
		}
		return isV;
	}
	
	// de is field
	if (!de.w) return true;
	
	if (value === undefined) value = de._;
	var type = Type.getType(de.t, value, de.c);
	isV = type.validate();
	
	// set the error info
	if (isV)
	{
		if (de.e) delete de.e;
	}else{
		de.e = {
				err_v  : value,
				err_pn : type.err_pn,
				err_pv : type.err_pv,
				errNLS : type.errNLS
		};
		console.debug("Store.validate()-->_validate", de.t, de.c, de.e);
	}
	
	return isV;			
};

function _getErrorFields(error, de, compositeKey, inputSet){
	if (!de || typeof de != "object") return;
	
	// de is record or array
	if ( de._ === undefined && (toString.call(de)=="[object Object]" || toString.call(de)=="[object Array]"))
	{
		for (var f in inputSet)
		{
			_getErrorFields(error, de[f], ((compositeKey && compositeKey!="") ? (compositeKey+"." + f) : f), inputSet[f]);
		}
		return;
	}
	
	// de is field
	if (de.e)  error[compositeKey] = de;
};
	
//	var _copyArray = function(a, w){
//		var r = [];
//		for (var i=0; i<a.length; i++)
//		{
//			r[i] = _copyData(a[i], w);
//		}
//		
//		return r;
//	};

function _copyData(src, w){
	
	if (src==null || typeof src != "object") return undefined;

	if (src._ !== undefined) // data field
	{
//			return (w && !src.w) ? undefined : src._;
		if (w && !src.w)  return undefined; // ? writable
		var type = Type.getType(src.t, src._, src.c);
		return type.parse();
	}
	
	if (toString.call(src)!="[object Object]" && toString.call(src)!="[object Array]") return undefined;
	
//	if (Array.isArray(src)) return _copyArray(src, w);
	var r = Array.isArray(src) ? [] : {};
	var v;
	for (var name in src)
	{
		v = _copyData(src[name], w);
		if (v !== undefined) r[name] = v;
	}
	
	return r;
};	

function _intersectionCopyInputData(input, src){
	if (input===undefined || src===undefined || src==null || typeof src != "object") return undefined;

	if (src._ !== undefined) // data field
	{
		return src.w ? input : undefined;
	}
	
	if (toString.call(input)!="[object Object]" && toString.call(input)!="[object Array]") return undefined;
	// record or array
	var r = Array.isArray(src) ? [] : {};
	var v;
	for (var name in input)
	{
		v = _intersectionCopyInputData(input[name], src[name]);
		if (v !== undefined) r[name] = v;
	}
	
	return r;
};