import * as types from '../actions/actionType';

const initialState = {
  isFetching: false,
  didInvalidate: false,
  staffs: {},
};

const staffs = (state = initialState, action) => {
  switch (action.type) {
    case types.INVALIDATE_SHOP:
      return {
        ...state,
        didInvalidate: true
      }
    case types.REQUEST_STAFF:    
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case types.RECEIVE_STAFF:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        staffs: action.staffs,
        receivedAt: action.receivedAt
      }
    default:
      return state;
  }
}

export const getStaffsBySelectedShopID = (state = {}, action) => {
  switch (action.type) {
    case types.INVALIDATE_SHOP:
    case types.RECEIVE_STAFF:
    case types.REQUEST_STAFF:
      return {
        ...state,
        [action.shop]: staffs(state[action.shop], action)
      }  
    default:
      return state;
  }
}