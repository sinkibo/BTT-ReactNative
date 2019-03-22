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
import { Engine } from './Engine';
import { Session } from './Session';
import { Flow } from './Flow';
import { Store } from './Store';
import { Message } from './Message';
import { Functions } from './Functions';
import { conf } from './Configure';

Engine.COPYRIGHT = 
Session.COPYRIGHT =
Flow.COPYRIGHT =
Store.COPYRIGHT = 
Message.COPYRIGHT = 
Functions.COPYRIGHT = "UNICOM";

Engine.establishSession = Session.establish.bind(Session);
Engine.destroySession  = Session.destroy.bind(Session);

Engine.CONF = conf;

export { Engine as BTT };