import * as types from '../constants/transferTypes';
import { ClientEngineService } from '../app/unicomsi/btt/clientengine/service/ClientEngineService';
import { BTT } from '../static/unicomsi/btt/clientengine/BTT';
import utls from '../static/unicomsi/btt/clientengine/Utilities';

const utl = utls;
//import { CES } from '../constants/singleton';

const clientEngineService = new ClientEngineService(BTT);
//const clientEngineService = CES;
export function initAction () {
    return dispatch => {
        return clientEngineService.execOperation_ES6("AccountStatementOp")
        .then(
            (store)=>{
                dispatch(loadDataSuccess(store.extractData().cardList));
            },
            (reason) => {
                dispatch(loadDataFailed(reason.response ? reason.response : reason));
            }
        )
        .catch(
            (e) => {
                dispatch(loadDataFailed(e));
            }
        )
    }
};

export function doTransfer (cardList,accountFrom,accountTo,amount) {
    var transferData = {"transferForm": {"fromCardId":accountFrom,"toCardId":accountTo,"amount":parseFloat(amount)}}
    return dispatch => {
        return clientEngineService.launchFlow_ES6("AccountTransferFlow").then(
            (store)=>{
                clientEngineService.getFlow("AccountTransferFlow").changeEvent("submit", transferData).then(
                    (store) => {
                        console.log("Success to do transfer" + store);
                        let flow = clientEngineService.getFlow();
                        if (flow.getState() !="ResultState" ) // error at server side
                        {
                            dispatch(doTransferFailed(flow.getStore().extractData()));
                        }else{
                            flow.changeEvent("exit").then(()=>{
                                let transferResultData = flow.getStore().extractData();
                                transferResultData.transferForm.amount = parseFloat(transferResultData.transferForm.amount.replace("$","").replace(/,/g,""));
                                var balance = '';
                                for(var i=0; i<transferResultData.cardList.length; i++)
                                {
                                    if(accountTo == transferResultData.cardList[i].card_id){
                                        balance = transferResultData.cardList[i].balance;
                                        break;
                                    }
                                }
                                dispatch(doTransferSuccess(transferResultData.cardList,"Success to transfer $"+ transferResultData.transferForm.amount,balance));
                            }).catch(() => {
                                dispatch(doTransferFailed("Fail to do exit transfer flow."));
                            })
                        }
                    }
                  ).catch((e) => {
                    dispatch(doTransferFailed("Fail to change event : submit"));
                  }) 
            }
        ).catch((e) => {
            dispatch(doTransferFailed("Fail to launch Flow: AccountTransferFlow"));
        }) 
        
         
    }
}


function loadDataSuccess(cardList) {
    return {
        type: types.LOAD_DATA_DONE_SUCCESS,
        cardList: cardList,
        reason: "",
    }  
}

function loadDataFailed(reason){
    return {
        type: types.LOAD_DATA_DONE_ERROR,
        reason: reason,
    }  
}

function doTransferSuccess(cardList,message,accountToBalance){
    return {
        type: types.TRANSFER_DATA_DONE_SUCCESS,
        cardList: cardList,
        reason: message,
        accountToBalance:accountToBalance,
    }  
}

function doTransferFailed(reason){
    return {
        type: types.TRANSFER_DATA_DONE_ERROR,
        reason: reason,
    }  
}

