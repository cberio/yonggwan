import * as types from '../actions/actionType';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    schedules: {},
};

export const schedules = (state = initialState, action) => {
    switch (action.type) {
        case types.INVALIDATE_SHOP:
            return {
                ...state,
                didInvalidate: true
            };
        case types.REQUEST_SCHEDULE:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false
            };
        case types.RECEIVE_SCHEDULE:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                schedules: action.schedules,
                receivedAt: action.receivedAt
            };
        case types.CREATE_SCHEDULE:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case types.SCHEDULE_CREATED:
            console.info(state.schedules, action.createdSchedule);
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                schedules: Object.assign({}, action.createdSchedule, state.schedules),
                createdSchedule: action.createdSchedule,
                receivedAt: action.receivedAt
            };
        default:
            return state;
    }
};

export const scheduleReducer = (state = {}, action) => {
    switch (action.type) {
        case types.INVALIDATE_SHOP:
        case types.RECEIVE_SCHEDULE:
        case types.REQUEST_SCHEDULE:
        case types.CREATE_SCHEDULE:
        case types.SCHEDULE_CREATED:
            return {
                ...state,
                [action.shop]: schedules(state[action.shop], action)
            };
        default:
            return state;
    }
};
