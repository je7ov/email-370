import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import ComposeEmail from '../components/ComposeEmail';
import EmailList from '../components/EmailList';
import Email from '../components/Email';
import Draft from '../components/Draft';

import * as actions from '../actions';
import Auth from '../modules/Auth';
import { deepEquals } from '../helpers';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.divider =
      '\n===============================================================\n';

    this.state = {
      loading: true,
      composing: false,
      showing: 'inbox',
      inbox: [],
      sent: [],
      drafts: [],
      emailDetails: false,
      emailIndex: null,
      draftEdit: false,
      composeData: { to: '', subject: '', body: '' }
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleComposeChange = this.handleComposeChange.bind(this);
    this.handleShowingChange = this.handleShowingChange.bind(this);
    this.handleEmailClick = this.handleEmailClick.bind(this);
    this.handleEmailClose = this.handleEmailClose.bind(this);
    this.handleDeleteEmail = this.handleDeleteEmail.bind(this);
    this.handleReplyClick = this.handleReplyClick.bind(this);
    this.handleForwardClick = this.handleForwardClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !this.state.loading &&
      deepEquals(this.props.email, nextProps.email) &&
      deepEquals(this.state, nextState)
    ) {
      return false;
    }

    return true;
  }

  componentWillMount() {
    if (Auth.isUserAuthenticated()) {
      this.props.fetchUser();
      this.props.getEmails();
      setInterval(this.props.getEmails, 5000);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.email.success && this.props.email.error) {
      window.alert('Please enter a correct email');
      this.props.clearEmailError();
    } else if (this.props.email !== prevProps.email) {
      this.setState({
        inbox: this.props.email.inbox,
        sent: this.props.email.sent,
        drafts: this.props.email.drafts,
        loading: false
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

    if (this.state.draftEdit) {
      this.props.deleteDraft(
        this.props.email.drafts[this.state.emailIndex]._id
      );
    }
  }

  handleSave(e, to, subject, body) {
    e.preventDefault();

    to = encodeURIComponent(to);
    subject = encodeURIComponent(subject);
    body = encodeURIComponent(body);

    if (this.state.draftEdit) {
      this.props.editDraft(
        this.props.email.drafts[this.state.emailIndex]._id,
        to,
        subject,
        body
      );
    } else {
      this.props.saveDraft(to, subject, body);
    }

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
    this.setState({
      composing: flag,
      draftEdit: false,
      composeData: flag
        ? this.state.composeData
        : { to: '', body: '', subject: '' }
    });
  }

  handleEmailClick(index) {
    if (this.state.showing === 'drafts') {
      const { to, subject, body } = this.state.drafts[index];

      this.setState({
        composing: true,
        composeData: { to, subject, body },
        emailIndex: index,
        draftEdit: true
      });
    } else {
      this.setState({ emailDetails: true, emailIndex: index });
    }
  }

  handleEmailClose() {
    this.setState({ emailDetails: false, emailIndex: null });
  }

  handleDeleteEmail(e, i) {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${
        this.state.showing === 'drafts' ? 'draft' : 'email'
      }?`
    );
    if (confirmed) {
      if (this.state.showing === 'drafts') {
        this.props.deleteDraft(this.state.drafts[i]._id);
      } else {
        this.props.deleteEmail(
          this.state[this.state.showing][i]._id,
          this.state.showing
        );
      }
    }
  }

  handleReplyClick() {
    const { fromUsername, fromDomain, subject, body, timeSent } = this.state[
      this.state.showing
    ][this.state.emailIndex];

    const fromInformation = `${fromUsername}@${fromDomain} message on ${moment(
      timeSent
    ).format('dddd, MMMM Do YYYY, h:mm:ss a')}`;

    let divider = '\n';
    for (let i = 0; i < fromInformation.length; i++) divider += '=';
    divider += '\n';

    console.log(divider);

    const replyBody = `\n${divider}${fromInformation}${divider}${body}`;

    this.setState({
      composeData: {
        to: `${fromUsername}@${fromDomain}`,
        subject: `REPLY: ${subject}`,
        body: replyBody
      },
      composing: true
    });
  }

  handleForwardClick() {
    const { fromUsername, fromDomain, subject, body, timeSent } = this.state[
      this.state.showing
    ][this.state.emailIndex];

    const fromInformation = `${fromUsername}@${fromDomain} message on ${moment(
      timeSent
    ).format('dddd, MMMM Do YYYY, h:mm:ss a')}`;

    let divider = '\n';
    for (let i = 0; i < fromInformation.length; i++) divider += '=';
    divider += '\n';

    this.setState({
      composeData: {
        to: '',
        subject: `FWD: ${subject}`,
        body: `${divider}${fromInformation}${divider}${body}`
      },
      composing: true
    });
  }

  renderCompose() {
    return (
      <div className="container floating-container">
        <div className="floating-container-inner">
          <ComposeEmail
            onSend={this.handleSend}
            onSave={this.handleSave}
            data={this.state.composeData}
          />
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

    return (
      <Fragment>
        {this.state.showing === 'drafts' ? (
          <Draft data={email} handleClose={this.handleEmailClose} />
        ) : (
          <Email
            data={email}
            handleClose={this.handleEmailClose}
            handleReplyClick={this.handleReplyClick}
            handleForwardClick={this.handleForwardClick}
          />
        )}
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
