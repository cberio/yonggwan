import * as types from '../actions/actionType';

const initialState = {
  isGuider : false,
  message : ""
};

export default function guider (state = initialState, action) {

    if (action.type === types.GUIDER) {
      return {
        ...state,
        isGuider: action.options.isGuider,
        message: action.options.message
      }
    } else {
      return state;
    }

}
