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

export {
  selectAuth,
  makeSelectLoggedIn,
  makeSelectUsername,
  makeSelectRole,
  makeSelectLoginError,
};
