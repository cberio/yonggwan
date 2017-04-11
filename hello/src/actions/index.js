import * as types from './actionType';
import ShopApi from '../api/shop/shop';
import StaffApi from '../api/shop/staff';
import ScheduleApi from '../api/shop/schedule';
import moment from 'moment';

/**/
export function userCardEvent (options) {
  return {
    type : types.USER_CARD_EVENT,
    options
  };
}
export function userCardExpert (options) {
  return {
    type : types.USER_CARD_EXPERT,
    options
  };
}
export function userCardDate (options) {
  return {
    type : types.USER_CARD_DATE,
    options
  };
}
/**/

export function modalConfirm (optionComponent) {
  return {
    type : types.MODAL_CONFIRM,
    optionComponent
  };
}
export function newOrder (options) {
  return {
    type : types.NEW_ORDER,
    options
  };
}
export function notifier (options) {
  return {
    type : types.NOTIFIER,
    options
  };
}
export function modalNotifier (options) {
  return {
    type : types.MODAL_NOTIFIER,
    options
  };
}
export function requestReservation (options) {
  return {
    type : types.REQUEST_RESERVATION,
    options
  };
}
export function guider (options) {
  return {
    type : types.GUIDER,
    options
  };
}

export function loading (condition) {
  return {
    type : types.LOADING,
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

export const requestStaffs = shop =>({
  type: types.REQUEST_STAFF,
  shop
})

export const receiveStaffs = (shop, json) => ({
  type: types.RECEIVE_STAFF,
  shop,
  staffs: json,
  receivedAt: Date.now()
})

const fetchSchedules = (shop, state) => dispatch => {
  dispatch(requestSchedules(shop));

  return new ScheduleApi(shop).getSchedules(state)
    .then(json => dispatch(receiveSchedules(shop, json)));
}

const fetchStaffs = (shop, state) => dispatch => {
  dispatch(requestStaffs(shop));

  return new StaffApi(shop).getStaffs(state)
    .then(json => dispatch(receiveStaffs(shop, json)));
}

const shouldFetchSchedules = (state, shopID) => {
  const schedules = state.getSchedulesBySelectedShopID[shopID];

  if(!schedules)
    return true;

  if(schedules.isFetching)
    return false;
  
  if(schedules.receivedAt < Date.now())
    return true;

  return schedules.didInvalidate;
}

const shouldFetchStaffs = (state, shopID) => {
  const staffs = state.getStaffsBySelectedShopID[shopID];

  if(!staffs)
    return true;

  if(staffs.isFetching)
    return false;

  if(!staffs.receivedAt < Date.now())
    return true;

  return staffs.didInvalidate;
}

export const fetchSchedulesIfNeeded = shop => (dispatch, getState) => {
  if(shouldFetchSchedules(getState(), shop))
    return dispatch(fetchSchedules(shop, getState()));
}

export const fetchStaffsIfNeeded = shop => (dispatch, getState) => {
  if(shouldFetchStaffs(getState(), shop))
    return dispatch(fetchStaffs(shop, getState()));
}

//SHOP RELATED ACTIONS

export const selectShop = shop => ({
  type: types.SELECT_SHOP,
  shop
});

export const invalidateShop = shop => ({
  type: types.INVALIDATE_SHOP,
  shop
});

// FullCalendar RELATED ACTIONS

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
})

const fullCalendarViewType = viewType => ({
  type: types.FULLCALENDAR_VIEWTYPE,
  viewType,
});

export const setCalendarViewType = viewType => (dispatch, getState) => {
  return dispatch(fullCalendarViewType(viewType));
}

export const setCalendarStart = start => (dispatch, getState) => {
  return dispatch(fullCalendarStart(start));
}

export const setCalendarEnd = end => (dispatch, getState) => {
  return dispatch(fullCalendarEnd(end));
}