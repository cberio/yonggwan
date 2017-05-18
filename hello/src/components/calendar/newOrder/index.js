import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';
import update from 'immutability-helper';
import { SearchGuest, SearchService, Selectable } from '../select';
import Staffs from '../../../data/staffs';
import Services from '../../../data/services';
import Guests from '../../../data/guests';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import '../../../css/newOrder.css';
import '../../../css/customerCard.css';

class NewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newOrderStep: this.props.Step, // int 1-3
            newOrderGuestName: this.props.GuestName, // str
            newOrderSex: this.props.Sex, // int 0-2
            newOrderPhone: this.props.Phone, // array
            newOrderService: this.props.Service, // object (service object)
            newOrderStaff: this.props.Staff, // object
            newOrderGuest: this.props.Guest,  // object
            newOrderStart: this.props.Start, // moment format
            newOrderEnd: this.props.End, // moment format
            newOrderTime: this.props.Time // HH:mm
        };
        this.documentBinding = this.documentBinding.bind(this);
        this.initEditEvent = this.initEditEvent.bind(this);
        this.insertComponent = this.insertComponent.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.autoFocus = this.autoFocus.bind(this);
        this.inputChangeStaff = this.inputChangeStaff.bind(this);
        this.inputChangeService = this.inputChangeService.bind(this);
        this.inputChangeGuest = this.inputChangeGuest.bind(this);
        this.inputChangeUserPhone = this.inputChangeUserPhone.bind(this);
        this.inputChangeUserSex = this.inputChangeUserSex.bind(this);
        this.inputChangeOrderStart = this.inputChangeOrderStart.bind(this);
        this.inputChangeOrderEnd = this.inputChangeOrderEnd.bind(this);
    }

    printWarring(msg) {
        console.warn(`${msg} prop is undefined`);
    }

    documentBinding() {
        const component = this;
    // ESC key 입력시 닫기
        $(document).bind('keydown', (e) => {
            if (e.which === 27 && !component.props.isModalConfirm && !component.props.isRenderConfirm) {
                if (component.state.newOrderStep < 3)
                    component.props.newOrderCancel();
                else {
                    component.backToStep(2);
                    component.props.backToOrder();
                }
                $(document).unbind('keydown');
            }
        });
    }

    initEditEvent(e) {
        this.setState({
            newOrderStep: 3,
            newOrderService: Functions.getService(e.service.code),
            newOrderStaff: Functions.getStaff(e.resourceId),
            newOrderGuest: {
                name: e.guest_name,
                phone: e.guest_mobile,
                kakao: e.kakao,
                line: e.line,
                rating: e.guest_class,
                picture: e.picture
            },
            newOrderStart: moment(e.start).format(),
            newOrderEnd: moment(e.end).format(),
            newOrderTime: Functions.millisecondsToMinute(moment(e.end).diff(moment(e.start))),
        });
    // step-3 으로 바로 이동하기때문에 캘린더 Height를 조절합니다
        this.props.setCalendarHeight(3);
    }

    insertComponent(unknownStart) {
        if (!unknownStart) {

        }
    }

    setNewOrderStaff(staff) {
        this.setState({ newOrderStaff: staff });
    }

    getScheduleObj() {
        return this.state;
    }

    backToStep(step) {
        this.setState({ newOrderStep: step });
    }

    nextStep() {
        const component = this;
        switch (this.state.newOrderStep) {
            case 1 :
                this.changeStep(2);
                break;
            case 2 :
                if (this.props.unknownStart)
                    this.props.renderNewScheduleUnknownStart(true, this.state);
                else
          this.props.beforeInitConfirmRenderNewSchedule(true, this.state);

                this.setState({ newOrderStep: 3 });
                break;
            case 3 :
                this.props.modalConfirm(true);
                break;
            default:
                break;
        }
        setTimeout(() => {
            // component.props.setCalendarHeight(component.state.newOrderStep);
        }, 0);
    }

    changeStep(step) {
        this.setState({
            newOrderStep: step
        });
    // 렌더링을 한 후에 이전단계의 step 으로 가는 경우
    // if (this.state.newOrderStep === 3 && step < 3) {
    // }
    }

    autoFocus(e) {
        const phone = this.state.newOrderPhone;
        if (phone[0].length >= 3 && phone[1].length >= 4 && e.target.value.length >= 4) this.refs.next.focus();
    }

    inputChangeService(e) {
        const serviceTime = moment.duration(e.time).asMinutes(); // mm
        const endTime = moment(this.state.newOrderStart).add(serviceTime, 'minutes');
        this.setState({
            newOrderService: e,
            newOrderTime: e.time,
            newOrderEnd: endTime.format()
        });
    }
    inputChangeStaff(obj) {
        this.setState({
            newOrderStaff: obj
        });
    }
    inputChangeUserPhone(e, idx) {
        this.setState({
            newOrderPhone: update(this.state.newOrderPhone, {
                [idx]: { $set: e.target.value }
            })
        });
    }
    inputChangeGuest(option) {
        const component = this;
        // 등록된 고객중에 선택한 경우
        if (!_.isEmpty(JSON.stringify(option.id))) {
            // clear states
            this.setState({ newOrderGuest: option, newOrderGuestName: undefined }, () => {
              component.refs.next.focus();
            });
        }
        // 등록된 고객중에 선택하지 않은경우
        else {
            // set states
            this.setState({ newOrderGuest: undefined, newOrderGuestName: option.value }, () => {
              if (!_.isEmpty(option))
                  component.refs.phone.focus();
            });
        }
    }
    inputChangeUserSex(e) { this.setState({ newOrderSex: e.target.value }); }
    inputChangeOrderStart(e) { this.setState({ newOrderStart: e.target.value }); }
    inputChangeOrderEnd(e) { this.setState({ newOrderEnd: e.target.value }); }

    componentWillUnmount() {
        this.props.setCalendarHeight(true);
    }

    componentDidMount() {
    // Window event binding
        this.documentBinding();
    // init insert NewOrder component
        this.insertComponent(this.props.unknownStart);
    // 예약수정, 예약요청확인 인경우
        if (this.props.isEditEvent)
            this.initEditEvent(this.props.willEditEventObject);
    }

    render() {
        const state = this.state;
        const step = this.state.newOrderStep;
        const title = this.props.isRequestReservation ? '예약요청 확인' : this.props.isEditEvent ? '예약변경' : '예약생성';

        const newOrderStep1 = (
          <CSSTransitionGroup
            transitionName="service-input"
            transitionAppear
            transitionLeave={false}
            transitionEnter={false}
            transitionAppearTimeout={0}
          >
            <div className="service-input">
              <SearchGuest
                name="customer"
                autoFocus
                className="search-customer"
                placeholder="고객님의 이름을 입력해주세요"
                options={Guests}
                value={this.state.newOrderGuest}
                onChange={this.inputChangeGuest}
                clearable={false}
              />
              {_.isEmpty(this.state.newOrderGuest) ? (
                <div className="customer-phone">
                  <div>
                    <input
                      type="text"
                      maxLength="3"
                      className={this.state.newOrderPhone[0] ? 'has-value' : 'null-value'}
                      value={this.state.newOrderPhone[0]}
                      onChange={e => this.inputChangeUserPhone(e, 0)} ref="phone"
                      placeholder="010"
                    />
                    <i>-</i>
                    <input
                      type="text"
                      maxLength="4"
                      className={this.state.newOrderPhone[1] ? 'has-value' : 'null-value'}
                      value={this.state.newOrderPhone[1]}
                      onChange={e => this.inputChangeUserPhone(e, 1)}
                      placeholder="0000"
                    />
                    <i>-</i>
                    <input
                      type="text"
                      maxLength="4"
                      className={this.state.newOrderPhone[2] ? 'has-value' : 'null-value'}
                      value={this.state.newOrderPhone[2]}
                      onChange={e => this.inputChangeUserPhone(e, 2)} onKeyUp={this.autoFocus}
                      placeholder="0000"
                    />
                  </div>
                </div>
                )
                : ''
              }
            </div>
          </CSSTransitionGroup>
        );

        const newOrderStep2 = (
          <CSSTransitionGroup
            transitionName="service-input"
            transitionAppear
            transitionLeave={false}
            transitionEnter={false}
            transitionAppearTimeout={0}
          >
            <div className="service-input">
              <div className="radio-group">
                <input
                  type="radio"
                  id="user-mail"
                  name="user-sex"
                  value={1}
                  onChange={this.inputChangeUserSex}
                  defaultChecked={state.newOrderSex == 1}
                />
                <label htmlFor="user-mail">남성</label>
                <input
                  type="radio"
                  id="user-femail"
                  name="user-sex"
                  value={2}
                  onChange={this.inputChangeUserSex}
                  defaultChecked={state.newOrderSex == 2}
                />
                <label htmlFor="user-femail">여성</label>
              </div>
              <SearchService
                selectType="searchable"
                name="products"
                className="search-product"
                placeholder="상품명 검색"
                options={Services}
                value={this.state.newOrderService}
                onChange={this.inputChangeService}
              />
              <br />
              <Selectable
                value={this.state.newOrderStaff}
                selectType="selectable"
                name="epxerts"
                className="select-expert"
                placeholder="선택"
                options={Staffs}
                onChange={this.inputChangeStaff}
                searchable={false}
              />
            </div>
          </CSSTransitionGroup>
        );

        const ButtonElements = (
          <div>
            <button
              className="new-order-btn new-order-cancel left"
              onClick={this.props.newOrderCancel}
            >
              CANCEL
            </button>
            <button
              ref="next"
              className={`
                  new-order-btn new-order-submit right
                  ${
                    !_.isEmpty(state.newOrderGuest) ?
                      (
                        !_.isEmpty(state.newOrderGuest.guest_name) ||
                        state.newOrderGuestName
                      ) ? ' active'
                      : ''
                    : ''}
                `}
              disabled={ /* NEXT 버튼의 활성화 비활성화 여부를 결정합니다 */
                step === 1 ? (
                  (_.isEmpty(state.newOrderGuest) && _.isEmpty(state.newOrderGuestName))
                ) : step === 2 ? (
                  (_.isEmpty(state.newOrderService) || _.isEmpty(state.newOrderStaff))
                ) : true
              }
              onClick={this.nextStep}
            >
              <span>
                {step === 2 ? (
                    state.newOrderGuestName || (!_.isEmpty(state.newOrderGuest) && state.newOrderGuest.guest_name) ?
                      'NEXT'
                    : 'SKIP'
                  )
                  : 'NEXT'}
              </span>
              <i className="bullet" />
            </button>
          </div>
        )

        return (
          <div className={`new-order-wrap step-${this.state.newOrderStep} ${this.props.unknownStart || this.props.isEditEvent ? 'fixed' : 'hidden'}`}>
            <div className="viewstate order" style={{display: 'block'}}>
              <button onClick={() => { $('.viewstate.order').hide(); }}>X</button>
              <span>isModalConfirm</span> : {this.props.isModalConfirm ? 'true' : ''} <br />
              <span>newOrderStep</span> : {this.state.newOrderStep !== undefined ? this.state.newOrderStep : ''} <br />
              <span>newOrderStaff</span> : {this.state.newOrderStaff ? this.state.newOrderStaff.label : ''} <br />
              <span>newOrderService</span> : {this.state.newOrderService ? this.state.newOrderService.name : ''} <br />
              <span>newOrderGuestName</span> : {this.state.newOrderGuestName ? this.state.newOrderGuestName : ''} <br />
              <span>newOrderPhone</span> : {this.state.newOrderPhone.length ? this.state.newOrderPhone : ''} <br />
              <span>newOrderSex</span> : {this.state.newOrderSex} <br />
              <span>newOrderStart</span> : {this.state.newOrderStart ? this.state.newOrderStart : ''} <br />
              <span>newOrderEnd</span> : {this.state.newOrderEnd ? this.state.newOrderEnd : ''} <br />
              <span>newOrderTime</span> : {this.state.newOrderTime ? this.state.newOrderTime : ''} <br /><br />
              <span>고객유형: </span> {!_.isEmpty(this.state.newOrderGuest) ? '등록되어있는 고객' : '입력하지 않았거나 신규입력 고객'}<br />
              <span>newOrderGuest</span> :
                {!_.isEmpty(this.state.newOrderGuest) ? (
                  <div>
                    <i style={{ paddingRight: '7px' }}>id:</i><p>{this.state.newOrderGuest.id}</p>
                    <i style={{ paddingRight: '7px' }}>name:</i><p>{this.state.newOrderGuest.guest_name}</p>
                    <i style={{ paddingRight: '7px' }}>phone:</i><p>{this.state.newOrderGuest.guest_mobile}</p>
                    <i style={{ paddingRight: '7px' }}>class:</i><p>{this.state.newOrderGuest.guest_class}</p>
                  </div>
              ) : ''}
            </div>
            <CSSTransitionGroup
              transitionName="new-order"
              transitionAppear
              transitionEnter={false}
              transitionLeave={false}
              transitionAppearTimeout={200}
            >
              <div className="new-order">
                <div className="new-order-head">
                  <h2>{title}</h2>
                  <button className="new-order-close ir" onClick={this.props.newOrderCancel}>닫기</button>
                </div>
                <div className="new-order-body">
                  <div className="service-input-wrap">
                    <h3 className={step === 1 ? 'active' : ''}>
                      {step !== 1 && !_.isEmpty(this.state.newOrderGuest) ? (
                          <span className="step-index has-values">1</span>
                        ) : (
                          <span className="step-index">1</span>
                        )
                      }
                      <button
                        onClick={() => { this.changeStep(1); }}
                        disabled={false}
                      >
                        고객정보 입력
                      </button>
                    </h3>
                    <div className="service-input-inner">
                      { step === 1 ? newOrderStep1 : '' }
                    </div>
                  </div>
                  <div className="service-input-wrap">
                    <h3 className={step === 2 ? 'active' : ''}>
                      {step !== 2 && !_.isEmpty(this.state.newOrderService) && !_.isEmpty(this.state.newOrderStaff) ? (
                          <span className="step-index has-values">2</span>
                        ) : (
                          <span className="step-index">2</span>
                        )
                      }
                      <button
                        onClick={() => { this.changeStep(2); }}
                        disabled={false}
                      >
                        서비스 선택
                      </button>
                    </h3>
                    <div className="service-input-inner">
                      { step === 2 ? newOrderStep2 : '' }
                    </div>
                  </div>
                </div>
                <div className="new-order-foot">
                  {ButtonElements}
                </div>
              </div>
            </CSSTransitionGroup>
          </div>
        );
    }
}

