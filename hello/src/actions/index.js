import moment from 'moment';
import * as types from './actionType';
import Shop from '../api/shop/shop';
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

export const createSchedule = (scheduleData, shop) => ({
    type: types.CREATE_SCHEDULE,
    shop,
    schedules: scheduleData,
});

export const scheduleCreated = (scheduleData, json, getState) => ({
    type: types.SCHEDULE_CREATED,
    shop: getState().selectedShopID,
    createdSchedule: json,
    receivedAt: Date.now(),
});

export const updateSchedule = (scheduleData, shop) => ({
    type: types.UPDATE_SCHEDULE,
    shop,
    schedules: scheduleData,
});

export const scheduleUpdated = (scheduleData, json, shop) => ({
    type: types.SCHEDULE_UPDATED,
    shop,
    schedules: json,
    receivedAt: Date.now(),
});

// STAFF 관련 ACTIONS
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

// SERVICE 관련 ACTIONS
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

export const requestGuests = shop => ({
    type: types.REQUEST_GUEST,
    shop,
});

export const receiveGuests = (shop, json) => ({
    type: types.RECEIVE_GUEST,
    shop,
    guests: json,
    receivedAt: Date.now(),
});

// SHOP RELATED ACTIONS
export const selectShop = shop => ({
    type: types.SELECT_SHOP,
    shop
});

export const invalidateShop = shop => ({
    type: types.INVALIDATE_SHOP,
    shop
});

const fetchSchedules = (shop, state) => (dispatch) => {
    dispatch(requestSchedules(shop));
    dispatch(loading(true));
    
    return new Shop({ shopId: shop })
        .schedules()
        .withService()
        .get(state)
        .then((json) => {
            if (json.success) {
                dispatch(loading(false));
                return dispatch(receiveSchedules(shop, json));
            }
            return new ApiException(json).showError();
        });
};

const fetchStaffs = (shop, state) => (dispatch) => {
    dispatch(requestStaffs(shop));
    
    return new Shop({ shopId: shop })
        .staffs()
        .get(state)
        .then((json) => {
            if (json.success) {
                dispatch(loading(false));
                return dispatch(receiveStaffs(shop, json));
            } 
            return new ApiException(json).showError();
        });
};

const fetchServices = (shop, state) => (dispatch) => {
    dispatch(requestServices(shop));
    
    return new Shop({ shopId: shop })
        .services()
        .get(state)
        .then((json) => {
            if (json.success) {
                dispatch(loading(false));
                return dispatch(receiveServices(shop, json));
            } 
            return new ApiException(json).showError();
        });
};

const fetchGuests = (shop, state) => (dispatch) => {
    dispatch(requestGuests(shop));
    dispatch(loading(true));

    return new Shop({ shopId: shop })
        .guests()
        .get(state)
        .then((json) => {
            if (json.success) {
                dispatch(loading(false));
                return dispatch(receiveGuests(shop, json));
            } 
            return new ApiException(json).showError();
        });
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
    const schedules = state.scheduleReducer[shopID];
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

const shouldFetchGuets = (state, shopID) => {
    const guests = state.getGuestsBySelectedShopID[shopID];

    if (!guests)
        return true;

    if (guests.isFetching)
        return false;

    return guests.didInvalidate;
}

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

export const fetchGuestsIfNeeded = shop => (dispatch, getState) => {
    if (shouldFetchGuets(getState(), shop))
        return dispatch(fetchGuests(shop, getState()));
}

export const saveSchedule = scheduleData => (dispatch, getState) => {
    const shopId = getState().selectedShopID;
    
    dispatch(createSchedule(scheduleData, shopId));
    dispatch(loading(true));
    
    return new Shop({ shopId })
        .schedules()
        .create(scheduleData)
        .then((json) => {
            if (json.success) {
                dispatch(loading(false));
                dispatch(scheduleCreated(scheduleData, json, getState));

                return getState().scheduleReducer[shopId];
            }
            return new ApiException(json).showError();
        });
};

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
