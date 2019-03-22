import { UserModel } from "./user-model";
import { ClientEngineService, Store } from '../app/unicomsi/btt/clientengine/service/ClientEngineService';
import { Flow } from "../app/unicomsi/btt/clientengine/service/Flow";
import { Session } from "../static/unicomsi/btt/clientengine/Session"


export class AuthService {
  debug_s = Session;
  _btt;
  _user;

  // store the URL so we can redirect after logging in
  redirectUrl;

  constructor(_btt, _user){
    this._btt = _btt;
    this._user = _user;
  }

  async login() {
    var _this = this;
    return await this._btt.establishSession()
    .then(
      store => {
          console.log(store);
          return _this._btt.launchFlow_ES6("LoginFlow")
          .then(
            (flow) => {
              _this._btt._flow = new Flow(flow);
               return flow.changeEvent("login", this._user);
             }
          );
      }
    ,
    (reason)=>{
        return Promise.reject(reason);
      } 
    )
    .catch(
      (reason)=>{
        if (!reason.message && reason.errorFields)
        {
          reason.message = "Validation failed, please check your input!";
        }
        return Promise.reject(reason.message);
      } 
    );
  }

  async logout() {
    return await this._btt.destroySession()
  }

  get user() {
    return this._user;
  }
  
  get isLoggedIn() {
    return this._user.isLoggedIn;
  }

  set isLoggedIn(v) {
    this._user.isLoggedIn =v;
  }
}