import * as types from '../actions/actionType';
import * as actions from '../actions';

const initialState = {
    condition: false, // boolean
    status: '',
};

export const newOrderConfig = (state = initialState, action) => {
    switch (action.type) {
        case types.NEW_ORDER_INIT :
            return {
                ...state,
                ...action.options,
                condition: true
            };
        case types.NEW_ORDER_FINISH :
            return initialState;
        default :
            return state;
    }
}
