import * as types from '../actions/actionType';

export default function modal(state = {}, action) {

    if (action.type === types.MODAL)
        return action.options;

    return { ...state };
}
