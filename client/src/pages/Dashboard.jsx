import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ComposeEmail from '../components/ComposeEmail';
import EmailList from '../components/EmailList';

import * as actions from '../actions';
import Auth from '../modules/Auth';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      composing: false,
      showing: 'inbox'
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleComposeChange = this.handleComposeChange.bind(this);
    this.handleShowingChange = this.handleShowingChange.bind(this);
  }

  componentWillMount() {
    if (Auth.isUserAuthenticated()) {
      this.props.fetchUser();
      this.props.getEmails();
    }
  }

  handleSend(e, to, subject, body) {
    e.preventDefault();

    const toArr = to.split('@');
    if (toArr.length !== 2) {
      this.props.emailError('Invalid email entered');
      return;
    }
    const username = encodeURIComponent(toArr[0]);
    const domain = encodeURIComponent(toArr[1]);
    subject = encodeURIComponent(subject);
    body = encodeURIComponent(body);

    this.props.sendEmail(username, domain, subject, body);
    this.handleComposeChange(false);
  }

  handleShowingChange(showing) {
    this.setState({ showing });
  }

  async handleLogout(e) {
    e.preventDefault();

    this.props.logout();
    this.props.history.replace('/');
  }

  handleComposeChange(flag) {
    this.setState({ composing: flag });
  }

  renderCompose() {
    return (
      <div className="container floating-container">
        <div className="floating-container-inner">
          <ComposeEmail onSend={this.handleSend} />
          <button
            className="btn btn-light"
            onClick={e => this.handleComposeChange(false)}
          >
            <span className="close-icon">x</span>
          </button>
        </div>
      </div>
    );
  }

  renderEmails() {
    let emails;
    emails = this.props.email[this.state.showing];

    return <EmailList emails={emails} />;
  }

  renderNavButtons() {
    return (
      <ul className="nav-list">
        <li
          onClick={() => this.handleShowingChange('inbox')}
          className={this.state.showing === 'inbox' ? 'active' : ''}
        >
          Inbox
        </li>
        <li
          onClick={() => this.handleShowingChange('sent')}
          className={this.state.showing === 'sent' ? 'active' : ''}
        >
          Sent
        </li>
        <li
          onClick={() => this.handleShowingChange('drafts')}
          className={this.state.showing === 'drafts' ? 'active' : ''}
        >
          Drafts
        </li>
      </ul>
    );
  }

  render() {
    if (!Auth.isUserAuthenticated()) {
      return <Redirect to="/" />;
    } else if (!this.props.auth.user) {
      return <div>Loading...</div>;
    }

    const { user } = this.props.auth;

    return (
      <div className="container-fluid d-flex h-100 flex-column">
        <div className="row justify-content-center header">
          <div className="col-3">
            <br />
            <h4 className="text-center">
              Welcome, {user.username}@{user.domain}
            </h4>
            <button
              className="btn btn-danger btn-block"
              onClick={this.handleLogout}
            >
              Log out
            </button>
            <br />
          </div>
        </div>

        <div className="row flex-fill d-flex">
          <div className="row w-100 dash-body">
            <div className="col-2 sidebar">{this.renderNavButtons()}</div>
            <div className="col-10 email-list">{this.renderEmails()}</div>
          </div>
        </div>

        {/* <div className="row">
          <h4>Footer</h4>
        </div> */}

        {this.state.composing ? this.renderCompose() : null}

        <button
          className="btn btn-success fab"
          onClick={e => this.handleComposeChange(true)}
        >
          <span className="fab-icon">+</span>
        </button>
      </div>
    );
  }
}

function mapStateToProps({ auth, email }) {
  return { auth, email };
}

export default connect(
  mapStateToProps,
  actions
)(Dashboard);
