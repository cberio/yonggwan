import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import selectedShop from './shop';
import {getSchedulesBySelectedShopID} from './schedule';
import {getStaffsBySelectedShopID} from './staffs';

const Reducers = combineReducers({
  userCard, modalConfirm, notifier, guider, loading,
  selectedShop,
  getSchedulesBySelectedShopID,
  getStaffsBySelectedShopID
});

export default Reducers;
