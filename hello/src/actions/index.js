import * as types from './actionType';
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

const parseJSON = response => {
  return response.json();
}

const requestHeader = {
  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBhYjVkOTIxMDIyMjMyYjRjNWQ5NzZkYmNlZWE1MTYyOGNlYzE4NjQzM2JhZGM4ODIxOTc4ZWUwY2ZhMDA1MmZjMzc2MzhkMTNjYjljNzcwIn0.eyJhdWQiOiIxIiwianRpIjoiMGFiNWQ5MjEwMjIyMzJiNGM1ZDk3NmRiY2VlYTUxNjI4Y2VjMTg2NDMzYmFkYzg4MjE5NzhlZTBjZmEwMDUyZmMzNzYzOGQxM2NiOWM3NzAiLCJpYXQiOjE0ODQwMzY1MjEsIm5iZiI6MTQ4NDAzNjUyMSwiZXhwIjoxNzk5NTY5MzIxLCJzdWIiOiI0NTUiLCJzY29wZXMiOltdfQ.r6riSaEns6xgXkYtydsqSJ4F1Joo4EhXfgQ9Vwd3uHrWPtcXcF9e9Kg0R9FoCmDGCkzgGoGEDHh67UDXrXQpFJVWJu7X3p3VdFMW-5YYXtTr0M0Z1eq89ocnwWhe--ro0DL4UHIGz5Fl8Dsu7XKEiTt0azgXPPAMk5nrKIc6lybuwbNk_nKoBcmGRQ7uBoU9w0x22_AjIK6Av814Bl5aK581bJiCPqtOTl_1SFuWabT5CxWM_NCz-nJfMJHAhxo0YheeT27ro7TwolGBNtBZIZYx3KAVf4nf54Er_NOGveClAi9_sjnPDq8H8RADmMrhRXTMUKlyljiuVux0SbN-CeGuNdlBeKngqbSoK5-sMt6iZFUaV6TFWzFuFVIgZzQatNlZkHZpMgVmRg0tBTUdefmH3S9aMkgCCnWianFRymJKI19mcXbPko6GecS7maZNrfKG1fa2RRN0HL_yY0sV4OlX7n7MS40tJygrTRUWBeLNkA5DKBsu7r9cBW_qnhoDTGFyP9vGInTbpikoiqJFE5LInMR4m_tmO3dEBA8-rN6dhohLzBn265fQKU0ntCSibSs11z3UloTQPsVrm1cmjBJmKRa_OwIxBej2toqPsjmLglkr4Cl3-YbB7wBkGPJT3DR2wAqrMKrQ4YUpyoY-3PCXOSm_8E9tdjY0Xc11Yc4',
  'Accept': 'application/json'
};

const fetchSchedules = shop => dispatch => {
  dispatch(requestSchedules);
  
  let param = new URLSearchParams();
  param.append('reservation_dt', moment().format('Y-MM-DD'));

  return fetch(`http://helloshop.app/api/v1/shops/${shop}/schedules?`+param, {
    method: 'GET',
    headers: requestHeader
  })
  .then(parseJSON)
  .then(json => dispatch(receiveSchedules(shop, json)));
}

const fetchStaffs = shop => dispatch => {
  dispatch(requestStaffs);

  return fetch(`http://helloshop.app/api/v1/shops/${shop}/staffs?`, {
    method: 'GET',
    headers: requestHeader
  })
  .then(parseJSON)
  .then(json => dispatch(receiveStaffs(shop, json)));
}

const shouldFetchSchedules = (state, shopID) => {
  const schedules = state.getSchedulesBySelectedShopID[shopID];

  if(!schedules)
    return true;

  if(schedules.isFetching)
    return false;

  return schedules.didInvalidate;
}

const shouldFetchStaffs = (state, shopID) => {
  const staffs = state.getStaffsBySelectedShopID[shopID];

  if(!staffs)
    return true;
  if(staffs.isFetching)
    return false;

  return staffs.didInvalidate;
}

export const fetchSchedulesIfNeeded = shop => (dispatch, getState) => {
  if(shouldFetchSchedules(getState(), shop))
    return dispatch(fetchSchedules(shop));
}

export const fetchStaffsIfNeeded = shop => (dispatch, getState) => {
  if(shouldFetchStaffs(getState(), shop))
    return dispatch(fetchStaffs(shop));
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