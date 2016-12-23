import * as types from '../actions/actionType';

const initialState = {
  number : 0
};

export default function getAlert (state = initialState, action) {

    if (action.type === types.A) {
      return {
        ...state,
        number: state.number + 1
      }
    } else {
      return state;
    }

}
