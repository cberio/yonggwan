import update from 'immutability-helper';
import * as types from '../actions/actionType';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    schedules: {},
};

const schedules = (state = initialState, action) => {
    // 등록/수정/삭제 등 기존 state의 변경에 따른
    // schedules.data의 값을 대체하기 위한 변수
    let data;

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
            data = update(state.schedules.data,
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
        case types.UPDATE_SCHEDULE:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case types.SCHEDULE_UPDATED:
            if (action.updatedSchedule.success) {
                data = update(state.schedules.data, {
                    [state.schedules.data.findIndex(x => x.id === action.updatedSchedule.data.id)]: {
                        $set: { ...action.updatedSchedule.data }
                    }
                });
            } else
                data = {};
            // debugger;
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                schedules: {
                    data,
                    ...state.schedules,
                },
                updatedSchedule: action.updatedSchedule,
                receivedAt: action.receivedAt
            };
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
