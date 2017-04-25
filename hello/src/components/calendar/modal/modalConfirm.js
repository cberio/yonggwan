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
        _component.props.modalConfirmHide();
        $(document).unbind('keydown');
        console.log('happend ModalConfirm');
      }
    });
  }
  render () {
    const props = this.props;
    const options = props.options;

    // 1.신규예약 생성시 모달 컨텐츠
    const optionComponent_Schedule = (props) => (
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
          <button onClick={ () => this.props.renderNewSchedule(true, this.props.newScheduleId, this.props.unknownStart)} ref={(t) => { this.input = t; }}>확인</button>
          <button onClick={ () => this.props.modalConfirmHide()}>취소</button>
        </div>
      </div>
    );
    // 2.예약변경시 모달 컨텐츠
    const optionComponent_EditSchedule = (props) => (
      <div className="modal-layer layer-center order-confirm">
        <div className="confirm-content">
          <p><span className="date">
              {moment(props.selectedSchedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
              {moment(props.selectedSchedule.end).locale('ko').format('A HH:mm')}</span>
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
          <button onClick={ () => this.props.renderNewSchedule(true, this.props.newScheduleId, this.props.unknownStart)} ref={(t) => { this.input = t; }}>확인</button>
          <button onClick={ () => this.props.modalConfirmHide()}>취소</button>
        </div>
      </div>
    );

    // 3.예약삭제시 모달 컨텐츠
    const optionComponent_RemoveSchedule = (props) => (
      <div className="modal-layer layer-center order-confirm">
        <div className="confirm-content">
          <p><span className="date">
              {moment(props.selectedSchedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
              {moment(props.selectedSchedule.end).locale('ko').format('A HH:mm')}</span>
          </p>
          <p>
            {props.selectedSchedule.guest_name ? <span className="name">{props.selectedSchedule.guest_name}</span> : <span className="name">고객명 미입력</span>}
            {props.selectedSchedule.rating ? <span className={`rating ${props.selectedSchedule.rating.toUpperCase()}`}>{props.selectedSchedule.rating}</span> : undefined} 님의
          </p>
          <p><span className={`product ${props.selectedSchedule.class}`}>{props.selectedSchedule.product}</span> 예약을 삭제하시겠습니까?</p>
        </div>
        <div className="confirm-ui">
          <button onClick={ () => this.props.removeSchedule()} ref={(t) => { this.input = t; }}>확인</button>
          <button onClick={ () => this.props.modalConfirmHide()}>취소</button>
        </div>
      </div>
    );

    return (
      <div className="modal-mask mask-full">
        {
          this.props.optionComponent === 'removeSchedule' ? optionComponent_RemoveSchedule(this.props) : (
          this.props.optionComponent === 'editSchedule' ?   optionComponent_EditSchedule(this.props) : (
          this.props.optionComponent === 'newSchedule' ?    optionComponent_Schedule(this.props) : <div>"error : undefined props optionComponent"</div>
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
  selectedSchedule: {
    start: undefined,
    end: undefined,
    name: undefined,
    class: undefined,
    product:undefined
  }
}

export default connect (mapStateToProps)(ModalConfirm);
