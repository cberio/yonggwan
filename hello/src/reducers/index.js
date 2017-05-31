import { combineReducers } from 'redux';
import userCard from './userCard';
import modal from './modal';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import { newOrderConfig } from './newOrder';
import { calendarConfig } from './calendar';
import selectedShopID from './shop';
import scheduleReducer from './schedule';
import staffReducer from './staffs';
import serviceReducer from './service';
import guestReducer from './guest';


const Reducers = combineReducers({
    userCard,
    modal,
    notifier,
    guider,
    loading,
    newOrderConfig,
    calendarConfig,
    selectedShopID,
    // getSchedulesBySelectedShopID,
    // getStaffsBySelectedShopID,
    // getServicesBySelectedShopID,
    // createSchedule,
    // getGuestsBySelectedShopID,

    scheduleReducer,
    staffReducer,
    serviceReducer,
    guestReducer,
});

export default Reducers;
