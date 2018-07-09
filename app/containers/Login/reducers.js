/* eslint-disable no-console */
import {
  CONNECTION_CLOSED,
  CONNECTION_OPENED,
} from '../../AutobahnMiddleware/types';
import {
  LOGIN_PROCEDURE,
} from './constants';

const initialState = {
  user: '',
  password: '',
  role: '',
  loggedIn: false,
  loginError: false,
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    case CONNECTION_OPENED:
      return {
        ...state,
        loginError: '',
        loggedIn: true,
        // role: 'admin',
      };
    case CONNECTION_CLOSED:
      if (action.details.reason !== 'wamp.close.normal') {
        console.log(action.details.reason);
        return {
          ...state,
          user: '',
          password: '',
          role: '',
          loggedIn: false,
          loginError: action.details.message };
      }
      return state;
    case LOGIN_PROCEDURE:
      return {
        ...state,
        user: action.username,
        password: action.password,
      };
    default:
      return state;
  }
}
