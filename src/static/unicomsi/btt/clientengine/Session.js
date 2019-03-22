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
import con from './Configure';
import {Store} from './Store';
import  utls from './Utilities';

const utl = utls;
const conf = con;
export var Session = {	
	
	bttState : {
		dse_sessionId: null,
		dse_applicationId : "-1",
		dse_pageId : "-1",
			
		dse_timezone : (-(new Date().getTimezoneOffset() / 60)).toString()
	},

	_updateBTTState(data){
	// session.bttState.dse_sessionId = data["dse_sessionId"];
		if (data["dse_applicationId"]) Session.bttState.dse_applicationId = data["dse_applicationId"];
		if (data["dse_pageId"]) Session.bttState.dse_pageId = data["dse_pageId"];
	//if (data["dse_timezone"]) session.bttState.dse_timezone = data["dse_timezone"];
	},
					
	/**
	 * Establish session with BTT server
	 * Params:
	 * 		success, the call-back function on success, function(store)
	 * 		error, the call-back function on error, function(response)
	 * 		context, the context(this) of the above call-back function, null means this session instance
	 * 		locale, the preferred local, use the browser's setting by default
	 * 		timeZone, the preferred time zone, use the server's setting by default
	 * 		input, the data should be submitted to server, in JSON format
	 */
	async establish(success, error, context, locale, timeZone, input){
		// prepare input data, time zone and locale
		var store = null;
		var data = utl._getInput(input);
		if (timeZone) bttState.dse_timezone = timeZone;
		if (locale) data["dse_locale"] = locale;
			
		await utl.establishRequest(conf.REQUEST_HANDLER.SESSION,"session",JSON.stringify(utl.flatJSON(data)))
			.then(
				(res)=>{
					console.log("fetch request success ?", JSON.stringify(res.ok));
					if(res.ok){
						res.json().then(function (response) {
							//var response = JSON.parse(responseText._bodyText);
							var params = response.params;
							console.debug("session.establish: " + params["dse_sessionId"]);
							// update BTT state
							Session._updateBTTState(params);
							Session.bttState.dse_sessionId = params["dse_sessionId"];
							// update locale & timezone
							Session.locale = params["dse_locale"];
							Session.timeZone = params["dse_timezone"];
							
							// update the store and notify
							store = new Store();
							store.update(response);
											
							//				// check server validation error
							//				var errFields = store.getErrorFields();
							//				if (errFields && typeof error == "function")
							//				{
							//					console.error("session.establish - server validation error: ", errFields);
							//					error.call(context || session, response, errFields);
							//					return;
							//				}
											
							if (typeof success == "function") success.call(context || Session, store);
							console.log("return store after establish session");
							//return store;
						});
					}else{
						console.error("session.establish - error: 2");
					}
				},
			(res)=>{
				if (typeof error == "function") error.call(context || Session, res);
				}
			)
	},
					
					
	/**
	 * Destroy the session and disconnect with BTT server
	 * Params:
	 * 		success, the call-back function on success, function(response)
	 * 		error, the call-back function on error, function(response)
	 * 		context, the context(this) of the above call-back function, null means this session instance
	 */
	async destroy(success, error, context){
		await utl.establishRequest(conf.REQUEST_HANDLER.LOGOUT,"logout","")
		.then(
			(es) => {
				// update ID
				// session.ID = null;
				Session.bttState.dse_sessionId = null;
				console.debug("session.destroy");
									
				if (typeof success == "function") success.call(context || Session);
			}
			, (response) => {
				console.error("session.destroy - error: ", response);
				if (typeof error == "function") error.call(context || Session, response);
			}
		)
	}
}
