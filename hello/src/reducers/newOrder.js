import * as types from '../actions/actionType';
import * as actions from '../actions';

const configInitialState = {
    condition: false, // boolean
    status: actions.NewOrderStatus.DIRECT,
    staff: {}, // object
    guest: {}  // object
};
const scheduleInitialState = {
    id: -1,
    guestName: '', // str
    sex: 0, // int 0-2
    phone: [], // array ( ['010','1234','1234'] )
    service: {}, // object (service object)
    staff: {}, // object
    guest: {},  // object
    start: '', // moment format
    end: '', // moment format
    time: '' // HH:mm
};

export const newOrderConfig = (state = configInitialState, action) => {
    switch (action.type) {
        case types.NEW_ORDER_INIT :
            return {
                ...state,
                ...action.options,
                condition: true
            };
        case types.NEW_ORDER_FINISH :
            return {
                condition: false
            }
        default :
            return state;
    }
}

export const newOrderSchedule = (state = scheduleInitialState, action) => {
    switch (action.type) {
        case types.NEW_ORDER_GUEST_NAME :
            return { ...state };
        case types.NEW_ORDER_SEX :
            return { ...state };
        case types.NEW_ORDER_PHONE :
            return { ...state };
        case types.NEW_ORDER_SERVICE :
            return { ...state };
        case types.NEW_ORDER_STAFF :
            return { ...state };
        case types.NEW_ORDER_GUEST :
            return { ...state };
        case types.NEW_ORDER_START :
            return { ...state };
        case types.NEW_ORDER_END :
            return { ...state };
        case types.NEW_ORDER_TIMM :
            return { ...state };
        default :
            return state;
    }
};
