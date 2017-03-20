import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import {getSchedulesBySelectedShopID} from './schedule';

const Reducers = combineReducers({
  userCard, modalConfirm, notifier, guider, loading,
  getSchedulesBySelectedShopID
});

export default Reducers;
