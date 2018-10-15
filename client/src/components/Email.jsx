import React, { Component } from "react";
import moment from "moment";

class Email extends Component {
  render() {
    const {
      data,
      handleForwardClick,
      handleReplyClick,
      handleClose
    } = this.props;

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
              onClick={handleClose}
            >
              X
            </button>
          </div>
        </div>
        <div className="row">
          <h4>
            <strong>To: </strong>
            {`${data.toUsername}@${data.toDomain}`}
          </h4>
        </div>
        <div className="row">
          <h4>
            <strong>Subject: </strong>
            {data.subject}
          </h4>
        </div>
        <div className="row">
          <p>
            Sent at{" "}
            {moment(data.timeSent).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </p>
        </div>
        <div className="row flex-fill d-flex email-body">
          <h5>
            <pre>{data.body}</pre>
          </h5>
        </div>
        <div className="row">
          <button
            className="btn btn-info btn-hor-list"
            onClick={handleForwardClick}
          >
            Forward
          </button>
          <button className="btn btn-info" onClick={handleReplyClick}>
            Reply
          </button>
        </div>
      </div>
    );
  }
}

export default Email;
