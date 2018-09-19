import React, { Component } from 'react';

class Email extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="container-fluid d-flex h-100 flex-column email-container">
        <div className="row">
          <h4>
            <strong>From: </strong>
            {`${data.fromUsername}@${data.fromDomain}`}
          </h4>

          <div className="col-sm-auto align-self-end">
            <button
              className="btn btn-danger float-right close-email-icon"
              onClick={this.props.handleClose}
            >
              X
            </button>
          </div>
        </div>
        <div className="row">
          <h4>
            <strong>To: </strong>
            {data.to}
          </h4>
        </div>
        <div className="row">
          <h4>
            <strong>Subject: </strong>
            {data.subject}
          </h4>
        </div>
        <div className="row flex-fill d-flex email-body">
          <h5>{data.body}</h5>
        </div>
      </div>
    );
  }
}

export default Email;
