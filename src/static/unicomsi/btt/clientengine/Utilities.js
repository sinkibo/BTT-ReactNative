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

import conf from './Configure';

function _flatJSON(dest, de, compositeKey){
		
	if ( de===undefined ) return;
	
	// de is field
	if (toString.call(de)!="[object Object]" && toString.call(de)!="[object Array]")
	{
		if(compositeKey) dest[compositeKey] = de;
		return;
	}
	
	// de is record or array
	for (var f in de)
	{
		_flatJSON(dest, de[f], (compositeKey && compositeKey!="") ? (compositeKey+"." + f) : f);
	}
};

export default Utilities = {
	_corsHelper(request, cors){
		return (cors||conf.CORS) ? Object.assign(request, {
			xhrFields : {
				withCredentials: true
			},
			crossDomain: true
		}) : request;
	},
	
	isEmpty(value){
		return  value === undefined ||
				value === null || 
				value === "" ||
				isNaN(value);
	},
	
	flatJSON(json){
		var r = {};
		_flatJSON(r, json);
		return r;
	},
	
	_getInput(input){
		return Object.assign({}, input);
	},
	
	// filter the btt state(start with dse_) from the data
	_filterBTTState(/* _json */ data){
		var state = {};
		for (var f in data){
			if (f.substr(0,4)=="dse_"){
				state[f] = data[f];
				delete data[f];
			}
		}
		return state;
	},

	establishRequest(url,action,data,method="POST",Contenttype="application/json",Accept="application/json"){
		return fetch(url, {
			credentials: 'include',
			method: method,
			headers: {
				"BTT-action":action,
				'Accept': Accept,
				'Content-Type': Contenttype
			},
			body: data
		})
	},

	getFormDataFromJSON(data,parent=""){	
		let form  = JSON.parse(JSON.stringify(data));
		let form_data = "";
		for (var key in form)
		{
			if(toString.call(form[key])=="[object Object]"){
				form_data += this.getFormDataFromJSON(form[key],key) + "&";
			}else{
				form_data += (parent === "" ? "" : parent+".") +key + "=" + form[key] + "&";
			}
		}
		return form_data.length > 0 ? form_data.substr(0,form_data.length-1): form_data;
	},
}