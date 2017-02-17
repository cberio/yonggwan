import * as types from '../actions/actionType';

const initialState = {
};

export default function userCard (state = initialState, action) {

    if (action.type === types.NEW_ORDER) {
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
