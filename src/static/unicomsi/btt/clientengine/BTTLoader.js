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


// define(? <String>modName, [String]dependencies, <Function>constructor)
// define(? <String>modName, <Function>constructor)
// define(? <String>modName, <Object>object)

// jquery($) and define are global objects, in other words, jquery must be loaded before this
// global.define() ==> define module and save the definition to define.mods [modName:{deps, cons, inst}, ...] when finding modName
//									or initiate the module directly if this is a anonymous module(no modName)
// define.mods
//		name = <String> modName or URI
//		deps = [String] dependencies or []
//		cons = <Function>constructor or <Object>object
//		inst = <Object>object or <Function>constructor.apply(...)
// module status
//		defined, after global.define()
// 		loaded, after define.loadModule() for each deps
//		instantiated : after define.getModule(name)

const isFunction = val => val && typeof val === 'function';
// init define.mods
var _mods = {};
// load module via AJAX synchronously
var _eval = window.eval; // make sure the scope is global

export default class BTTLoader{
	_loadModule(modName){
		if (_mods[modName] === undefined)
		{			
			$.ajax({
				cache : true,
				async : false, 
				url: (_define.baseURL || "") + modName + ".js",
				dataType: "text",
				success: function(def){
					_define._modName = modName;
					_mods[modName] = _eval(def);
					delete _define._modName;
				}
			});
		}
		
		return _mods[modName];
	};

	// normalize the (relative) path/package of module(mp) based on module(name)
	_normalizePath(mp, name){
		
		if (!name || !mp || mp.charAt(0) != '.' ) return mp;
		
		var i = name.lastIndexOf('/');
		var cp = i<0 ? "" : name.substring(0, i+1);
		var ps = (cp + mp).split('/');
		var mps = [];
		for(var p; p = ps.shift();)
		{
			switch (p){
			case "." :
				continue;
			case ".." :
				mps.pop();
				continue;
			default :
				mps.push(p);
			}
		}
		
		mp = mps.join("/");
		
		return mp;
	};



	
}

window.BTT = {
	_normalizePath : _normalizePath, // for test only
	_loadModule : _loadModule, // for test only
	
	/**
	 *  url , String, the base url to load BTT module
	 *  ijsf, String, [optional] the relative path to the (I)ntegrated JS (F)ile
	 */
	loadBTT : function(url, ijsf){
		_define.baseURL = url + "/";
		
		if (ijsf)
		{
			var len = ijsf.length;
			if (ijsf.substr(len-3) == ".js") ijsf = ijsf.substr(0, len-3);
			_loadModule(ijsf);
		}
		
		$.extend(window.BTT, _loadModule("unicomsi/btt/clientengine/BTT"));
	}
};

var _define = window.define = function(/* ? <Sring> */modName, /* ? [String] */ dependencies, /* <Function> or <Object> */ constructor)
	{
		// align the arguments
		var name, deps, cons;
		// define module with modName
		if(typeof modName == "string")
		{
			name = modName;
			deps = $.isArray(dependencies) ? dependencies : [];
			cons = constructor!==undefined ? constructor : dependencies;
		}else{			
			// define module anonymously, without modName
			name = _define._modName;
			deps = $.isArray(modName) ? modName : []; // args[0]
			cons = dependencies!==undefined ? dependencies : modName; // args[1]
		}
		
		if (name && _mods[name]) return _mods[name];
		
		// define([deps], function(){...})
		// load deps modules
		for(var i=0; i<deps.length; i++)
		{
			switch (deps[i])
			{
			case "jquery" :
				deps[i] = $;
				break;
			default:
				deps[i] = _loadModule(_normalizePath(deps[i], name));
			}
		}

		var mod = $.isFunction(cons) ?
				// define(? name, [deps], function(...){...})
				cons.apply(window, deps)
				:
				// define(? name, {...})
				cons;
		if (name) _mods[name] = mod;
		return mod;
	};
