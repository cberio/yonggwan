import * as types from '../actions/actionType';
import moment from 'moment';

const initialState = {
    viewType: 'agendaDay',
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
}

export const calendarConfig = (state = initialState, action) => {
    switch (action.type) {
        case types.FULLCALENDAR_START:
            return {
                ...state,
                start: action.start,
            }
        case types.FULLCALENDAR_END:
            return {
                ...state,
                end: action.end,
            }
        case types.FULLCALENDAR_VIEWTYPE:
            return {
                ...state,                
                viewType: action.viewType,                
            }
        default:
            return state;
    }
}