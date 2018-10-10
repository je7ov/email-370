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
  DELETE_EMAIL,
  SAVE_DRAFT,
  EDIT_DRAFT,
  DELETE_DRAFT,
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
  const res = await axios.get('/api/email', getAuthHeader());

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
    getAuthHeader()
  );

  dispatch(getEmails());
  dispatch({ type: SEND_EMAIL, payload: res.data });
};

export const deleteEmail = (emailId, origin) => async dispatch => {
  let config = getAuthHeader();
  config.data = { emailId, origin };

  const res = await axios.delete('/api/email', config);

  dispatch(getEmails());
  dispatch({ type: DELETE_EMAIL, payload: res.data });
};

export const saveDraft = (to, subject, body) => async dispatch => {
  const res = await axios.post(
    '/api/email/draft',
    {
      to,
      subject,
      body
    },
    getAuthHeader()
  );

  dispatch(getEmails);
  dispatch({ type: SAVE_DRAFT, payload: res.data });
};

export const editDraft = (draftId, to, subject, body) => async dispatch => {
  let config = getAuthHeader();

  const res = await axios.post(
    '/api/email/draft',
    {
      to,
      subject,
      body,
      edit: true,
      draftId
    },
    getAuthHeader()
  );

  dispatch(getEmails());
  dispatch({ type: EDIT_DRAFT, payload: res.data });
};

export const deleteDraft = draftId => async dispatch => {
  let config = getAuthHeader();
  config.data = { draftId };

  const res = await axios.delete('/api/email/draft', config);

  dispatch(getEmails());
  dispatch({ type: DELETE_DRAFT, payload: res.data });
};

export const emailError = error => dispatch => {
  dispatch({ type: EMAIL_ERROR, payload: { type: 'SEND', error } });
};

export const clearEmailError = () => dispatch => {
  dispatch({ type: EMAIL_ERROR, payload: { type: 'SEND', error: null } });
};

// HELPER FUNCTIONS //
function getAuthHeader() {
  return { headers: { Authorization: `Bearer ${Auth.getToken()}` } };
}
