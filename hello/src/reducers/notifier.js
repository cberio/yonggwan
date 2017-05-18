import * as types from '../actions/actionType';

export default function notifier(state, action) {
    switch (action.type) {
        case types.NOTIFIER :
            return {
                ...state,
                isNotifier: action.options.isNotifier
            };
        case types.MODAL_NOTIFIER :
            return {
                ...state,
                isModalNotifier: action.options.isModalNotifier
            };
        case types.REQUEST_RESERVATION :
            return {
                ...state,
                requestReservation: {
                    condition: action.options.condition,
                    requestEvent: action.options.requestEvent
                }
            };
        default:
            return {
                ...state
            };
    }
}
