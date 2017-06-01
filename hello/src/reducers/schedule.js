import update from 'immutability-helper';
import * as types from '../actions/actionType';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    schedules: {},
};

const updateSchedulesWhenSucceed = (state, action) => {
    if (action.updatedSchedule.success) {
        const data = update(state.schedules.data, {
            [state.schedules.data.findIndex(x => x.id === action.updatedSchedule.data.id)]: {
                $set: { ...action.updatedSchedule.data }
            }
        });

        return {
            ...state,
            isFetching: false,
            didInvalidate: false,
            schedules: {
                ...state.schedules,
                data,
            },
            updatedSchedule: action.updatedSchedule,
            receivedAt: action.receivedAt
        };
    }

    return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        updatedSchedule: action.updatedSchedule,
        receivedAt: action.receivedAt
    };
};

const addScheduleWhenSucceed = (state, action) => {
    if (action.createdSchedule.success) {
        const data = update(state.schedules.data,
            { $push: [action.createdSchedule.data] }
        );
        return {
            ...state,
            isFetching: false,
            didInvalidate: false,
            schedules: {
                ...state.schedules,
                data,
            },
            createdSchedule: action.createdSchedule,
            receivedAt: action.receivedAt
        };
    }

    return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        createdSchedule: action.createdSchedule,
        receivedAt: action.receivedAt
    };
};

const schedules = (state = initialState, action) => {
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
            return addScheduleWhenSucceed(state, action);
        case types.UPDATE_SCHEDULE:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case types.SCHEDULE_UPDATED:
            return updateSchedulesWhenSucceed(state, action);
        default:
            return state;
    }
};

const scheduleReducer = (state = {}, action) => {
    switch (action.type) {
        case types.INVALIDATE_SHOP:
        case types.RECEIVE_SCHEDULE:
        case types.REQUEST_SCHEDULE:
        case types.CREATE_SCHEDULE:
        case types.SCHEDULE_CREATED:
        case types.UPDATE_SCHEDULE:
        case types.SCHEDULE_UPDATED:
            return {
                ...state,
                [action.shop]: schedules(state[action.shop], action)
            };
        default:
            return state;
    }
};

export default scheduleReducer;
