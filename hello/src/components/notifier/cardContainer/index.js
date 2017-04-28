import React from 'react';
import $ from 'jquery';
import Card from '../card';

class CardContainer extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isModal: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal (condition) {
    this.setState({
      isModal: condition
    }, () => {
      if (condition) this.refs.button.focus();
    });
  }
  getButtonText (cardType) {
    switch (cardType) {
      case '취소' : return '지우기';
      case '요청' : return '취소하기';
      case '변경' : return '지우기';
      default :     return '';
    }
  }
  getButtonClass (cardType) {
    switch (cardType) {
      case '취소' : return 'remove';
      case '요청' : return 'cancel';
      case '변경' : return 'remove';
      default :     return null;
    }
  }
  getModalText (cardType) {
    switch (cardType) {
      case '취소' : return '.....?';
      case '요청' : return '예약요청을 취소 하시겠습니까?';
      case '변경' : return '.....?';
      default :     return '.....?';
    }
  }
  render () {
    return (
      <div className="card">
        <Card
          cardType={this.props.cardType}
          schedule={this.props.schedule}
        />
        <div className="card-foot">
          <button
            className={this.getButtonClass(this.props.cardType)}
            onClick={ () => this.toggleModal(true) }>
              {this.getButtonText(this.props.cardType)}
          </button>
        </div>
        <div className="card-modal" style={{display: this.state.isModal ? 'block' : 'none'}}>
          <div className="modal-message">
            <p>{this.getModalText(this.props.cardType)}</p>
          </div>
          <div className="modal-ui">
            <button onClick={ () => this.props.cardDistroy(this.props.index)} ref="button">확인</button>
            <button onClick={ () => this.toggleModal(false) }>취소</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CardContainer;
