import { combineReducers } from 'redux';
import userCard from './userCard';
import modalConfirm from './modalConfirm';
import notifier from './notifier';
import guider from './guider';
import loading from './loading';

const Reducers = combineReducers({
  userCard, modalConfirm, notifier, guider, loading
});

export default Reducers;
