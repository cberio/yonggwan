import * as types from '../actions/actionType';

export default function selectedShopID (state = '14', action) {
  switch (action.type) {
    case types.SELECT_SHOP:
      return action.shop;
    default:
      return state;
  }
}