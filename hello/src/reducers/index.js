import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import { newOrderConfig } from './newOrder';
import { calendarConfig } from './calendar';
import selectedShopID from './shop';
import { getSchedulesBySelectedShopID, createSchedule } from './schedule';
import { getStaffsBySelectedShopID } from './staffs';
import { getServicesBySelectedShopID } from './service';


const Reducers = combineReducers({
    userCard,
    modalConfirm,
    notifier,
    guider,
    loading,
    newOrderConfig,
    calendarConfig,
    selectedShopID,
    getSchedulesBySelectedShopID,
    getStaffsBySelectedShopID,
    getServicesBySelectedShopID,
    createSchedule,
});

export default Reducers;
