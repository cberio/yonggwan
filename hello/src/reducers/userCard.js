import * as types from '../actions/actionType';

const initialState = {
    selectedDate: undefined,
    selectedCard: undefined,
    selectedStaff: undefined
};

export default function userCard(state = initialState, action) {
    switch (action.type) {
        case types.USER_CARD_SCHEDULE :
            return {
                ...state,
                selectedCard: action.options
            };
        case types.USER_CARD_STAFF :
            return {
                ...state,
                selectedStaff: action.options
            };
        case types.USER_CARD_DATE :
            return {
                ...state,
                selectedDate: action.options
            };

        default:
            return state;
    }
}
