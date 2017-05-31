import * as types from '../actions/actionType';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    guests: {},
};

const guests = (state = initialState, action) => {
    switch (action.type) {
        case types.REQUEST_GUEST:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false
            };
        case types.RECEIVE_GUEST:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                guests: action.guests,
                receivedAt: action.receivedAt,
            }
        default:
            return state;
    }
};

const guestReducer = (state = {}, action) => {
    switch (action.type) {
        case types.REQUEST_GUEST:
        case types.RECEIVE_GUEST:
            return {
                ...state,
                [action.shop]: guests(state[action.shop], action),
            };
        default:
            return state;
    }
};

export default guestReducer;
