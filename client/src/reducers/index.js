import { combineReducers } from 'redux';
import authReducer from './authReducer';
import emailReducer from './emailReducer';

export default combineReducers({
  auth: authReducer,
  email: emailReducer
});
