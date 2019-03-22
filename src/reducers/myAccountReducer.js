import * as types from '../constants/myAccountTypes';
import * as transfertypes from '../constants/transferTypes';
import { ListView } from 'react-native';

const initialState = {
    status: '',
    loaded: false,
    cardList: [],
    total_balance: 0,
    message: '',
    dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
}

export default function myAccountReducer(state=initialState, action) {
    switch (action.type) {
        case types.LOAD_DATA_DOING:
            return {
                ...state,
                status: 'loadData-Loading',
                loaded: false,
                message: 'Loading My Account Data ...',
            }
            break;
        case types.LOAD_DATA_DONE_SUCCESS:
            return {
                ...state,
                status: 'loadData-success',
                loaded: true,
                cardList: action.cardList,
                total_balance: action.total_balance,
                dataSource: state.dataSource.cloneWithRows(action.cardList),
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
        case transfertypes.TRANSFER_DATA_DONE_SUCCESS:
            return {
                ...state,
                status: 'loadData-success',
                loaded: true,
                cardList: action.cardList,
                dataSource: state.dataSource.cloneWithRows(action.cardList),
            }
        break;
        default:
            return state;
    }
}