import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class Header extends Component {
  constructor (props) {
    super (props);
  }
  render() {
    return (
      <header id="header">
      	<h1 className="header-brand-logo">
          <Link to="/">HELLO<sup>™</sup>SHOP</Link>
        </h1>
        <ul className="header-nav">
          {/* 2depth를 가지고있는 1depth li에는 has-submenu 클래스 추가*/}
          <li className="nav-reservation has-submenu">
            <Link to="/reservation/daily" activeClassName={"active"}>예약현황</Link>
              <ul className="header-nav-sub">
                <li className="nav-daily"><Link to="/reservation/daily" activeClassName={"active"}>DAILY</Link></li>
                <li className="nav-overview"><Link to="/reservation/overview" activeClassName={"active"}>WEEKLY</Link></li>
              </ul>
          </li>
          <li className="nav-customer"><Link to="/customer" activeClassName={"active"}>고객</Link></li>
          <li className="nav-search"><Link to="/search" activeClassName={"active"}>검색</Link></li>
        </ul>
        <div className="nav-notifier-wrap">
          <div className="nav-notifier">
            <button className={`button ${this.props.isNotifier && ' active'}`} onClick={ () => this.props.toggleNotifier(!this.props.isNotifier) }>
              <i>미리알림</i>
              <span className="state">7</span>
            </button>
          </div>
        </div>
        <div className="link-profile">
          <Link to="/">Profile</Link>
        </div>
      </header>
    );
  }
}
const mapStateToPops = (state) => {
  return {
    isNotifier : state.notifier.isNotifier
  }
}
const mapDispatchToProps = (dispatch) => {
   return {
     toggleNotifier: (condition) => dispatch(actions.notifier({ isNotifier: condition }))
   }
}

export default connect (mapStateToPops, mapDispatchToProps)(Header);
