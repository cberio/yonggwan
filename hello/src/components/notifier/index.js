import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import CardContainer from './cardContainer';
import Schedules from '../../data/schedules';
import '../../css/notifier.css';
import '../../lib/jquery-custom-scrollbar-master/jquery.custom-scrollbar.js';
import '../../lib/jquery-custom-scrollbar-master/jquery.custom-scrollbar.css';

class Head extends Component {
  render () {
    // 메뉴별 new갯수를 합산 합니다
    let total = 0;
    let menus = this.props.menus;
    for(let i=0; i < this.props.menus.length; i++){
      if (menus[i].new) total += menus[i].new;
    }
    return (
      <div className="notifier-head">
        <div className="title">
          <h3>미리알림</h3>
          <p>총 {total || 0}건</p>
        </div>
        <div className="close">
          <button className="button" onClick={this.props.handleClick}>창닫기</button>
        </div>
      </div>
    )
  }
};

class TabMenu extends Component {
  render () {
    let positionLeft = (100/this.props.menus.length) * (this.props.selectedIndex)
    return (
      <div className="notifier-tabmenu-wrap">
        <span className="notifier-tabmenu-bgBar" style={{left: positionLeft + '%'}}></span>
        <div className="notifier-tabmenu">
          <ul className="tab-menu clearfix">
            {
              this.props.menus.map((menu, i) => {
                return (
                  <li className={this.props.selectedIndex === i ? 'active' : null} key={i}>
                    <button onClick={ () => this.props.handleClick(i) }>
                      <span className="menu">{menu.title}</span>
                      {menu.new ? <span className="state">{menu.new}</span> : null}
                    </button>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
};

class Notifier extends Component {
  constructor (props, container) {
    super (props);
    this.state = {
      menus:[ { title: "ALL"}, { title: "메모", new: 7}, { title: "변경", new: 0}, { title: "취소", new: 2}, { title: "신규", new: 14}, { title: "요청", new: 0} ],
      menuSelectedIndex: 5,
      scrolerHeight: null
    };
    this.container = container;
    this.menuToggle = this.menuToggle.bind(this);
    this.setScrolerHeight = this.setScrolerHeight.bind(this);
  }
  // tabmenu toggle
  menuToggle (i) {
    this.setState({menuSelectedIndex: i});
    return false;
  }
  setScrolerHeight (isInit) {
    this.setState({
      scrolerHeight: window.innerHeight - (
                        $('.notifier-head').outerHeight() +
                        $('.notifier-tabmenu-wrap').outerHeight() +
                        $('.notifier-container.scroller').css('margin-top').replace('px','') * 1
                      )
    }, () => {
      if (isInit) $('.scroller').customScrollbar({'updateOnWindowResize': true});
    });
  }
  cardDistroy (index) {
    console.log('index: '+index);
  }
  componentDidMount () {
    let _component = this;
    _component.setScrolerHeight(true);
    $('body').addClass('opened-notifier');
  }
  componentWillUnmount() {
    $('body').removeClass('opened-notifier');
  }
  render () {
    // prop CardType은 메뉴의 title과 동일하게 입력하면, 카드의 텍스트등이 형식에 맞춰 display 됨.
    return (
      <div className="notifier-wrap">
        <div className="notifier">
          <Head menus={this.state.menus} handleClick={ () => this.props.toggleNotifier(false) }/>
          <TabMenu menus={this.state.menus} selectedIndex={this.state.menuSelectedIndex} handleClick={this.menuToggle} />
          <div className="notifier-container scroller dark-skin" style={{height: this.state.scrolerHeight + 'px'}}>
            <div className="head-by-daily">
              <p>오늘</p>
              <button className="close">닫기</button>
            </div>
            <div className="head-by-menu">
              <p>신규예약</p>
              <button>닫기</button>
            </div>
            <div className="notifier-contents">
              {
                Schedules.map((schedule, i) => {
                  if (schedule.code === '05') return;
                  return (
                    <CardContainer schedule={schedule} key={i} index={i} CardType="요청" cardDistroy={this.cardDistroy}/>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Notifier;
