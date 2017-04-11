import * as types from '../actions/actionType';
import moment from 'moment';

const initialState = {
    date: {
        start: moment().format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),    
    }
}

export const calendarDate = (state = initialState, action) => {
    switch (action.type) {
        case types.FULLCALENDAR_START:
            return {
                ...state,
                date: {
                    start: state.start,
                },
            }
        case types.FULLCALENDAR_END:
            return {
                ...state,
                date: {
                    end: state.end,
                },
            }
        default:
            return state;
    }
}