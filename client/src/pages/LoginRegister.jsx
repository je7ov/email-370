import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Validator from '../modules/Validator';
import SpinnerButton from '../components/SpinnerButton';

class LoginRegister extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      domain: '',
      domains: [],
      password: '',
      passwordConfirm: '',
      login: true
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(
      this
    );
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleDismissError = this.handleDismissError.bind(this);
  }

  async componentDidMount() {
    await this.props.getDomains();
    if (this.props.auth.domains && this.props.auth.domains.length > 0) {
      this.setState({
        domain: this.props.auth.domains[0],
        domains: this.props.auth.domains
      });
    }
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handleDomainChange(e) {
    this.setState({ domain: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handlePasswordConfirmChange(e) {
    this.setState({ passwordConfirm: e.target.value });
  }

  handleRegisterSubmit(e) {
    e.preventDefault();

    const username = encodeURIComponent(this.state.username);
    const domain = encodeURIComponent(this.state.domain);
    const password = encodeURIComponent(this.state.password);
    const errors = [];

    // Register user
    const validUsername = Validator.validateUsername(this.state.username);
    if (!validUsername.valid) {
      validUsername.errors.forEach(error => errors.push(error));
    }

    const validPassword = Validator.validatePassword(this.state.password);
    if (!validPassword.valid) {
      validPassword.errors.forEach(error => errors.push(error));
    }

    if (this.state.password.trim() !== this.state.passwordConfirm.trim()) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      const errorMessage = errors.join(', ');
      this.throwError(errorMessage);
      return;
    }

    this.props.register(username, domain, password);
  }

  handleLoginSubmit(e) {
    e.preventDefault();

    const username = encodeURIComponent(this.state.username);
    const domain = encodeURIComponent(this.state.domain);
    const password = encodeURIComponent(this.state.password);

    this.props.login(username, domain, password);
  }

  handleFormChange(e) {
    e.preventDefault();
    this.setState({ login: !this.state.login });
  }

  handleDismissError(e) {
    e.preventDefault();
    this.props.clearAuth();
  }

  throwError(error) {
    this.props.authError({
      success: false,
      error
    });
  }

  renderForm() {
    return (
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <form>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label" htmlFor="username">
                Username:
              </label>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  onChange={this.handleUsernameChange}
                  value={this.state.username}
                />
              </div>
              <div className="col-sm-4">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">@</div>
                  </div>
                  <select
                    className="form-control"
                    value={this.state.domain}
                    onChange={this.handleDomainChange}
                  >
                    {this.state.domains.map((domain, i) => (
                      <option key={i}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label" htmlFor="password">
                Password:
              </label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  onChange={this.handlePasswordChange}
                  value={this.state.password}
                />
              </div>
            </div>

            {this.state.login ? null : (
              <div className="form-group row">
                <label
                  className="col-sm-2 col-form-label"
                  htmlFor="passwordConfirm"
                >
                  Confirm:
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    id="passwordConfirm"
                    onChange={this.handlePasswordConfirmChange}
                    value={this.state.passwordConfirm}
                  />
                </div>
              </div>
            )}

            <SpinnerButton
              loading={this.props.auth.isLoading}
              onClick={
                this.state.login
                  ? this.handleLoginSubmit
                  : this.handleRegisterSubmit
              }
              className="btn btn-primary btn-block"
            >
              {this.state.login ? 'Log In' : 'Register'}
            </SpinnerButton>

            <button
              className="btn btn-outline-secondary btn-block btn"
              onClick={this.handleFormChange}
            >
              {this.state.login
                ? "Don't have an account? Register now!"
                : 'Already have an account? Log in!'}
            </button>
          </form>
          <br />
          {this.renderError()}
        </div>
      </div>
    );
  }

  renderError() {
    if (this.props.auth.error) {
      const error = this.props.auth.error;

      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error: </strong>
          {error}
          <button className="close" onClick={this.handleDismissError}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className={css(styles.title)}>em@il</h1>
        <br />
        {this.renderForm()}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 86,
    textAlign: 'center',
    color: '#999'
  }
});

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(LoginRegister);
