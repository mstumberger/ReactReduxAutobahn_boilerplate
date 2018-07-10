/* eslint-disable no-unused-vars,no-throw-literal,jsx-a11y/label-has-for,no-console */
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth_cra as authCra, Connection } from 'autobahn';
import { createStructuredSelector } from 'reselect/es';
import reduxAutobahn from '../../AutobahnMiddleware';
import { loginRequest } from './actions';
import {
  makeSelectLoggedIn,
  makeSelectUsername,
  makeSelectRole,
  makeSelectLoginError,
  makeRpcCallSelect,
  makepubSubSelect,
  selectAutobahnConnection,
} from './selectors';
import { store } from '../../app';

const isConnected = (props) => props.autobahnConnection.connection.isConnected;

const isSubscribed = (props, topic) => props.autobahnConnection.subscriptions.filter((s) => s.topic === topic).length > 0;


export class Login extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static logout(event) {
    event.preventDefault();
    console.log('logoout');
    store.closeAutobahnConnection();
  }

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', rpcCall: '' };
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.rpcCall = this.rpcCall.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    if (this.state.username && this.state.username.trim().length > 0) {
      this.login();
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.isNewConnection(newProps)) {
      console.log('Side menu - connected - subscribe and call');
      this.props.actions.subscribe('com.example.oncounter');
    }
    if (this.isNewSubscription(newProps, 'com.example.oncounter')) {
      console.log('new subscription to:', 'com.example.oncounter');
    }
  }

  isNewConnection(newProps) {
    return !isConnected(this.props) && isConnected(newProps);
  }

  isNewSubscription(newProps, topic) {
    return !isSubscribed(this.props, topic) && isSubscribed(newProps, topic);
  }

  changeUsername(event) {
    this.setState({ ...this.state, username: event.target.value });
    console.log(event.target.value);
  }

  changePassword(event) {
    this.setState({ ...this.state, password: event.target.value });
    console.log(event.target.value);
  }

  login(event) {
    event.preventDefault();
    console.log('login');
    this.props.dispatch(
      loginRequest(
        this.state.username,
        this.state.password,
        'wss://cryptocademy.pro/ws',
        // `${document.location.protocol === 'http:' ? 'ws:' : 'wss:'}//${document.location.host.split(':')[0]}:8000/ws`,
        )
    );
    store.setAutobahnConnection(new Connection({
      // url: `${document.location.protocol === 'http:' ? 'ws:' : 'wss:'}//${document.location.host.split(':')[0]}:8000/ws`,
      url: 'wss://cryptocademy.pro/ws',
      realm: 'realm1',
      authmethods: ['wampcra'],
      authid: this.state.username,
      onchallenge: (session, method, extra) => {
        console.log('username', this.state.username);
        console.log('password', this.state.password);
        if (method === 'wampcra') {
          console.log(`authenticating via ${method}`, extra);
          return authCra.sign(authCra.derive_key(this.state.password, extra.salt, extra.iterations, extra.keylen), extra.challenge);
        }
        throw `don't know how to authenticate using '${method}'`;
      },
    }));
  }

  rpcCall(event) {
    event.preventDefault();
    this.props.actions.call('com.example.ping');
  }

  render() {
    const { username, loginError } = this.props.auth;
    return (
      <article>
        <Helmet>
          <title>Login</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div className="">
          <div className="row">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default panel-signin">
                <div className="panel-heading">
                  <h3 className="panel-title">Please Log in</h3>
                </div>
                <form className="form-signin">
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-user" /></span>
                    <input
                      type="text"
                      onChange={this.changeUsername}
                      value={this.state.username}
                      className="form-control"
                      placeholder="Username"
                    />
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-lock" /></span>
                    <input
                      type="password"
                      onChange={this.changePassword}
                      value={this.state.password}
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                  </div>
                  {!username && loginError &&
                    <div className="alert alert-danger">
                      {JSON.stringify(loginError)}
                    </div>}
                  <button className="btn btn-primary btn-block" onClick={(e) => this.login(e)}><i className="fa fa-sign-in" />{' '}Log in</button>
                  {this.props.pubSub &&
                  <div className="alert alert-danger">
                    {this.props.pubSub}
                  </div>}
                  <button className="btn btn-primary btn-block" onClick={(e) => Login.logout(e)}><i className="fa fa-sign-in" />{' '}Log Out</button>
                  <button className="btn btn-primary btn-block" onClick={(e) => this.rpcCall(e)}><i className="fa fa-sign-in" />{' '}Call</button>
                  {this.props.rpcCall &&
                  <div className="alert alert-danger">
                    {this.props.rpcCall}
                  </div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  actions: PropTypes.object,
  rpcCall: PropTypes.string,
  pubSub: PropTypes.any,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators(reduxAutobahn.actions, dispatch),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: createStructuredSelector({
    username: makeSelectUsername(),
    loggedIn: makeSelectLoggedIn(),
    role: makeSelectRole(),
    loginError: makeSelectLoginError(),
  }),
  rpcCall: makeRpcCallSelect(),
  pubSub: makepubSubSelect(),
  autobahnConnection: selectAutobahnConnection(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
