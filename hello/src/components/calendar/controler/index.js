import React, { Component } from 'react';

export default class Controler extends Component {
  render () {
    return (
      <div className="controler">
        <button onClick={this.props.onClick}>swipe</button>
      </div>
    );
  }
}
