import * as types from '../actions/actionType';

const initialState = {
  isLoading: true
};

export default function loading (state = initialState, action) {
    if (action.type === types.LOADING)
        return {
          isLoading: action.condition
        }
    else
        return state;
}
