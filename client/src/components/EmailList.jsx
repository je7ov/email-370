import React, { Component } from 'react';

class EmailList extends Component {
  render() {
    const { emails } = this.props;

    if (!emails) {
      return <h4>Loading...</h4>;
    } else if (emails.length === 0) {
      return <h4>No emails</h4>;
    } else {
      return (
        <ul>
          {emails.map((email, i) => (
            <li className="row list" key={i}>
              <div className="col-sm-auto list-item-dark">
                <h4>
                  <strong>
                    {email.fromUsername}@{email.fromDomain}:{' '}
                  </strong>
                </h4>
                <h5>{email.subject}</h5>
              </div>
              <div className="col-sm list-item-light">
                <p>{email.body}</p>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  }
}

export default EmailList;
