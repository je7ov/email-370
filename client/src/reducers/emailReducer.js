import { SEND_EMAIL, GET_EMAIL, EMAIL_ERROR } from '../actions/types';

export default function(
  state = {
    success: null,
    error: null,
    inbox: null,
    sent: null,
    drafts: null
  },
  action
) {
  let newState = Object.assign({}, state);
  const { payload } = action;

  switch (action.type) {
    case GET_EMAIL:
      newState.inbox = payload.inbox;
      newState.sent = payload.sent;
      newState.drafts = [];
      return newState;
    case SEND_EMAIL:
      newState.success = payload.success;
      return newState;
    case EMAIL_ERROR:
      newState.success = false;
      newState.error = payload;
      return newState;
    default:
      return state;
  }
}
