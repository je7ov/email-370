import {
  LOADING,
  AUTH,
  FETCH_DOMAINS,
  FETCH_USER,
  LOG_IN,
  LOG_OUT
} from '../actions/types';

export default function(
  state = {
    user: null,
    success: null,
    error: '',
    domains: null,
    isLoading: false
  },
  action
) {
  let newState = Object.assign({}, state);
  const { payload } = action;

  switch (action.type) {
    case FETCH_DOMAINS:
      newState.domains = payload.domains;
      return newState;

    case FETCH_USER:
      console.log(payload);

      if (!payload.success) {
        newState.user = null;
        newState.success = false;
        newState.error = payload.error;
      }

      newState.user = payload.user;
      newState.success = true;
      newState.error = null;

      return newState;

    case LOG_IN:
      newState.success = payload.success;
      newState.user = payload.user;
      return newState;

    case LOG_OUT:
      newState.user = null;
      return newState;

    case LOADING:
      if (state && payload.target === AUTH) {
        newState.isLoading = payload.isLoading;
      }
      return newState;

    default:
      return newState;
  }
}
