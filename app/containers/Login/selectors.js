/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectAuth = (state) => state.get('auth');

const makeSelectLoggedIn = () => createSelector(
  selectAuth,
  (authState) => authState.loggedIn
);

const makeSelectUsername = () => createSelector(
  selectAuth,
  (authState) => authState.user
);

const makeSelectRole = () => createSelector(
  selectAuth,
  (authState) => authState.role
);

const makeSelectLoginError = () => createSelector(
  selectAuth,
  (authState) => authState.loginError
);

const makeRpcCallSelect = () => createSelector(
  selectAuth,
  (rpcCallState) => rpcCallState.rpcCall
);

const makepubSubSelect = () => createSelector(
  selectAuth,
  (pubSubState) => pubSubState.pubSub
);

const selectAutobahnConn = () => (state) => state.get('autobahnConnection');

const selectAutobahnConnection = () => createSelector(
  selectAutobahnConn(),
  (AutobahnConnection) => AutobahnConnection,
);


export {
  selectAuth,
  makeSelectLoggedIn,
  makeSelectUsername,
  makeSelectRole,
  makeSelectLoginError,
  makeRpcCallSelect,
  makepubSubSelect,
  selectAutobahnConnection,
};
