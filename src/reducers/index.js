import { combineReducers } from 'redux';
import loginInReducer from './loginReducer'; 
import myAccountReducer from './myAccountReducer'; 
import myAccountDetailReducer from './myAccountDetailReducer'; 
import transferReducer from './transferReducer'; 

const rootReducer = combineReducers({
    loginIn: loginInReducer,
    myAccount:  myAccountReducer,
    myAccountDetail:  myAccountDetailReducer,
    transfer:  transferReducer,
});

export default rootReducer; 