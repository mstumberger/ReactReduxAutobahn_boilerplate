/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect/es';
import { selectAutobahnIsConnected } from '../selectors';


class PrivateRoute extends React.Component {
  render() {
    const { component: Component, auth, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) => (
          auth.isConnected ? <Component {...props} />
            : <Redirect to="/login" />
        )}
      />
    );
  }
}

PrivateRoute.propTypes = {
  auth: PropTypes.any,
  component: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  auth: selectAutobahnIsConnected(),
});

export default connect(mapStateToProps)(PrivateRoute);
