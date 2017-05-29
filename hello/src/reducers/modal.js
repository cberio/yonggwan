import * as types from '../actions/actionType';

const initialState = {
    condition: false,
    options: {}
}

export default function modal(state = initialState, action) {
    if (action.type === types.MODAL) {
        return {
            ...state,
            condition: action.params.condition,
            options: action.params.options
        };
    }

    return { ...state };
}
