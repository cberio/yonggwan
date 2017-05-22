import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Images from '../../require/images';
import * as actions from '../../actions';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopover: false
        };
        this.handleMouseToggle = this.handleMouseToggle.bind(this);
    }

  // 샵관리 네비링크 팝오버 레이어 토글링
    handleMouseToggle(condition) {
        this.setState({
            isPopover: condition
        });
    }

    render() {
        const picture = false;
        return (
            <header id="header">
                <h1 className="header-brand-logo">
                    <NavLink to="/">HELLO<sup>™</sup>SHOP</NavLink>
                </h1>
                <ul className="header-nav">
                    {/* 2depth를 가지고있는 1depth li에는 has-submenu 클래스 추가*/}
                    <li className="nav-reservation has-submenu">
                        <NavLink to="/reservation/daily" activeClassName={'active'}>예약</NavLink>
                        <ul className="header-nav-sub">
                            <li className="nav-daily"><NavLink to="/reservation/daily" activeClassName={'active'}>DAILY</NavLink></li>
                            <li className="nav-overview"><NavLink to="/reservation/weekly" activeClassName={'active'}>WEEKLY</NavLink></li>
                        </ul>
                    </li>
                    <li className="nav-customer"><NavLink to="/customer" activeClassName={'active'}>고객</NavLink></li>
                    <li className="nav-search"><NavLink to="/search" activeClassName={'active'}>검색</NavLink></li>
                </ul>
                <div className="nav-notifier-wrap">
                    <div className="nav-notifier">
                        <button className={`button${this.props.isNotifier ? ' active' : ''}`} onClick={() => this.props.toggleNotifier(!this.props.isNotifier)}>
                            <i>알림</i>
                            <span className="state">7</span>
                        </button>
                    </div>
                </div>
                <div className="link-profile">
                    <NavLink
                        to="/"
                        onMouseOver={e => this.handleMouseToggle(true)}
                        onMouseLeave={e => this.handleMouseToggle(false)}
                        onFocus={e => this.handleMouseToggle(true)}
                        onBlur={e => this.handleMouseToggle(false)}
                    >
            Profile
            <img src={picture || Images.IMG_no_picture} alt="" />
                    </NavLink>
                    {this.state.isPopover && <div className="link-profile-popover">샵관리</div>}
                </div>
            </header>
        );
    }
}
const mapStateToPops = state => ({
    isNotifier: state.notifier.isNotifier
});
const mapDispatchToProps = dispatch => ({
    toggleNotifier: condition => dispatch(actions.notifier({ isNotifier: condition }))
});

export default connect(mapStateToPops, mapDispatchToProps)(Header);
