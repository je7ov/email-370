import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../actions';
import Auth from '../modules/Auth';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    if (Auth.isUserAuthenticated()) {
      this.props.fetchUser();
    }
  }

  async handleLogout(e) {
    e.preventDefault();

    this.props.logout();
    this.props.history.replace('/');
  }

  render() {
    if (!Auth.isUserAuthenticated()) {
      return <Redirect to="/" />;
    } else if (!this.props.auth.user) {
      return <div>Loading...</div>;
    }

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-8 text-center">
            <h1>Welcome, {this.props.auth.user.username}!</h1>
            <h3>This is the temporary dashboard for your email client</h3>
            <button className="btn btn-danger" onClick={this.handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  console.log(auth);
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(Dashboard);
