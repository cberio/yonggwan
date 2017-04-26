import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import update from 'react-addons-update';
import { SearchGuest, SearchService, Selectable } from '../select';
import Staffs from '../../../data/staffs';
import Services from '../../../data/services';
import Guests from '../../../data/guests';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Images from '../../../require/images';
import * as Functions from '../../../js/common';
import '../../../css/customerCard.css';


export default class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrderStep : 1, //int 1-3
      newOrderGuestName : undefined, //str
      newOrderSex : 0,// int 0-2
      newOrderPhone: ["","",""], //array
      newOrderService : undefined, //object (service object)
      newOrderStaff : this.props.selectedStaff, //object
      newOrderGuest : {},  //object
      newOrderStart : this.props.selectedDate, // moment format
      newOrderEnd : undefined, // moment format
      newOrderTime: undefined // HH:mm
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

  documentBinding () {
    let component = this;
    // ESC key 입력시 닫기
    $(document).bind('keydown', function(e){
        if (e.which === 27 && !component.props.isModalConfirm && !component.props.isRenderConfirm) {
          if (component.state.newOrderStep < 3) {
            component.props.newOrderCancel();
          } else {
            component.backToStep(2);
            component.props.backToOrder();
          }
          $(document).unbind('keydown');
        }
    });
  }

  initEditEvent (e) {
    this.setState({
      newOrderStep: 3,
      newOrderService : Functions.getService(e.service.code),
      newOrderStaff : Functions.getStaff(e.resourceId),
      newOrderGuest : {
        name: e.guest_name,
        phone: e.guest_mobile,
        kakao: e.kakao,
        line: e.line,
        rating: e.guest_class,
        picture: e.picture
      },
      newOrderStart : moment(e.start).format(),
      newOrderEnd : moment(e.end).format(),
      newOrderTime: Functions.millisecondsToMinute(moment(e.end).diff(moment(e.start))),
    });
    // step-3 으로 바로 이동하기때문에 캘린더 Height를 조절합니다
    this.props.setCalendarHeight(3);
  }

  insertComponent () {
    $('.new-order-wrap-container').insertAfter('.fc-toolbar.fc-header-toolbar');
  }

  setNewOrderStaff (staff) {
    this.setState({ newOrderStaff: staff });
  }

  getScheduleObj () {
    return this.state;
  }

  backToStep (step) {
    this.setState({ newOrderStep : step });
  }

  nextStep () {
    let component = this;
    switch (this.state.newOrderStep) {
      case 1 :
        this.setState({ newOrderStep : 2 });
        break;
      case 2 :
        if (this.props.unknownStart) {
          this.props.renderNewScheduleUnknownStart(true, this.state);
        } else {
          this.props.beforeInitConfirmRenderNewSchedule(true, this.state);
        }
        this.setState({ newOrderStep : 3 });
        break;
      case 3 :
        this.props.modalConfirm(true);
        break;
      default:
        break;
    }
    setTimeout(function(){
      component.props.setCalendarHeight(component.state.newOrderStep);
    },0);
  }

  changeStep (step) {
    this.setState({
      newOrderStep : step
    });
    // 렌더링을 한 후에 이전단계의 step 으로 가는 경우
    //if (this.state.newOrderStep === 3 && step < 3) {
    //}
  }

  autoFocus (e) {
    let phone = this.state.newOrderPhone;
    if (phone[0].length >= 3 && phone[1].length >= 4 && e.target.value.length >= 4) this.refs.next.focus();
  }

  inputChangeService (e)   {
    let serviceTime = moment.duration(e.time).asMinutes(); // mm
    let endTime = moment(this.state.newOrderStart).add(serviceTime, 'minutes');
    this.setState({
      newOrderService: e,
      newOrderTime: e.time,
      newOrderEnd: endTime.format()
    });
  }
  inputChangeStaff (obj) {
    this.setState({
      newOrderStaff : obj
    });
  }
  inputChangeUserPhone (e, idx) {
    this.setState({
      newOrderPhone: update(
        this.state.newOrderPhone, {
        [idx]: { $set: e.target.value }
      })
    });
  }
  inputChangeGuest (e)  {
    if (e === null) {
      // clearable
      this.setState({newOrderGuest: -1, newOrderGuestName: undefined});
    } else {
      // set values
      this.setState({ newOrderGuest: e, newOrderGuestName: e.value });
      // ↓↓ focusing ↓↓
      // focus__1. customer의 phone데이터가 있는경우 NEXT 버튼 포커스
      if (e.phone) {
        this.refs.next.focus();
      // focus__2. 기존고객이지만 phone데이터가 없거나 신규고객을 입력한 경우, 그리고 input phone element가 rendering 된경우
      } else if (this.refs.phone) {
        this.refs.phone.focus();
      }
    }
  }
  inputChangeUserSex (e)   { this.setState({ newOrderSex : e.target.value }); }
  inputChangeOrderStart (e){ this.setState({ newOrderStart : e.target.value }); }
  inputChangeOrderEnd (e)  { this.setState({ newOrderEnd : e.target.value }); }


  componentWillUnmount () {
    this.props.setCalendarHeight(true);
  }

  componentDidMount () {
    // Window event binding
    this.documentBinding();
    // init insert NewOrder component
    this.insertComponent();
    // 예약수정, 예약요청확인 인경우
    if (this.props.isEditEvent)
      this.initEditEvent(this.props.willEditEventObject);
  }

  render () {
    const state = this.state;
    const step = this.state.newOrderStep;
    const title = this.props.isRequestReservation ? '예약요청 확인' : this.props.isEditEvent ? '예약변경' : '예약생성';

    const newOrderStep_1 = (
      <div className="service-input">
        <div className="radio-group">
          <input
            type="radio"
            id="user-mail"
            name="user-sex"
            value={1}
            onChange={this.inputChangeUserSex}
            defaultChecked={state.newOrderSex === 1 ? true : false}
          />
          <label htmlFor="user-mail">남성</label>
          <input
            type="radio"
            id="user-femail"
            name="user-sex"
            value={2}
            onChange={this.inputChangeUserSex}
            defaultChecked={state.newOrderSex === 2 ? true : false}
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
          value={this.props.selectedStaff}
          selectType="selectable"
          name="epxerts"
          className="select-expert"
          placeholder="선택"
          options={Staffs}
          onChange={this.inputChangeStaff}
          searchable={false}
        />
      </div>
    );
    const newOrderStep_2 = (
      <div className="service-input">
        <SearchGuest
          name="customer"
          autoFocus={true}
          className="search-customer"
          placeholder="고객님의 이름을 입력해주세요"
          options={Guests}
          value={this.state.newOrderGuest.guest_name}
          onChange={this.inputChangeGuest}
        />
        {
          this.state.newOrderGuest.guest_name ? (
            <div className="user-card-basic clearfix">
              <div className="info">
                <span className="picture">
                  <span className="thumbnail">{state.newOrderGuest.picture && <img src={state.newOrderGuest.picture} alt={state.newOrderGuest.guest_name} />}</span>
                  {state.newOrderGuest.rating ? <i className={`rating ${state.newOrderGuest.rating.toLowerCase()}`}>{state.newOrderGuest.rating}</i> : undefined }
                </span>
                <span className="user">
                  <span className="name">{state.newOrderGuest.guest_name}</span>
                  <span className="phone">{state.newOrderGuest.guest_mobile && Functions.getPhoneStr(state.newOrderGuest.guest_mobile)}
                </span>
                </span>
              </div>
              <div className="util">
                <div className="ui">
                  <button className="btn-edit" onClick="">수정</button>
                </div>
                <div className="sns">
                  {state.newOrderGuest.guest_mobile ? <a href={state.newOrderGuest.guest_mobile} target="_blank"><img src={Images.IMG_mms} alt="MMS" title="MMS"/></a> : undefined }
                  {state.newOrderGuest.kakao ? <a href={state.newOrderGuest.kakao} target="_blank"><img src={Images.IMG_kakao} alt="Kakao talk" title="카카오톡"/></a> : undefined }
                  {state.newOrderGuest.line ? <a href={state.newOrderGuest.line} target="_blank"><img src={Images.IMG_line} alt="Line" title="라인"/></a> : undefined }
                </div>
              </div>
            </div>
          ) : (
            <div className="customer-phone">
              {
                !this.state.newOrderGuest.guest_mobile ? (
                  <div>
                    <input type="text" maxLength="3" value={this.state.newOrderPhone[0]} onChange={ (e) => this.inputChangeUserPhone(e, 0)} ref="phone"/><i>-</i>
                    <input type="text" maxLength="4" value={this.state.newOrderPhone[1]} onChange={ (e) => this.inputChangeUserPhone(e, 1)} /><i>-</i>
                    <input type="text" maxLength="4" value={this.state.newOrderPhone[2]} onChange={ (e) => this.inputChangeUserPhone(e, 2)} onKeyUp={this.autoFocus} />
                  </div>
                ) : ""
              }
            </div>
          )
        }
      </div>
    )

    return (
      <div className="new-order-wrap-container">
        <div className={`new-order-wrap step-${this.state.newOrderStep} ${this.props.unknownStart || this.props.isEditEvent ? '' : 'hidden'}`}>
          <div className="viewview order">
            <button onClick={()=> {$('.viewview.order').hide() }}>X</button>
            <span>isModalConfirm</span> : {this.props.isModalConfirm ? 'true' : ""} <br />
            <span>newOrderStep</span> : {this.state.newOrderStep !== undefined ? this.state.newOrderStep : ""} <br />
            <span>newOrderStaff</span> : {this.state.newOrderStaff ? this.state.newOrderStaff.label : ""} <br />
            <span>newOrderService</span> : {this.state.newOrderService ? this.state.newOrderService.name : ""} <br />
            <span>newOrderGuestName</span> : {this.state.newOrderGuestName ? this.state.newOrderGuestName : ""} <br />
            <span>newOrderPhone</span> : {this.state.newOrderPhone.length ? this.state.newOrderPhone : ''} <br />
            <span>newOrderSex</span> : {this.state.newOrderSex} <br />
            <span>newOrderStart</span> : {this.state.newOrderStart ? this.state.newOrderStart : ""} <br />
            <span>newOrderEnd</span> : {this.state.newOrderEnd ? this.state.newOrderEnd : ""} <br />
            <span>newOrderTime</span> : {this.state.newOrderTime ? this.state.newOrderTime : ""} <br />
            <span>newOrderGuest</span>  <div style={{margin: '0 -5px -5px'}}>(기존고객일경우 고객정보) : <br />
                                            <i style={{paddingRight: '7px'}}>name:</i><p>{this.state.newOrderGuest.guest_name}</p>
                                            <i style={{paddingRight: '7px'}}>phone:</i><p>{this.state.newOrderGuest.guest_mobile}</p>
                                            <i style={{paddingRight: '7px'}}>kako:</i><p>{this.state.newOrderGuest.kakao}</p>
                                            <i style={{paddingRight: '7px'}}>line:</i><p>{this.state.newOrderGuest.line}</p>
                                            <i style={{paddingRight: '7px'}}>rating:</i><p>{this.state.newOrderGuest.rating}</p>
                                            <i style={{paddingRight: '7px'}}>picture:</i><p>{this.state.newOrderGuest.picture}</p>
                                          </div>
          </div>
          {
            (step > 2) && (!this.props.unknownStart) && (!this.props.isEditEvent) ? '' : (
              <div className="new-order-navigator">
                <div className="new-order-navigator-inner">
                  <h2>{title}</h2>
                  <ol className="navigator">
                    <li className={step === 1 ? 'active': ''}>
                      <button
                        onClick={ () => {this.changeStep(1)} }
                        disabled={false}
                      >
                        <i>1</i>.서비스선택
                      </button>
                    </li>
                    <li className={step === 2 ? 'active': ''}>
                      <button
                        onClick={ () => {this.changeStep(2)} }
                        disabled={step < 2 ? true : false}
                      >
                        <i>2</i>.고객정보 입력
                      </button>
                      </li>
                    <li className={step === 3 ? 'active': ''}>
                      <button
                        onClick={ () => {this.changeStep(3)} }
                        disabled={step < 3 ? true : false}
                      >
                        <i>3</i>.예약시간 선택
                      </button>
                    </li>
                  </ol>
                  <button className="new-order-close ir" onClick={this.props.newOrderCancel}>닫기</button>
                </div>
              </div>
            )
          }
          {
            step < 3 ? (
              <div className="new-order">
                <ReactCSSTransitionGroup
                    transitionName="new-order"
                    transitionEnterTimeout={-1}
                    transitionLeaveTimeout={-1}
                    transitionAppear={true}
                    transitionAppearTimeout={200}>
                  <div className="new-order-inner">
                    { state.newOrderStaff.id && (
                      <div className="has-expert">
                        <div>
                          <span className="thumbnail">
                            {state.newOrderStaff.picture && <img src={state.newOrderStaff.picture} alt={state.newOrderStaff.nickname} />}
                            </span>
                          <span className="label">{state.newOrderStaff.nickname}</span>
                        </div>
                      </div>
                    ) }
                    <div className={`user-card-service${state.newOrderService ? ' '+ state.newOrderService.color: ''}`}>
                      <div className="service-info">
                        <div className="lt">
                          <p className="product">
                            <button className="inner" onClick={ () => {this.setState({newOrderStep: 1})} }>
                              {this.state.newOrderService ? (
                                <p>
                                  <span className="service">{this.state.newOrderService.name}</span>
                                  {/*<span className="time">{Functions.minuteToTime(this.state.newOrderTime)}</span>*/}
                                  <span className="time">{this.state.newOrderTime}분</span>
                                </p>
                              ) : (
                                '서비스 입력'
                            )}
                            </button>
                          </p>
                          <p className="service-time">
                            <button onClick={ () => {this.setState({newOrderStep:1})} }>
                              {
                                this.state.newOrderStart ? (
                                  this.state.newOrderEnd ? (moment(this.state.newOrderStart).format('HH:mm') + ' - ' + moment(this.state.newOrderEnd).format('HH:mm')) : (
                                    moment(this.state.newOrderStart).format('HH:mm') + ' - 00:00'
                                  )
                                ) : '00:00 - 00:00'
                              }
                            </button>
                          </p>
                        </div>
                        <div className="rt">
                          <button disabled={step < 2 ? true : false} onClick={ () => {this.setState({newOrderStep:2})} }>
                            <p className="user">
                              { (this.state.newOrderGuestName || this.state.newOrderGuest.guest_name) ? (this.state.newOrderGuestName || this.state.newOrderGuest.guest_name) : '고객정보 입력'}
                            </p>
                            <p className="picture">
                              <span className="thumbnail">
                                {this.state.newOrderGuest.picture ? <img src={this.state.newOrderGuest.picture} alt={this.state.newOrderGuest.guest_name} /> : null}
                              </span>
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="service-input-wrap">
                      { this.state.newOrderStep === 1 ?  newOrderStep_1 : '' }
                      { this.state.newOrderStep === 2 ?  newOrderStep_2 : '' }
                    </div>
                    <div className="complete">
                      <button
                        ref="next"
                        className={`new-order-submit ${(state.newOrderGuest.guest_name||state.newOrderGuestName)? 'has-customer' :''}`}
                        disabled={ /* NEXT 버튼의 활성화 비활성화 여부를 결정합니다 */
                          step === 1 ? (
                            /* [ 스텝 1 : "서비스선택" 단계 ] */
                            (state.newOrderService && state.newOrderStaff.label) ? false : true ) : (
                            step === 2 ? ( false /* [ 스텝 2 : "고객정보입력" 단계 ] */ ) : (
                            step === 3 ? ( false /* [ 스텝 3 : "예약시간선택" 단계 ] */ ) : (
                                            true /* [ 기본 (해당없음) ] */
                          )))
                        }
                        onClick={this.nextStep}>
                        <span>
                          {step === 2 ? (state.newOrderGuestName || state.newOrderGuest.guest_name ? 'NEXT' : 'SKIP') : 'NEXT'}
                        </span>
                        <i className="bullet"></i>
                      </button>
                    </div>
                  </div>
                </ReactCSSTransitionGroup>
              </div>
            ) : this.props.unknownStart || this.props.isEditEvent ? (
              <div>
                {state.newOrderStaff.label && (
                  <div className="has-expert">
                    <div>
                      <span className="thumbnail">
                        {state.newOrderStaff.picture && <img src={state.newOrderStaff.picture} alt={state.newOrderStaff.label} />}
                        </span>
                      <span className="label">{state.newOrderStaff.label}</span>
                    </div>
                  </div>
                )}
                <div className={`new-order-card ${this.props.unknownStart ? 'new-order-render' : this.props.isEditEvent ? 'new-order-edit' : ''} `}>
                  <div className={`user-card-service${state.newOrderService ? ' '+ state.newOrderService.color: ''}`}>
                    <div className="service-info">
                      <div className="lt">
                        <p className="product">
                          <button className="inner" onClick={ () => {this.setState({newOrderStep: 1})} }>
                            <span className="service">{this.state.newOrderService.name}</span>
                            <span className="time">{Functions.minuteToTime(this.state.newOrderTime)}</span>
                          </button>
                        </p>
                        <p className="service-time">
                          <button onClick={ () => {this.setState({newOrderStep:1})} }>
                            { this.props.isEditEvent ? (
                                <span>{moment(this.state.newOrderStart).format('HH:mm')} - {moment(this.state.newOrderEnd).format('HH:mm')}</span>
                              ) : (
                                <span>00:00 - 00:00</span>
                              )
                            }
                          </button>
                        </p>
                      </div>
                      <div className="rt">
                        <button disabled={step < 2 ? true : false} onClick={ () => {this.setState({newOrderStep:2})} }>
                          <p className="picture">
                            <span className="thumbnail">
                              {this.state.newOrderGuest.picture ? <img src={this.state.newOrderGuest.picture} alt={this.state.newOrderGuestName} /> : ''}
                            </span>
                            {this.state.newOrderGuest.rating ? <span className={`rating ${this.state.newOrderGuest.rating.toLowerCase()}`}>{this.state.newOrderGuest.rating}</span> : ''}
                          </p>
                          <p className="user">
                            <span>{this.state.newOrderGuestName ? this.state.newOrderGuestName : this.state.newOrderGuest.guest_name}</span>
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ) : ''
          }
        </div>
      </div>
    );
  }
}
