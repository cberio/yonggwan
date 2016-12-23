import React, { Component } from 'react';

export default class ModalConfirm extends Component {
  render () {
    return (
      <div className="modal-confirm">
        <div>          
          <p>{this.props.newOrderStart} ~ {this.props.newOrderEnd}</p>
          <p>
            {`${this.props.newOrderName} 님의 ${this.props.newOrderProduct} 예약을 생성하시겠습니까?`}
          </p>
          <div className="confirm-buttons">
            <button onClick={ () => this.props.confirmOrder(false)}>취소</button>
            <button onClick={ () => this.props.confirmOrder(true)} autoFocus>확인</button>
          </div>
        </div>
      </div>
    )
  }
};
