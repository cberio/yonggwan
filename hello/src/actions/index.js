import * as types from './actionType';
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
