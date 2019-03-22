import * as types from '../constants/loginTypes';
import { CES, USER, AUTHS} from '../constants/singleton';
const clientEngineService = CES;
const auths = AUTHS;

const initialState = {
    status: 'init',
    isSuccess: false,
    user: USER,
    clientEngineService: clientEngineService,
    auths: auths
}

export default function loginInReducer(state=initialState, action) {
    switch (action.type) {
        case types.LOGIN_IN_DOING:
            return {
                ...state,
                status: 'login-Loading',
                isSuccess: false,
                message: 'Loading ...',
                isLoggedIn: false,
            }
            break;
        case types.LOGIN_IN_DONE_SUCCESS:
            return {
                ...state,
                status: 'login-success',
                isSuccess: true,
                user: action.user,
                message: '',
                isLoggedIn: true,
            }
            break;
        case types.LOGIN_IN_DONE_ERROR:
            return {
                ...state,
                status: 'login-failed',
                isSuccess: true,//run done, but the result is failed. for example: account and pwd error.
                message: action.message,
                isLoggedIn: false,
            }
            break;
        case types.LOGIN_IN_ERROR:
            return {
                ...state,
                status: 'login-failed',
                isSuccess: false,
                message: action.message,
                isLoggedIn: false,
            }
            break;
            case types.LOGIN_OUT_DOING:
            return {
                ...state,
                status: 'logout-Loading',
                isSuccess: false,
                message: 'Logouting ...',
                isLoggedIn: true,
            }
            break;
        case types.LOGIN_OUT_DONE_SUCCESS:
            return {
                ...state,
                status: 'logout-success',
                isSuccess: true,
                user: action.user,
                message: '',
                isLoggedIn: false,
            }
            break;
        case types.LOGIN_OUT_DONE_ERROR:
            return {
                ...state,
                status: 'logout-failed',
                isSuccess: true,//run done, but the result is failed. for example: account and pwd error.
                message: action.message,
                isLoggedIn: true,
            }
            break;
        case types.LOGIN_OUT_ERROR:
            return {
                ...state,
                status: 'logout-failed',
                isSuccess: false,
                message: action.message,
                isLoggedIn: true,
            }
            break;
        default:
            return state;
    }
}