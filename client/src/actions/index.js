import axios from 'axios';
import Auth from '../modules/Auth';
import {
  AUTH,
  FETCH_DOMAINS,
  FETCH_USER,
  LOG_IN,
  LOG_OUT,
  LOADING,
  GET_EMAIL,
  SEND_EMAIL,
  EMAIL_ERROR
} from './types';

//**************//
// AUTH ACTIONS //
//**************//
export const getDomains = () => async dispatch => {
  const res = await axios.get('/auth/domains');

  dispatch({ type: FETCH_DOMAINS, payload: res.data });
};

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const register = (username, domain, password) => async dispatch => {
  dispatch(loading(AUTH));

  try {
    await axios.post('/auth/register', { username, domain, password });
  } catch (error) {
    dispatch(authError(error.response.data));
    dispatch(doneLoading(AUTH));
    return;
  }

  dispatch(login(username, domain, password));
};

export const login = (username, domain, password) => async dispatch => {
  dispatch(loading(AUTH));

  let res = {};
  try {
    res = await axios.post('/auth/login', { username, domain, password });
    Auth.authenticateUser(res.data.token);
  } catch (error) {
    dispatch(authError(error.response.data));
    dispatch(doneLoading(AUTH));
    return;
  }

  dispatch({ type: LOG_IN, payload: res.data });
  dispatch(doneLoading(AUTH));
};

export const logout = () => dispatch => {
  Auth.deauthenticateUser();
  dispatch({ type: LOG_OUT, payload: null });
};

export const loading = target => dispatch => {
  dispatch({ type: LOADING, payload: { target, isLoading: true } });
};

export const doneLoading = target => dispatch => {
  dispatch({ type: LOADING, payload: { target, isLoading: false } });
};

export const authError = error => dispatch => {
  dispatch({ type: FETCH_USER, payload: error });
};

export const clearAuth = () => dispatch => {
  dispatch({ type: FETCH_USER, payload: {} });
};

//***************//
// EMAIL ACTIONS //
//***************//

export const getEmails = () => async dispatch => {
  const res = await axios.get('/api/email', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` }
  });

  dispatch({ type: GET_EMAIL, payload: res.data });
};

export const sendEmail = (
  username,
  domain,
  subject,
  body
) => async dispatch => {
  const res = await axios.post(
    '/api/email',
    { username, domain, subject, body },
    {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    }
  );

  dispatch({ type: SEND_EMAIL, payload: {} });
};

export const emailError = error => dispatch => {
  dispatch({ type: EMAIL_ERROR, payload: { type: 'SEND', error } });
};
