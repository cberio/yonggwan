import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import update from 'react-addons-update';
import { SearchCustomer, SearchProduct, Selectable } from '../select';
import Experts from '../../../data/experts.json';
import Products from '../../../data/products.json';
import Customers from '../../../data/customers.json';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Images from '../../../require/images';
import * as Functions from '../../../js/common';
import '../../../css/customerCard.css';


export default class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrderStep : 1,
      newOrderUserName : undefined,
      newOrderUserSex : undefined,
      newOrderUserPhone: ["","",""],
      newOrderProduct : undefined,
      newOrderClassName: undefined,
      newOrderExpert : this.props.selectedExpert,
      newOrderMember : {},
      newOrderStart : this.props.selectedDate,
      newOrderEnd : undefined,
      newOrderTime: undefined
    };
    this.documentBinding = this.documentBinding.bind(this);
    this.initEditEvent = this.initEditEvent.bind(this);
    this.insertComponent = this.insertComponent.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.autoFocus = this.autoFocus.bind(this);
    this.inputChangeExpert = this.inputChangeExpert.bind(this);
    this.inputChangeProduct = this.inputChangeProduct.bind(this);
    this.inputChangeCustomer = this.inputChangeCustomer.bind(this);
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
      newOrderProduct : e.product,
      newOrderProductFullObject : this.getProductObj(e.product),
      newOrderClassName: this.getProductColor(e.product),
      newOrderExpert : this.getExpertObj(e.resourceId),
      newOrderMember : {
        name: e.name,
        phone: e.phone,
        kakao: e.kakao,
        line: e.line,
        rating: e.rating,
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

  setNewOrderExpert (expert) {
    this.setState({ newOrderExpert: expert });
  }

  getExpertObj (id) {
    for (let i = 0; i < Experts.length; i++) {
      if (Experts[i].id === id) {
        return Experts[i];
      }
    }
  }

  getEventObj () {
    return this.state;
  }

  getProductObj (productName) {
    for (let i = 0; i < Products.length; i++) {
      if (productName === Products[i].product) {
        return Products[i];
        break;
      }
    }
  }

  // Product 의 item color를 리턴함
  getProductColor (product) {
    for (let i = 0; i < Products.length; i++) {
      if (product === Products[i].product) {
        return Products[i].itemColor;
        break;
      }
    }
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
        if (this.props.isNotAutoSelectTime) {
          this.props.createEvent(true, this.state);
        } else {
          this.props.step_confirm(true, this.state);
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
    let phone = this.state.newOrderUserPhone;
    if (phone[0].length >= 3 && phone[1].length >= 4 && e.target.value.length >= 4) this.refs.next.focus();
  }

  inputChangeProduct (e)   {
    let endTime = moment(this.state.newOrderStart).add(e.serviceTime, 'minute');
        endTime = endTime.format("YYYY-MM-DDTHH:mm:ss");
    this.setState({
      newOrderProductFullObject: e,
      newOrderProduct: e.label,
      newOrderClassName: e.itemColor,
      newOrderTime: e.serviceTime,
      newOrderEnd: endTime
    });
  }
  inputChangeExpert (obj) {
    this.setState({
      newOrderExpert : obj
    });
  }
  inputChangeUserPhone (e, idx) {
    this.setState({
      newOrderUserPhone: update(
        this.state.newOrderUserPhone, {
        [idx]: { $set: e.target.value }
      })
    });
  }
  inputChangeCustomer (e)  {
    if (e === null) {
      // clearable
      this.setState({newOrderMember: -1, newOrderUserName: undefined});
    } else {
      // set values
      this.setState({ newOrderMember: e, newOrderUserName: e.value });
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
  inputChangeUserSex (e)   { this.setState({ newOrderUserSex : e.target.value }); }
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
            value="mail"
            onChange={this.inputChangeUserSex}
            defaultChecked={state.newOrderUserSex === 'mail' ? true : false}
          />
          <label htmlFor="user-mail">남성</label>
          <input
            type="radio"
            id="user-femail"
            name="user-sex"
            value="femail"
            onChange={this.inputChangeUserSex}
            defaultChecked={state.newOrderUserSex === 'femail' ? true : false}
          />
          <label htmlFor="user-femail">여성</label>
        </div>
        <SearchProduct
          selectType="searchable"
          name="products"
          className="search-product"
          placeholder="상품명 검색"
          options={Products}
          value={this.state.newOrderProductFullObject}
          onChange={this.inputChangeProduct}
        />
        <br />
        <Selectable
          value={this.props.selectedExpert}
          selectType="selectable"
          name="epxerts"
          className="select-expert"
          placeholder="선택"
          options={Experts}
          onChange={this.inputChangeExpert}
          searchable={false}
        />
      </div>
    );
    const newOrderStep_2 = (
      <div className="service-input">
        <SearchCustomer
          name="customer"
          autoFocus={true}
          className="search-customer"
          placeholder="고객님의 이름을 입력해주세요"
          options={Customers}
          value={this.state.newOrderMember.name}
          onChange={this.inputChangeCustomer}
        />
        {
          this.state.newOrderMember.name ? (
            <div className="user-card-basic clearfix">
              <div className="info">
                <span className="picture">
                  <span className="thumbnail">{state.newOrderMember.picture && <img src={state.newOrderMember.picture} alt={state.newOrderMember.name} />}</span>
                  {state.newOrderMember.rating ? <i className={`rating ${state.newOrderMember.rating.toLowerCase()}`}>{state.newOrderMember.rating}</i> : undefined }
                </span>
                <span className="name">{state.newOrderMember.name}</span>
                <span className="phone">{state.newOrderMember.phone && (
                    state.newOrderMember.phone[0] + '-' +
                    state.newOrderMember.phone[1] + '-' +
                    state.newOrderMember.phone[2]
                  )}
                </span>
              </div>
              <div className="util">
                <div className="ui">
                  <button className="btn-edit" onClick="">수정</button>
                </div>
                <div className="sns">
                  {state.newOrderMember.phone ? <a href={state.newOrderMember.phone} target="_blank"><img src={Images.IMG_mms} alt="MMS" title="MMS"/></a> : undefined }
                  {state.newOrderMember.kakao ? <a href={state.newOrderMember.kakao} target="_blank"><img src={Images.IMG_kakao} alt="Kakao talk" title="카카오톡"/></a> : undefined }
                  {state.newOrderMember.line ? <a href={state.newOrderMember.line} target="_blank"><img src={Images.IMG_line} alt="Line" title="라인"/></a> : undefined }
                </div>
              </div>
            </div>
          ) : (
            <div className="customer-phone">
              {
                !this.state.newOrderMember.phone ? (
                  <div>
                    <input type="text" maxLength="3" value={this.state.newOrderUserPhone[0]} onChange={ (e) => this.inputChangeUserPhone(e, 0)} ref="phone"/><i>-</i>
                    <input type="text" maxLength="4" value={this.state.newOrderUserPhone[1]} onChange={ (e) => this.inputChangeUserPhone(e, 1)} /><i>-</i>
                    <input type="text" maxLength="4" value={this.state.newOrderUserPhone[2]} onChange={ (e) => this.inputChangeUserPhone(e, 2)} onKeyUp={this.autoFocus} />
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
        <div className={`new-order-wrap step-${this.state.newOrderStep} ${this.props.isNotAutoSelectTime || this.props.isEditEvent ? '' : 'hidden'}`}>
          <div className="viewview order">
            <button onClick={()=> {$('.viewview.order').hide() }}>X</button>
            <span>isModalConfirm</span> : {this.props.isModalConfirm ? 'true' : ""} <br />
            <span>newOrderStep</span> : {this.state.newOrderStep !== undefined ? this.state.newOrderStep : ""} <br />
            <span>newOrderExpert</span> : {this.state.newOrderExpert ? this.state.newOrderExpert.title : ""} <br />
            <span>newOrderProduct</span> : {this.state.newOrderProduct ? this.state.newOrderProduct : ""} <br />
            <span>newOrderClassName</span> : {this.state.newOrderClassName ? this.state.newOrderClassName : ""} <br />
            <span>newOrderUserName</span> : {this.state.newOrderUserName ? this.state.newOrderUserName : ""} <br />
            <span>newOrderUserPhone</span> : {this.state.newOrderUserPhone.length ? this.state.newOrderUserPhone : ''} <br />
            <span>newOrderUserSex</span> : {this.state.newOrderUserSex ? this.state.newOrderUserSex : ""} <br />
            <span>newOrderStart</span> : {this.state.newOrderStart ? this.state.newOrderStart : ""} <br />
            <span>newOrderEnd</span> : {this.state.newOrderEnd ? this.state.newOrderEnd : ""} <br />
            <span>newOrderTime</span> : {this.state.newOrderTime ? this.state.newOrderTime : ""} <br />
            <span>newOrderMember</span>  <div style={{margin: '0 -5px -5px'}}>(기존고객일경우 고객정보) : <br />
                                            <i style={{paddingRight: '7px'}}>name:</i><p>{this.state.newOrderMember.name}</p>
                                            <i style={{paddingRight: '7px'}}>phone:</i><p>{this.state.newOrderMember.phone}</p>
                                            <i style={{paddingRight: '7px'}}>kako:</i><p>{this.state.newOrderMember.kakao}</p>
                                            <i style={{paddingRight: '7px'}}>line:</i><p>{this.state.newOrderMember.line}</p>
                                            <i style={{paddingRight: '7px'}}>rating:</i><p>{this.state.newOrderMember.rating}</p>
                                            <i style={{paddingRight: '7px'}}>picture:</i><p>{this.state.newOrderMember.picture}</p>
                                          </div>
          </div>
          {
            (step > 2) && (!this.props.isNotAutoSelectTime) && (!this.props.isEditEvent) ? '' : (
              <div className="new-order-navigator">
                <div className="new-order-navigator-inner">
                  <h2>{title}</h2>
                  <ol className="navigator">
                    <li className={step === 1 ? 'active': undefined}>
                      <button
                        onClick={ () => {this.changeStep(1)} }
                        disabled={false}
                      >
                        <i>1</i>.서비스선택
                      </button>
                    </li>
                    <li className={step === 2 ? 'active': undefined}>
                      <button
                        onClick={ () => {this.changeStep(2)} }
                        disabled={step < 2 ? true : false}
                      >
                        <i>2</i>.고객정보 입력
                      </button>
                      </li>
                    <li className={step === 3 ? 'active': undefined}>
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
                    { state.newOrderExpert.title && (
                      <div className="has-expert">
                        <div>
                          <span className="thumbnail">
                            {state.newOrderExpert.picture && <img src={state.newOrderExpert.picture} alt={state.newOrderExpert.title} />}
                            </span>
                          <span className="label">{state.newOrderExpert.title}</span>
                        </div>
                      </div>
                    ) }
                    <div className={`user-card-service${state.newOrderProduct ? ' '+ Functions.getProductColor(state.newOrderProduct, Products): ''}`}>
                      <div className="service-info">
                        <div className="lt">
                          <p className="product">
                            <button className="inner" onClick={ () => {this.setState({newOrderStep: 1})} }>
                              {this.state.newOrderProduct ? (
                                <p>
                                  <span className="service">{this.state.newOrderProduct}</span>
                                  <span className="time">{Functions.minuteToTime(this.state.newOrderTime)}</span>
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
                              { (this.state.newOrderUserName || this.state.newOrderMember.name) ? (this.state.newOrderUserName || this.state.newOrderMember.name) : '고객정보 입력'}
                            </p>
                            <p className="picture">
                              <span className="thumbnail">
                                {this.state.newOrderMember.picture ? <img src={this.state.newOrderMember.picture} alt={this.state.newOrderMember.name} /> : null}
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
                        className={`new-order-submit ${(state.newOrderMember.name||state.newOrderUserName)? 'has-customer' :''}`}
                        disabled={ /* NEXT 버튼의 활성화 비활성화 여부를 결정합니다 */
                          step === 1 ? (
                            /* [ 스텝 1 : "서비스선택" 단계 ] */
                            (state.newOrderProduct && state.newOrderExpert.title) ? false : true ) : (
                            step === 2 ? ( false /* [ 스텝 2 : "고객정보입력" 단계 ] */ ) : (
                            step === 3 ? ( false /* [ 스텝 3 : "예약시간선택" 단계 ] */ ) : (
                                            true /* [ 기본 (해당없음) ] */
                          )))
                        }
                        onClick={this.nextStep}>
                        <span>
                          {step === 2 ? (state.newOrderUserName || state.newOrderMember.name ? 'NEXT' : 'SKIP') : 'NEXT'}
                        </span>
                        <i className="bullet"></i>
                      </button>
                    </div>
                  </div>
                </ReactCSSTransitionGroup>
              </div>
            ) : this.props.isNotAutoSelectTime || this.props.isEditEvent ? (
              <div>
                {state.newOrderExpert.title && (
                  <div className="has-expert">
                    <div>
                      <span className="thumbnail">
                        {state.newOrderExpert.picture && <img src={state.newOrderExpert.picture} alt={state.newOrderExpert.title} />}
                        </span>
                      <span className="label">{state.newOrderExpert.title}</span>
                    </div>
                  </div>
                )}
                <div className={`new-order-card ${this.props.isNotAutoSelectTime ? 'new-order-render' : this.props.isEditEvent ? 'new-order-edit' : ''} `}>
                  <div className={`user-card-service${state.newOrderProduct ? ' '+ Functions.getProductColor(state.newOrderProduct, Products): ''}`}>
                    <div className="service-info">
                      <div className="lt">
                        <p className="product">
                          <button className="inner" onClick={ () => {this.setState({newOrderStep: 1})} }>
                            <span className="service">{this.state.newOrderProduct}</span>
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
                              {this.state.newOrderMember.picture ? <img src={this.state.newOrderMember.picture} alt={this.state.newOrderUserName} /> : ''}
                            </span>
                            {this.state.newOrderMember.rating ? <span className={`rating ${this.state.newOrderMember.rating.toLowerCase()}`}>{this.state.newOrderMember.rating}</span> : ''}
                          </p>
                          <p className="user">
                            <span>{this.state.newOrderUserName ? this.state.newOrderUserName : this.state.newOrderMember.name}</span>
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
