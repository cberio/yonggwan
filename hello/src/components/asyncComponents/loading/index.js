import React, { Component } from 'react';

class Loading extends Component {
  render () {
    return (
      <div className="loading-mask">
        <p className="loading-progressbar">Now loading...</p>
      </div>
    );
  }
}

export default Loading
