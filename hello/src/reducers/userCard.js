import * as types from '../actions/actionType';

const initialState = {
  defaultSlide : undefined,
  expert: undefined,
  userCards: undefined
};

export default function userCard (state = initialState, action) {

    if (action.type === types.USER_CARD) {
      return {
        ...state,
        defaultSlide: action.options.defaultSlide,
        expert: action.options.expert,
        userCards: action.options.userCards
      }
    } else {
      return state;
    }

}
