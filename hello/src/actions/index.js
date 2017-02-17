import * as types from './actionType';

export function userCard (options) {
  return {
    type : types.USER_CARD,
    options
  };
}
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
