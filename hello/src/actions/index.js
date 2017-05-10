import * as types from './actionType';
import Shop from '../api/shop/shop';
import moment from 'moment';
import ApiException from '../api/error';

/**/
export function userCardSchedule(options) {
    return {
        type: types.USER_CARD_SCHEDULE,
        options
    };
}
export function userCardStaff(options) {
    return {
        type: types.USER_CARD_STAFF,
        options
    };
}
export function userCardDate(options) {
    return {
        type: types.USER_CARD_DATE,
        options
    };
}
/**/

export function modalConfirm(optionComponent) {
    return {
        type: types.MODAL_CONFIRM,
        optionComponent
    };
}
export function newOrder(options) {
    return {
        type: types.NEW_ORDER,
        options
    };
}
export function notifier(options) {
    return {
        type: types.NOTIFIER,
        options
    };
}
export function modalNotifier(options) {
    return {
        type: types.MODAL_NOTIFIER,
        options
    };
}
export function requestReservation(options) {
    return {
        type: types.REQUEST_RESERVATION,
        options
    };
}
export function guider(options) {
    return {
        type: types.GUIDER,
        options
    };
}

export function loading(condition) {
    return {
        type: types.LOADING,
        condition
    };
}

// SCHEDULE RELATED ACTIONS

export const requestSchedules = shop => ({
    type: types.REQUEST_SCHEDULE,
    shop
});

export const receiveSchedules = (shop, json) => ({
    type: types.RECEIVE_SCHEDULE,
    shop,
    schedules: json,
    receivedAt: Date.now()
});

export const creatingSchedule = scheduleData => ({
    type: types.CREATING_SCHEDULE,
    schedules: scheduleData,
});

export const scheduleCreated = (scheduleData, json) => ({
    type: types.SCHEDULE_CREATED,
    schedules: json,
    receivedAt: Date.now(),
});

export const requestStaffs = shop => ({
    type: types.REQUEST_STAFF,
    shop
});

export const receiveStaffs = (shop, json) => ({
    type: types.RECEIVE_STAFF,
    shop,
    staffs: json,
    receivedAt: Date.now()
});

export const requestServices = shop => ({
    type: types.REQUEST_SERVICE,
    shop
});

export const receiveServices = (shop, json) => ({
    type: types.RECEIVE_SERVICE,
    shop,
    services: json,
    receivedAt: Date.now()
});

const fetchSchedules = (shop, state) => (dispatch) => {
    dispatch(requestSchedules(shop));
    dispatch(loading(true));
    
    return new Shop({ shopId: shop })
    .schedules()
    .withService()
    .get(state)
    .then((json) => {
        dispatch(receiveSchedules(shop, json));
        dispatch(loading(false));
    });
};

export const createNewSchedule = scheduleData => (dispatch, getState) => {
    dispatch(creatingSchedule(scheduleData));
    dispatch(loading(true));
    
    return new Shop({ shopId: getState().selectedShopID })
    .schedules()
    .create(scheduleData)
    .then((json) => {
        if (json.success) {
            dispatch(loading(false));
            return dispatch(scheduleCreated(scheduleData, json));
        }      else
        new ApiException(json).showError();
    });
};

const fetchStaffs = (shop, state) => (dispatch) => {
    dispatch(requestStaffs(shop));
    
    return new Shop({ shopId: shop })
    .staffs()
    .get(state)
    .then(json => dispatch(receiveStaffs(shop, json)));
};

const fetchServices = (shop, state) => (dispatch) => {
    dispatch(requestServices(shop));
    
    return new Shop({ shopId: shop })
    .services()
    .get(state)
    .then(json => dispatch(receiveServices(shop, json)));
};

/**
* whether call api request or not.
*
* 1) state in reducer is undefined : call api
* 2) state in reducer is not empty and is pending api call : do not call api
* 3) state in reducer has data and data has schedule in given date : do not call api
* 4) schedule has updated (not implemented) : call api
*
* @param {Object} current state
* @param {string} shopID
*
* @return {boolean}
*/
const shouldFetchSchedules = (state, shopID) => {
    const schedules = state.getSchedulesBySelectedShopID[shopID];
    const selectedDate = state.calendarConfig.current.format('YYYY-MM-DD');
    
    if (!schedules)
        return true;
    
    if (schedules.isFetching)
        return false;
    
    if (state.calendarConfig.current.isBetween(state.calendarConfig.start, state.calendarConfig.end))
        return false;
    
    if (!schedules.schedules.data.find(schedule => schedule.reservation_dt === selectedDate))
        return true;
    
    return schedules.didInvalidate;
};

const shouldFetchStaffs = (state, shopID) => {
    const staffs = state.getStaffsBySelectedShopID[shopID];
    
    if (!staffs)
        return true;
    
    if (staffs.isFetching)
        return false;
    
    return staffs.didInvalidate;
};

const shouldFetchServices = (state, shopID) => {
    const services = state.getServicesBySelectedShopID[shopID];
    
    if (!services)
        return true;
    
    if (services.isFetching)
        return false;
    
    return services.didInvalidate;
};

export const fetchSchedulesIfNeeded = shop => (dispatch, getState) => {
    if (shouldFetchSchedules(getState(), shop))
        return dispatch(fetchSchedules(shop, getState()));
};

export const fetchStaffsIfNeeded = shop => (dispatch, getState) => {
    if (shouldFetchStaffs(getState(), shop))
        return dispatch(fetchStaffs(shop, getState()));
};

export const fetchServicesIfNeeded = shop => (dispatch, getState) => {
    if (shouldFetchServices(getState(), shop))
        return dispatch(fetchServices(shop, getState()));
};

// SHOP RELATED ACTIONS

export const selectShop = shop => ({
    type: types.SELECT_SHOP,
    shop
});

export const invalidateShop = shop => ({
    type: types.INVALIDATE_SHOP,
    shop
});

// FullCalendar RELATED ACTIONS
const fullCalendarCurrent = current => ({
    type: types.FULLCALENDAR_CURRENT,
    current
});

const fullCalendarStart = start => ({
    type: types.FULLCALENDAR_START,
    start
});

const fullCalendarEnd = end => ({
    type: types.FULLCALENDAR_END,
    end
});

const fullCalendarBetween = dateBetween => ({
    type: types.FULLCALENDAR_BETWEEN,
    start: dateBetween.start,
    end: dateBetween.end,
});

const fullCalendarViewType = viewType => ({
    type: types.FULLCALENDAR_VIEWTYPE,
    viewType,
});

export const setCalendarViewType = viewType => (dispatch, getState) => dispatch(fullCalendarViewType(viewType));

export const setCalendarStart = start => (dispatch, getState) => dispatch(fullCalendarStart(start));

export const setCalendarEnd = end => (dispatch, getState) => dispatch(fullCalendarEnd(end));

export const setCalendarCurrent = current => (dispatch, getState) => dispatch(fullCalendarCurrent(current));

export const ScheduleStatus = {
    DONE: '00',     // 지난예약건
    CREATED: '01', // 지나지않은 예약건
    REQUESTED: '02', // 예약요청건
    CONFIRMED: '03', // 예약요청건 확인
    CHANGED: '04', // 예약수정건
    OFFTIME: '05', // 오프타임
    CANCELED: '99', //예약취소건
};

export const GuestClass = {
    NEW: 'NEW',
    VIP: 'VIP',
    BAD: 'BAD'
};
