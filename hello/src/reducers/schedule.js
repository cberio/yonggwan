import * as types from '../actions/actionType';

const initialState = {
  isFetching: false,
  didInvalidate: false,
  schedules: {},
};

const schedules = (state = initialState, action) => {
  switch(action.type) {
    case types.INVALIDATE_SHOP:
      return {
        ...state,
        didInvalidate: true
      }
    case types.REQUEST_SCHEDULE:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case types.RECEIVE_SCHEDULE:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        schedules: action.schedules,
        receivedAt: action.receivedAt
      }
    default:
      return state;
  }
}

export const getSchedulesBySelectedShopID = (state = {}, action) => {  
  switch(action.type) {
    case types.INVALIDATE_SHOP:
    case types.RECEIVE_SCHEDULE:
    case types.REQUEST_SCHEDULE:
      return {
        ...state,
        [action.shop]: schedules(state[action.shop], action)
      }
    default:
      return state;
  }
}