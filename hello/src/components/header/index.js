import React, { Component } from 'react';
import { Link } from 'react-router';
import Notification from './notification';

class Header extends Component {
  render() {
    return (
      <header id="header">
      	<h1 className="header-brand-logo">
          <Link to="/">HELLO<sup>™</sup>SHOP</Link>
        </h1>
        <ul className="header-nav">
          <li className="nav-daily"><Link to="/reservation/daily" activeClassName={"active"}>데일리</Link></li>
          <li className="nav-overview"><Link to="/reservation/overview" activeClassName={"active"}>오버뷰</Link></li>
          <li className="nav-customer"><Link to="/customer" activeClassName={"active"}>고객</Link></li>
          <li className="nav-search"><Link to="/search" activeClassName={"active"}>검색</Link></li>
        </ul>
      	<Notification />
        <div className="link-profile">
          <Link to="/">Profile</Link>
        </div>
      </header>
    );
  }
}
export { Header }
