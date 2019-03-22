import * as types from '../constants/transferTypes';

const initialState = {
    status: '',
    loaded: false,
    cardList: [],
    message: '',
}

export default function transferReducer(state=initialState, action) {
    switch (action.type) {
        case types.LOAD_DATA_DOING:
            return {
                ...state,
                status: 'loadData-Loading',
                loaded: false,
                message: 'Loading My Transfer Page ...',
            }
            break;
        case types.LOAD_DATA_DONE_SUCCESS:
            var account = [];
            for(var i=0; i<action.cardList.length; i++)
            {
                account[i] = action.cardList[i].card_id;
            }
            return {
                ...state,
                status: 'loadData-success',
                loaded: true,
                cardList: action.cardList,
            }
            break;
        case types.LOAD_DATA_DONE_ERROR:
            return {
                ...state,
                status: 'loadData-error',
                loaded: false,
                message: action.reason,
            }
            break;

        case types.TRANSFER_DATA_DONE_SUCCESS:
            return {
                ...state,
                status: 'transfer-success',
                cardList: action.cardList,
                loaded: true,
                message: action.reason,
                amount: '',
                accountToBalance:action.accountToBalance,
            }
            break;

        case types.TRANSFER_DATA_DONE_ERROR:
            return {
                ...state,
                status: 'transfer-error',
                loaded: true,
                message: action.reason,
            }
            break;
        default:
            return state;
    }
}