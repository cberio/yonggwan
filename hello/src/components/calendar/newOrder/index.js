import React, { Component } from 'react';
import $ from 'jquery';
import Search from '../search';
import ModalConfirm from '../modal/modalConfirm';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state={
      newOrderProduct : undefined,
      newOrderName : undefined,
      newOrderStart : this.props.selectedDate,
      newOrderEnd : undefined,
      newOrderComment : undefined
    };
    this.inputChangeProduct = this.inputChangeProduct.bind(this);
    this.inputChangeUserName = this.inputChangeUserName.bind(this);
    this.inputChangeOrderStart = this.inputChangeOrderStart.bind(this);
    this.inputChangeOrderEnd = this.inputChangeOrderEnd.bind(this);
    this.inputChangeComment = this.inputChangeComment.bind(this);
  }
  initNewOrder () {
    this.setState({
      newOrderProduct : undefined,
      newOrderName : undefined,
      newOrderStart : undefined,
      newOrderEnd : undefined,
      newOrderComment : undefined
    });
  }
  inputChangeProduct (e)   { this.setState({ newOrderProduct: e }); }
  inputChangeUserName (e)  { this.setState({ newOrderName : e.target.value }); }
  inputChangeOrderStart (e){ this.setState({ newOrderStart : e.target.value }); }
  inputChangeOrderEnd (e)  { this.setState({ newOrderEnd : e.target.value }); }
  inputChangeComment (e)   { this.setState({ newOrderComment : e.target.value }); }// 신규생성 인풋값 초기화

  render () {
    return (
      <ReactCSSTransitionGroup
          transitionName="new-order"
          transitionEnterTimeout={-1}
          transitionLeaveTimeout={-1}
          transitionAppear={true}
          transitionAppearTimeout={100}>
        <div className="new-order">
          <Search onChange={this.inputChangeProduct}/>
          <div><input type="text" value={this.state.newOrderName} onChange={ this.inputChangeUserName } placeholder="이름" autoFocus/></div>
          <div><input type="text" value={this.state.newOrderStart} onChange={ this.inputChangeOrderStart} placeholder="예약시작시간"/></div>
          <div><input type="text" value={this.state.newOrderEnd} onChange={ this.inputChangeOrderEnd } placeholder="예약종료시간"/></div>
          <div><input type="text" value={this.state.newOrderComment} onChange={ this.inputChangeComment } placeholder="남길말" /></div>
          <button className="new-order-submit" onClick={ () => { this.props.isConfirmSet(true) } }>제출하기</button>
          {
            this.props.isConfirm ?
              <ModalConfirm
                newOrderStart={this.state.newOrderStart}
                newOrderEnd={this.state.newOrderEnd}
                newOrderName={this.state.newOrderName}
                newOrderProduct={this.state.newOrderProduct}
                confirmOrder={ (bool) => this.props.renderOrder(bool, this.state) }
              />
              : undefined
          }
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
