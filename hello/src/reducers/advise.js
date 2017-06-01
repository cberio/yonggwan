import * as types from '../actions/actionType';

const initialState = {
    condition: false,
    success: false,
    htmls: [],
    buttons: []
};

export default function advise(state = initialState, action) {
    if (action.type === types.ADVISE)
        return {
            ...state,
            ...action.options
        }
    return state;
}
