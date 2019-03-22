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

var topics = {};

var Topic = function(id) {
	var callbacks, topic = id && topics[id];

	if (!topic)
	{
		callbacks = $.Callbacks();
		topic = {
			publish : callbacks.fire,
			subscribe : callbacks.add,
			unsubscribe : callbacks.remove
		};
		
		if (id) 
		{
			topics[id] = topic;
		}
	}
	return topic;
};

export var Message = {
		subscribe : function(topic, func){
			Topic(topic).subscribe(func);
		},
		
		unsubscribe : function(topic, func){
			Topic(topic).unsubscribe(func);
		},
		
		publish : function(topic, msg){
			Topic(topic).publish(msg);
		}
			
};