NewOrder.propTypes = {
    beforeInitConfirmRenderNewSchedule: PropTypes.func,
    setCalendarHeight: PropTypes.func,
    newOrderCancel: PropTypes.func,
    changeView: PropTypes.func,
    backToOrder: PropTypes.func,
    renderNewScheduleUnknownStart: PropTypes.func,
    unknownStart: PropTypes.bool,
    isEditEvent: PropTypes.bool,
    isRequestReservation: PropTypes.bool,
    willEditEventObject: PropTypes.object,
    isModalConfirm: PropTypes.bool,
    isRenderConfirm: PropTypes.bool,
    selectedDate: PropTypes.string,
    selectedStaff: PropTypes.object
};

NewOrder.defaultProps = {
    beforeInitConfirmRenderNewSchedule() { Functions.printWarring('beforeInitConfirmRenderNewSchedule'); },
    setCalendarHeight() { Functions.printWarring('setCalendarHeight'); },
    newOrderCancel() { Functions.printWarring('newOrderCancel'); },
    changeView() { Functions.printWarring('changeView'); },
    backToOrder() { Functions.printWarring('backToOrder'); },
    renderNewScheduleUnknownStart() { Functions.printWarring('renderNewScheduleUnknownStart'); },
    unknownStart: false,
    isEditEvent: false,
    isRequestReservation: false,
    willEditEventObject: {},
    isModalConfirm: false,
    isRenderConfirm: false,
};

const mapStateToProps = state => ({
    Step: state.newOrderConfig.step,
    GuestName: state.newOrderConfig.guestName,
    Sex: state.newOrderConfig.sex,
    Phone: state.newOrderConfig.phone,
    Service: state.newOrderConfig.service,
    Staff: state.newOrderConfig.staff,
    Guest: state.newOrderConfig.guest,
    Start: state.newOrderConfig.start,
    End: state.newOrderConfig.end,
    Time: state.newOrderConfig.time
})

const mapDispatchToProps = () => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(NewOrder);
