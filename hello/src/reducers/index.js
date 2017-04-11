import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import {calendarDate} from './calendar';
import selectedShopID from './shop';
import {getSchedulesBySelectedShopID} from './schedule';
import {getStaffsBySelectedShopID} from './staffs';

const Reducers = combineReducers({
  userCard, modalConfirm, notifier, guider, loading,
  calendarDate,
  selectedShopID,
  getSchedulesBySelectedShopID,
  getStaffsBySelectedShopID,
});

export default Reducers;
