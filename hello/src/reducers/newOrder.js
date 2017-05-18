import * as types from '../actions/actionType';

const initialState = {
    condition: true, // boolean
    step: 1, // int 1-3
    guestName: '', // str
    sex: 0, // int 0-2
    phone: ['010', '0000', '0000'], // array (3)
    service: undefined, // object (service object)
    staff: undefined, // object
    guest: undefined,  // object
    start: undefined, // moment format
    end: undefined, // moment format
    time: '00:20' // HH:mm
};

export const newOrderConfig = (state = initialState, action) => {
    switch (action.type) {
        case types.NEW_ORDER :
            return {
                ...state,
                isNewOrder: action.options
            };
        case types.NEW_ORDER_STEP :
            return { ...state };
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

    return state;
};
