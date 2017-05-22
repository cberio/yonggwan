import * as types from '../actions/actionType';
import * as actions from '../actions';

const configInitialState = {
    condition: false, // boolean
    type: actions.NewOrderStatus.DIRECT,
};
const scheduleInitialState = {
    id: undefined,
    guestName: '', // str
    sex: 0, // int 0-2
    phone: ['', '', ''], // array (3)
    service: undefined, // object (service object)
    staff: undefined, // object
    guest: undefined,  // object
    start: undefined, // moment format
    end: undefined, // moment format
    time: '' // HH:mm
};

export const newOrderConfig = (state = configInitialState, action) => {
    switch (action.type) {
        case types.NEW_ORDER :
            return {
                ...state,
                condition: action.condition
            };
        case types.NEW_ORDER_STEP :
            return { ...state };
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
