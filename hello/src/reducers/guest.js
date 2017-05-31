import update from 'immutability-helper';
import * as types from '../actions/actionType';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    guests: {},
};

const guests = (state = initialState, action) => {
    let data;

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
            };
        case types.CREATE_GUEST:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case types.GUEST_CREATED:
            data = update(state.guests.data,
                { $push: [action.createdGuest.data] }
            );
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                guests: {
                    ...state.guests,
                    data
                },
                createdGuest: action.createdGuest,
                receivedAt: action.receivedAt,
            };
        case types.UPDATE_GUEST:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false,
            };
        case types.GUEST_UPDATED:
            data = update(state.guests.data, {
                [state.guests.data.findIndex(x => x.id === action.updatedGuest.data.id)]: {
                    $set: { ...action.updatedGuest.data }
                }
            });
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                guests: {
                    ...state.guests,
                    data,
                },
                updatedGuest: action.updatedGuest,
                receivedAt: action.receivedAt
            }
        default:
            return state;
    }
};

const guestReducer = (state = {}, action) => {
    switch (action.type) {
        case types.REQUEST_GUEST:
        case types.RECEIVE_GUEST:
        case types.CREATE_GUEST:
        case types.GUEST_CREATED:
        case types.UPDATE_GUEST:
        case types.GUEST_UPDATED:
            return {
                ...state,
                [action.shop]: guests(state[action.shop], action),
            };
        default:
            return state;
    }
};

export default guestReducer;
