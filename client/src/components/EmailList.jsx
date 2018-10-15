import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            <li
              className="row row-eq-height list align-items-center"
              key={i}
              onClick={() => this.props.onEmailClick(i)}
            >
              <div className="col-sm-auto list-item-dark">
                <button
                  className="btn btn-danger btn-delete"
                  onClick={e => this.props.onDelete(e, i)}
                >
                  <FontAwesomeIcon icon="trash-alt" />
                </button>
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
