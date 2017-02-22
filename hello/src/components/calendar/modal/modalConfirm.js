import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import { connect } from 'react-redux';

class ModalConfirm extends Component {
  componentDidMount() {
    const _component = this;
    $('.confirm-ui button:first').focus();
    // ESC key 입력시 닫기
    $(document).bind('keydown', function(e){
      if (e.which === 27) {
        console.log('happend ModalConfirm');
        _component.props.modalConfirmHide();
        $(document).unbind('keydown');
      }
    });
  }
  render () {
    const props = this.props;
    const options = props.options;

    // 1.신규예약 생성시 모달 컨텐츠
    const optionComponent_NewEvent = (props) => (
      <div className="modal-layer layer-center order-confirm">
        <div className="confirm-content">
          <p><span className="date">
              {moment(options.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
              {moment(options.end).locale('ko').format('A HH:mm')}</span>
          </p>
          <p>
            {options.name ? <span className="name">{options.name}</span> : <span className="name">고객명 미입력</span>}
            {options.rating ? <span className={`rating ${options.rating.toUpperCase()}`}>{options.rating}</span> : undefined} 님의
          </p>
          <p><span className={`product ${options.class}`}>{options.product}</span> 예약을 생성하시겠습니까?</p>
        </div>
        <div className="confirm-ui">
          <button onClick={ () => this.props.step_render(true, this.props.newEventId, this.props.isNotAutoSelectTime)} ref={(t) => { this.input = t; }}>확인</button>
          <button onClick={ () => this.props.modalConfirmHide()}>취소</button>
        </div>
      </div>
    );
    // 2.예약변경시 모달 컨텐츠
    const optionComponent_EditEvent = (props) => (
      <div className="modal-layer layer-center order-confirm">
        <div className="confirm-content">
          <p><span className="date">
              {moment(props.selectedEvent.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
              {moment(props.selectedEvent.end).locale('ko').format('A HH:mm')}</span>
          </p>
          <p>
            {options.name ? <span className="name">{options.name}</span> : <span className="name">이름없음</span>}
            {options.rating ? <span className={`rating ${options.rating.toUpperCase()}`}>{options.rating}</span> : undefined} 님의
          </p>
          <p><span className={`product ${options.class}`}>{options.product}</span> 예약을</p>
          <p className="change-date">
            {
              props.editedDate ? (
                <span className="date">
                  {moment(props.editedDate.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
                  {moment(props.editedDate.end).locale('ko').format('A HH:mm')}
                </span>
              ) : ''
            }
          </p>
          <p>으로 변경하시겠습니까?</p>
        </div>
        <div className="confirm-ui">
          <button onClick={ () => this.props.step_render(true, this.props.newEventId, this.props.isNotAutoSelectTime)} ref={(t) => { this.input = t; }}>확인</button>
          <button onClick={ () => this.props.modalConfirmHide()}>취소</button>
        </div>
      </div>
    );

    // 3.예약삭제시 모달 컨텐츠
    const optionComponent_RemoveEvent = (props) => (
      <div className="modal-layer layer-center order-confirm">
        <div className="confirm-content">
          <p><span className="date">
              {moment(props.selectedEvent.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
              {moment(props.selectedEvent.end).locale('ko').format('A HH:mm')}</span>
          </p>
          <p>
            {props.selectedEvent.name ? <span className="name">{props.selectedEvent.name}</span> : <span className="name">고객명 미입력</span>}
            {props.selectedEvent.rating ? <span className={`rating ${props.selectedEvent.rating.toUpperCase()}`}>{props.selectedEvent.rating}</span> : undefined} 님의
          </p>
          <p><span className={`product ${props.selectedEvent.class}`}>{props.selectedEvent.product}</span> 예약을 삭제하시겠습니까?</p>
        </div>
        <div className="confirm-ui">
          <button onClick={ () => this.props.removeEvent()} ref={(t) => { this.input = t; }}>확인</button>
          <button onClick={ () => this.props.modalConfirmHide()}>취소</button>
        </div>
      </div>
    );

    return (
      <div className="modal-mask mask-full">
        {
          this.props.optionComponent === 'removeEvent' ? optionComponent_RemoveEvent(this.props) : (
          this.props.optionComponent === 'editEvent' ?   optionComponent_EditEvent(this.props) : (
          this.props.optionComponent === 'newEvent' ?    optionComponent_NewEvent(this.props) : <div>"error : undefined props optionComponent"</div>
          ))
        }
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    optionComponent: state.modalConfirm.optionComponent
  }
}

ModalConfirm.defaultProps = {
  options: {
    name: undefined,
    class: undefined,
    rating: undefined,
    product: undefined,
    start: undefined,
    end: undefined
  },
  selectedEvent: {
    start: undefined,
    end: undefined,
    name: undefined,
    class: undefined,
    product:undefined
  }
}

export default connect (mapStateToProps)(ModalConfirm);
