/* eslint-disable no-console */
import {
  EVENT,
  RESULT,
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
  rpcCall: '',
  pubSub: '',
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
        console.log(action.reason);
        return {
          ...state,
          user: '',
          password: '',
          role: '',
          loggedIn: false,
          loginError: action.details.message || action.reason };
      }
      return state;
    case LOGIN_PROCEDURE:
      return {
        ...state,
        user: action.username,
        password: action.password,
      };
    case EVENT:
      switch (action.topic) {
        case 'com.example.oncounter':
          console.log(action);
          return {
            ...state,
            pubSub: action.args[0],
          };
        default:
          return state;
      }
    case RESULT:
      switch (action.procedure) {
        case 'com.example.ping':
          console.log(action);
          return {
            ...state,
            rpcCall: action.results,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}
