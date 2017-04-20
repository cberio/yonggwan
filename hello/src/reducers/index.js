import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import {calendarConfig} from './calendar';
import selectedShopID from './shop';
import {getSchedulesBySelectedShopID} from './schedule';
import {getStaffsBySelectedShopID} from './staffs';
import {getServicesBySelectedShopID} from './service';

const Reducers = combineReducers({
  userCard, modalConfirm, notifier, guider, loading,
  calendarConfig,
  selectedShopID,
  getSchedulesBySelectedShopID,
  getStaffsBySelectedShopID,
  getServicesBySelectedShopID,
});

export default Reducers;
