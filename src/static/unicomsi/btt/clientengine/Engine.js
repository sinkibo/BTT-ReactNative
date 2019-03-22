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
import { Session } from './Session';
import { Flow } from './Flow';
import { Store } from './Store';
import utls from './Utilities';

const utl = utls;

export var Engine = {

	/**
	 * Launch a new flow.
	 * Params:
	 * 		flowName, the name of the flow
	 * 		input, the data should be submitted to server(the flow context), in JSON format
	 * 		success, the call-back function on success, function(store)
	 * 		error, the call-back function on error, function(response)
	 * 		context, the context(this) of the above call-back function, null means this session instance
	 * 
	 * Return:
	 * 		the new flow instance, you can access its name(getName), state(getState) and store(getStore) via it. 
	 * 
	 */
	launchFlow(flowName, input, success, error, context){
		var flow = new Flow(flowName);
		flow._start(input, success, error, context);
		return flow;
	},

	establishRequest(data){	
		let form_data = utl.getFormDataFromJSON(data);
		return utl.establishRequest(conf.REQUEST_HANDLER.OPERATION,"op",form_data,"POST", "application/x-www-form-urlencoded")
	},

	/**
	 * Execute a stand-alone operation.
	 * Please note that for a stand-alone operation its context is chained under the session context, 
	 * which means it can only access its own operation context, its parent session context and the application(root) context.
	 * Params:
	 * 		operationName, the name of the operation
	 * 		input, the data should be submitted to server, in JSON format
	 * 		success, the call-back function on success, function(store)
	 * 		error, the call-back function on error, function(response)
	 * 		context, the context(this) of the above call-back function, null means this session instance
	 */
	async execOperation(operationName, input, success, error, context){

		if (context != true) context = this;
			
		var data = Object.assign({},
					input,
					Session.bttState
				);
		data["dse_operationName"] = operationName;

		await this.establishRequest(data)
		.then(
			(res) => {
				console.debug("Engine.execOperation : " + operationName);
				console.log("loadData request ?", JSON.stringify(res.ok));
				if(res.ok){
					res.json().then(function (response) {
						var params = response.params;
						Session._updateBTTState(params);

						var store = new Store();
						store.update(response);
											
											
						if (typeof success == "function") success.call(context, store);
					});
				}else{
					//console.error("Engine.execOperation - error: ", res);
					if (typeof error == "function") 
						error.call(context, JSON.parse(res._bodyText).error, this);
				}
			}
			, (response) => {
				console.error("Engine.execOperation - error: ", response);
				if (typeof error == "function") error.call(context, response);
			}	
		)
	}
}