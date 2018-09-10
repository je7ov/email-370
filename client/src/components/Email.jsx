import React, { Component } from 'react';

class Email extends Component {
  render() {
    const { data } = this.props;
    console.log(data);

    return (
      <div>
        <h4>
          <strong>From: </strong>
          {`${data.fromUsername}@${data.fromDomain}`}
        </h4>
        <h4>
          <strong>Subject: </strong>
          {data.subject}
        </h4>
        <h5>{data.body}</h5>
      </div>
    );
  }
}

export default Email;
