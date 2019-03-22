import * as types from '../constants/myAccountDetailTypes';
//import { ClientEngineService } from '../app/unicomsi/btt/clientengine/service/ClientEngineService';
///import { BTT } from '../static/unicomsi/btt/clientengine/BTT';
import { CES } from '../constants/singleton';

//const clientEngineService = new ClientEngineService(BTT);
const clientEngineService = CES;
export function getDetail (id) {
    return dispatch => {
        return clientEngineService.execOperation_ES6("AccountDetailOp", {selectCardId : id})
        .then(
            (store)=>{
                dispatch(showDetailSuccess(store.extractData().selectCardId,store.extractData().historyList,store.extractData().historyList.length));
            }
            ,
            (reason) => {
                dispatch(showDetailFailed(reason));
            }
        )
        .catch(
            (e) => {
                dispatch(showDetailFailed(e));
            }
        )
    }
    
};

function showDetailSuccess(cardId, historyList, total) {
    return {
        type: types.LOAD_DETAIL_DONE_SUCCESS,
        history: historyList,
        cardId: cardId,
        total: total,
    }  
}

function showDetailFailed(reason){
    return {
        type: types.LOAD_DETAIL_DONE_ERROR,
        reason: reason,
    }  
}