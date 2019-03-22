import * as types from '../constants/myAccountTypes';
//import { ClientEngineService } from '../app/unicomsi/btt/clientengine/service/ClientEngineService';
//import { BTT } from '../static/unicomsi/btt/clientengine/BTT';
import { CES  } from '../constants/singleton';

//const clientEngineService = new ClientEngineService(BTT);
const clientEngineService = CES;
export function initAction () {
    return dispatch => {
        return clientEngineService.execOperation_ES6("AccountStatementOp")
        .then(
            (store)=>{
                //let flow = clientEngineService.getFlow();
                dispatch(loadDataSuccess(store.extractData().cardList,store.extractData().total_balance));
            },
            (reason) => {
                dispatch(loadDataFailed(reason));
            }
        )
        .catch(
            (e) => {
                dispatch(loadDataFailed(e));
            }
        )
    }
};

function loadDataSuccess(cardList, total_balance) {
    return {
        type: types.LOAD_DATA_DONE_SUCCESS,
        cardList: cardList,
        total_balance: total_balance,
    }  
}

function loadDataFailed(reason){
    return {
        type: types.LOAD_DATA_DONE_ERROR,
        reason: reason,
    }  
}