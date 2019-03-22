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

 // Enable CORS for cross domain access
 var CORS = true;
 var _BASE = "http://10.200.0.198:8080/BTTServerProject/"; // must be postfixed with "/"
 export default Configure = {
	 REQUEST_HANDLER : {
			BASE: _BASE,
			SESSION: _BASE + "openapi/session",
			LOGOUT: _BASE + "openapi/logout",
			FLOW: _BASE + "openapi/flow",
			OP_FLOW: _BASE + "openapi/op_flow",
			OPERATION: _BASE + "openapi/op"
	}
 }