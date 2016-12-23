import React, { Component } from 'react';

class Noti extends Component {
  constructor (props) {
    super (props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (){
    console.log('나의 props 는..');
    console.log(this.props);
  }

  render () {
    const unLeadMessage = (
      this.props.new < 10 ? <span className="header-util-new">{this.props.new}</span> : <span className="header-util-new">9+</span>
    )
    return (
      <li>
        <button onClick={this.handleClick} className="header-util-btn">{this.props.type}</button>
        {this.props.new > 0 ? unLeadMessage : undefined}
      </li>
    )
  }
}

export default Noti;
