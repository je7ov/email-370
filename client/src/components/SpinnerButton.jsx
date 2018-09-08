import React, { Component } from 'react';
import { PulseLoader } from 'react-spinners';

class SpinnerButton extends Component {
  render() {
    if (this.props.loading) {
      return (
        <button className={this.props.className} disabled>
          <PulseLoader size={8} color="blue" />
        </button>
      );
    } else {
      return (
        <button className={this.props.className} onClick={this.props.onClick}>
          {this.props.children}
        </button>
      );
    }
  }
}

export default SpinnerButton;
