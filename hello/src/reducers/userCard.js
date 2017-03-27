import * as types from '../actions/actionType';

const initialState = {
  selectedDate : undefined,
  selectedCard : undefined,
  selectedExpert: undefined
};

export default function userCard (state = initialState, action) {
  
  switch (action.type) {
    case types.USER_CARD_EVENT :
      return {
        ...state,
        selectedCard: action.options
      }
    case types.USER_CARD_EXPERT :
      return {
        ...state,
        selectedExpert: action.options
      }
    case types.USER_CARD_DATE :
      return {
        ...state,
        selectedDate: action.options
      }

    default:
      return state;
  }

}
