import { BTT } from '../static/unicomsi/btt/clientengine/BTT';
import { ClientEngineService } from '../app/unicomsi/btt/clientengine/service/ClientEngineService';
import { UserModel } from "../data/user-model";
import { AuthService } from '../data/auth-service';

export var CES = new ClientEngineService(BTT);
export var USER =new UserModel();
export var AUTHS = new AuthService(CES, USER);
