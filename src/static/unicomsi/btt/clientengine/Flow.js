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
import {Session} from './Session';
import {Store} from './Store';
import utls from './Utilities';

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
const utl = utls;
const conf = con;

	export class Flow {	
		
		constructor(flowName){
			this._flowName = flowName;
			this._procID = null;	// private
			this._state = "initial"; // private
			this._store = new Store();
		}

		establishRequest(data){	
			let form_data = utl.getFormDataFromJSON(data);
			return utl.establishRequest(conf.REQUEST_HANDLER.FLOW, "flow", form_data, "POST", "application/x-www-form-urlencoded")
		};
		
		async _start(input, success, error, context){
			console.log("_start to launch flow")
			if (context != true) context = this;

			var data = Object.assign({},
							input,
							Session.bttState
						);
			data["dse_operationName"] = this._flowName;
			// data["dse_processorState"] = "initial";
			data["dse_nextEventName"] = "start";

			
			return await this.establishRequest(data)
			.then(
				(res)=>{
					console.log("fetch request ", JSON.stringify(res.ok));
					if(res.ok){
						res.json().then(function (response) {
							console.log("_start finished to get store");
							var params = response.params;
							console.debug("Engine.launchFlow : " + context._flowName);
							Session._updateBTTState(params);
							// update status
							context._procID = params["dse_processorId"];
							context._state = params["dse_processorState"];
							// update the store
							context._store.update(response);
							console.log("set _store data");
							if (typeof success == "function") success.call(context,context);
							//return context.procID ? true : false;
							//return context;
						})
					}else{
						if (typeof error == "function") 
							error.call(context, JSON.parse(res._bodyText).error, this);
					}	
				},
				(response)=>{
					console.error(response);
					if (typeof error == "function") error.call(context, response, this);
				}
			)
		};
		
		
		/**
		 * Submit the user input to server(flow) and fire the exit event of the current User State.
		 * The flow will be transited to the next state as the specified event name.
		 * Please note that this method will validate the input data automatically at the beginning of its execution,
		 * if the validation was failed it will call the error call-back function and return false.
		 * Params:
		 * 		eventName, the exit event name, the flow processor will use this name to determine the next state
		 * 		input, the data should be submitted to server, in JSON format
		 * 		success, the call-back function on success, function(store, flow)
		 * 		error, the call-back function on error, function(response, flow, errorFields)
		 * 				errorFields, the error fields that can't pass the validation, undefined if this NOT a validation error
		 * 		context, the context(this) of the above call-back function, null means this flow instance
		 * 
		 * Return:
		 * 		true, success
		 * 		false, failed
		 */
		async changeEvent(eventName, input, success, error, context){
			
			if (context != true) context = this;
			
			input = input ? context._store.extractInputData(input) : {};
			context._store.push(input);
			
			if (!context._store.validate(input))
			{
				var errorFields = context._store.getErrorFields(input);
				console.debug("Flow.changeEvent()-->validate", errorFields);
				if (typeof error == "function") error.call(context, null, this, errorFields);
				return false;
			}
			
			var data = Object.assign({},
//					_store.extractInputData(input),
					input,
					Session.bttState
				);
			data["dse_operationName"] = context._flowName;
			data["dse_processorId"] = context._procID;
			data["dse_processorState"] = context._state;
			data["dse_nextEventName"] = eventName;
			
			var isOK = false;
			
			await this.establishRequest(data)
			.then(
				(res)=>{
					console.log("fetch request ", JSON.stringify(res.ok));
					if(res.ok){
						res.json().then(function (response) {
							var params = response.params;
				
							Session._updateBTTState(params);
							// update status
							context._state = params["dse_processorState"];
							console.debug("Flow.changeEvent: " + eventName);
							// update the store
							context._store.update(response);
							
							isOK = true;
							// create the flow
							if (typeof success == "function") success.call(context, context._store, this);
						})
					}else{
						console.error("flow._start - error: 2");
						if (typeof error == "function") error.call(context, response, this);
					}	
				},
				(response)=>{
					console.error("Flow.changeEvent - error: ", response);
					if (typeof error == "function") error.call(context, response, this);
				}
			)
			//return isOK;
		};
		
		
		/**
		 * Execute an operation under flow(context).
		 * Please note that the context of this operation would be chained under the flow context, 
		 * which means it can access its own operation context, its parent flow context, its parent session context and the application(root) context.
		 * Please note that this method will validate the input data automatically at the beginning of its execution,
		 * if the validation was failed it will call the error call-back function and return false.		 
		 * Params:
		 * 		operationName, the name of the operation
		 * 		input, the data should be submitted to server, in JSON format
		 * 		success, the call-back function on success, function(store, flow)
		 * 		error, the call-back function on error, function(response, flow, errorFields)
		 * 				errorFields, the error fields that can't pass the validation, undefined if this NOT a validation error
		 * 		context, the context(this) of the above call-back function, null means this flow instance
		 */
		execOperation(operationName, input, success, error, context){

			if (context != true) context = this;

			input = input ? _store.extractInputData(input) : {};
			_store.push(input);
			
			if (!_store.validate(input))
			{
				var errorFields = _store.getErrorFields(input);
				console.debug("Flow.changeEvent()-->validate", errorFields);
				if (typeof error == "function") error.call(context, null, this, errorFields);
				return false;
			}
			
			var data = Object.assign({},
//					_store.extractInputData(input),
					input,
					Session.bttState
				);			

			data["dse_operationName"] = operationName;
			data["dse_processorId"] = _procID;
			 
			var xhr = utl.getXHR();
			xhr.open("POST",conf.REQUEST_HANDLER.OP_FLOW,false);
			xhr.ontimeout=function(){
				console.log("timeout...")
			}
			xhr.timeout = 1000;
			xhr.setRequestHeader("BTT-action","op_flow");
			//异步接受响应
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						console.debug("Engine.execOperation : " + operationName);
						
						//Session._updateBTTState(response);
						// update the store and notify
						_store.update(response);
												
						if (typeof success == "function") success.call(context, _store, this);
					}else{
						console.error("Engine.execOperation - error: ", response);
						if (typeof error == "function") error.call(context, response, this);
					}
				}
			}
			xhr.send(utl.flatJSON(data));
			return ;
		};
		
		/**
		 * return the name of the flow instance
		 */
		getName(){
			return this._flowName;
		};
		
		
		/**
		 * return the current state name of the flow instance
		 */
		getState(){
			return this._state;
		};
		
		
		/**
		 * return the store binding to this flow instance
		 */
		getStore(){
			return this._store;
		};
		
	}