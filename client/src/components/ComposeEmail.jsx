import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

class ComposeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      to: '',
      subject: '',
      body: ''
    };

    this.handleToChange = this.handleToChange.bind(this);
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
  }

  handleToChange(e) {
    this.setState({ to: e.target.value });
  }

  handleSubjectChange(e) {
    this.setState({ subject: e.target.value });
  }

  handleBodyChange(e) {
    this.setState({ body: e.target.value });
  }

  render() {
    return (
      <form>
        <div className="form-group row">
          <label className="col-sm-1 col-form-label" htmlFor="to">
            To:
          </label>
          <div className="col-sm-11">
            <input
              type="text"
              className="form-control"
              id="to"
              onChange={this.handleToChange}
              value={this.state.to}
            />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="subject" className="col-sm-1 col-form-label">
            Subject:
          </label>
          <div className="col-sm-11">
            <input
              type="text"
              className="form-control"
              id="subject"
              onChange={this.handleSubjectChange}
              value={this.state.subject}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            rows="15"
            className={'form-control ' + css(styles['no-resize'])}
            onChange={this.handleBodyChange}
            value={this.state.body}
          />
        </div>

        <button
          className="btn btn-primary float-right"
          onClick={e =>
            this.props.onSend(
              e,
              this.state.to,
              this.state.subject,
              this.state.body
            )
          }
        >
          Send
        </button>

        <button
          className="btn btn-secondary float-right mr-2"
          onClick={e =>
            this.props.onSave(
              e,
              this.state.to,
              this.state.subject,
              this.state.body
            )
          }
        >
          Save as Draft
        </button>
      </form>
    );
  }
}

const styles = StyleSheet.create({
  'no-resize': {
    resize: 'none'
  }
});

export default ComposeEmail;
