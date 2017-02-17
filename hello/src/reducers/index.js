import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
// import newOrder from './newOrder';
import notifier from './notifier';
import guider from './guider';

const Reducers = combineReducers({
  userCard, modalConfirm, notifier, guider
});

export default Reducers;
