import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ComposeEmail from '../components/ComposeEmail';
import EmailList from '../components/EmailList';
import Email from '../components/Email';

import * as actions from '../actions';
import Auth from '../modules/Auth';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      composing: false,
      showing: 'inbox',
      inbox: [],
      sent: [],
      drafts: [],
      emailDetails: false,
      emailIndex: null
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleComposeChange = this.handleComposeChange.bind(this);
    this.handleShowingChange = this.handleShowingChange.bind(this);
    this.handleEmailClick = this.handleEmailClick.bind(this);
    this.handleEmailClose = this.handleEmailClose.bind(this);
    this.handleDeleteEmail = this.handleDeleteEmail.bind(this);
  }

  componentWillMount() {
    if (Auth.isUserAuthenticated()) {
      this.props.fetchUser();
      this.props.getEmails();
      setInterval(this.props.getEmails, 5000);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.email !== prevProps.email) {
      this.setState({
        inbox: this.props.email.inbox,
        sent: this.props.email.sent,
        drafts: this.props.email.drafts
      });
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

  handleSave(e, to, subject, body) {
    e.preventDefault();

    to = encodeURIComponent(to);
    subject = encodeURIComponent(subject);
    body = encodeURIComponent(body);

    this.props.saveDraft(to, subject, body);
    this.handleComposeChange(false);
  }

  handleShowingChange(showing) {
    this.setState({ showing, emailDetails: false, emailIndex: null });
  }

  async handleLogout(e) {
    e.preventDefault();

    this.props.logout();
    this.props.history.replace('/');
  }

  handleComposeChange(flag) {
    this.setState({ composing: flag });
  }

  handleEmailClick(index) {
    this.setState({ emailDetails: true, emailIndex: index });
  }

  handleEmailClose() {
    this.setState({ emailDetails: false, emailIndex: null });
  }

  handleDeleteEmail(e, i) {
    e.stopPropagation();
    console.log(
      'Deleting email',
      this.state[this.state.showing][i]._id,
      this.state.showing
    );
    this.props.deleteEmail(
      this.state[this.state.showing][i]._id,
      this.state.showing
    );
  }

  renderCompose() {
    return (
      <div className="container floating-container">
        <div className="floating-container-inner">
          <ComposeEmail onSend={this.handleSend} onSave={this.handleSave} />
          <button
            className="btn btn-danger close-icon"
            onClick={e => this.handleComposeChange(false)}
          >
            x
          </button>
        </div>
      </div>
    );
  }

  renderEmails() {
    let emails;
    emails = this.state[this.state.showing];

    return (
      <EmailList
        emails={emails}
        onEmailClick={this.handleEmailClick}
        onDelete={this.handleDeleteEmail}
      />
    );
  }

  renderEmailDetails(index) {
    const email = this.state[this.state.showing][index];
    const closeButton = (
      <button
        className="btn btn-danger float-right close-email-icon"
        onClick={this.handleEmailClose}
      >
        X
      </button>
    );

    return (
      <Fragment>
        <Email data={email} closeButton={closeButton} />
      </Fragment>
    );
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
            <div className="col-10 email-list">
              {this.state.emailDetails
                ? this.renderEmailDetails(this.state.emailIndex)
                : this.renderEmails()}
            </div>
          </div>
        </div>

        {/* <div className="row">
          <h4>Footer</h4>
        </div> */}

        {this.state.composing ? this.renderCompose() : null}

        <button
          className="btn btn-success fab"
          onClick={e => this.handleComposeChange(true)}
          disabled={this.state.composing}
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
