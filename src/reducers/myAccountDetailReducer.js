import * as types from '../constants/myAccountDetailTypes';
import { ListView } from 'react-native';

const initialState = {
    status: '',
    loaded: false,
    cardId: '',
    total: 0,
    message: '',
    dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
}

export default function myAccountDetailReducer(state=initialState, action) {
    switch (action.type) {
        case types.LOAD_DATA_DOING:
            return {
                ...state,
                status: 'loadData-Loading',
                loaded: false,
                message: 'Loading My Account Detail Data ...',
            }
            break;
        case types.LOAD_DETAIL_DONE_SUCCESS:
            return {
                ...state,
                status: 'detail-loadData-success',
                loaded: true,
                cardId: action.cardId,
                total: action.total,
                dataSource: state.dataSource.cloneWithRows(action.history),
            }
            break;
        case types.LOAD_DETAIL_DONE_ERROR:
            return {
                ...state,
                status: 'detail-loadData-error',
                loaded: false,
                message: action.reason,
            }
            break;
        default:
            return state;
    }
}