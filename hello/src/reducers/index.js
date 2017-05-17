import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';
import { calendarConfig } from './calendar';
import selectedShopID from './shop';
import scheduleReducer from './schedule';
import staffReducer from './staffs';
import serviceReducer from './service';
import guestReducer from './guest';


const Reducers = combineReducers({
    userCard, 
    modalConfirm,
    notifier,
    guider,
    loading,
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
