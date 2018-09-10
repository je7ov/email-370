import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

import * as actions from './actions';
import Auth from './modules/Auth';
import './App.css';

import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route
          exact
          path="/"
          render={props => {
            if (Auth.isUserAuthenticated()) {
              return <Redirect to="/dashboard" />;
            } else {
              return <LoginRegister {...props} />;
            }
          }}
        />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(App)
);
