import * as types from '../actions/actionType';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    services: {},
};

const services = (state = initialState, action) => {
    switch (action.type) {
        case types.REQUEST_SERVICE:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            }
        case types.RECEIVE_SERVICE:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                services: action.services,
                receivedAt: action.receivedAt,
            }
        default:
            return state;
    }
};

const serviceReducer = (state = {}, action) => {
    switch (action.type) {
        case types.REQUEST_SERVICE:
        case types.RECEIVE_SERVICE:
            return {
                ...state,
                [action.shop]: services(state[action.shop], action),
            }
        default:
            return state;
    }
};

export default serviceReducer;
