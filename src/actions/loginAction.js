import * as types from '../constants/loginTypes';
//import { AuthService } from '../data/auth-service';
//import { clientEngineService } from '../app/unicomsi/btt/clientengine/service/ClientEngineService';
import { CES, USER, AUTHS } from '../constants/singleton';
//import { UserModel } from "../data/user-model";
//import { BTT } from '../static/unicomsi/btt/clientengine/BTT';

//const clientEngineService = new ClientEngineService(BTT);
//const user = new UserModel();
//const auths = new AuthService(clientEngineService, user);
const auths = AUTHS;
const user = USER;
const clientEngineService=CES;
export function login(account,password) {
    return dispatch => {
        dispatch(isLogining()); // 正在执行登录请求
        auths.user.account_id = account;
        auths.user.password = password;
        return auths.login().then(() => {
                let flow = auths._btt.getFlow();
                let store = flow.getStore();
                auths.isLoggedIn = (auths._btt.getFlow().getState() == "OK" ? true : false);
                sleep(500).then(() => {
                    if(auths.isLoggedIn){
                        auths.user._name = store.getValueAt("name");
                        auths.user._gender = store.getValueAt("gender");
                        dispatch(loginSuccess(true,auths.user)); // 登录请求完成
                    }else{
                        dispatch(loginSuccess(false,user,store.getValueAt("message"))); // 登录请求完成失败
                    }
                }) 
            }).catch(
                (reason) => {
                    dispatch(loginError(reason)); // 登录请求出错
                }
            ); 
    }  
}

export function logout() {
    return dispatch => {
        dispatch(isLogouting()); 
        return auths.logout().then(() => {
                auths.user._name = null;
                auths.isLoggedIn = false;
                sleep(500).then(() => {
                    dispatch(logoutSuccess(true,auths.user)); // 登录请求完成
                }) 
            }).catch(
                (reason) => {
                    dispatch(logoutError(reason)); 
                }
            ); 
    }  
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
    
function isLogining() {
    return {
        type: types.LOGIN_IN_DOING
    }
}

function isLogouting() {
    return {
        type: types.LOGIN_OUT_DOING
    }
}
    
function loginSuccess(isSuccess, user, message) {
    console.log(isSuccess);
    if(isSuccess){
        return {
            type: types.LOGIN_IN_DONE_SUCCESS,
            user: user,
        }
    }else{
        return {
            type: types.LOGIN_IN_DONE_ERROR,
            message: message,
        }
    }
     
}

function logoutSuccess(isSuccess, user, message) {
    console.log(isSuccess);
    if(isSuccess){
        return {
            type: types.LOGIN_OUT_DONE_SUCCESS,
            user: user,
        }
    }else{
        return {
            type: types.LOGIN_OUT_DONE_ERROR,
            message: message,
        }
    }
     
}
    
function loginError(message) {
    console.log('error');  
    return { 
        type: types.LOGIN_IN_ERROR,
        message: message,
    }    
}

function logoutError(message) {
    console.log('error');  
    return { 
        type: types.LOGIN_OUT_ERROR,
        message: message,
    }    
}