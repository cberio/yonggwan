import * as types from '../actions/actionType';

const initialState = {
  optionsComponent: undefined
};

export default function modalConfirm (state = initialState, action) {

    if (action.type === types.MODAL_CONFIRM) {
      return {
        optionComponent: action.optionComponent
      }
    } else {
      return state;
    }

}
