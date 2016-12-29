import React, { Component } from 'react';
import $ from 'jquery';
import Selectbox from '../select';
import Experts from '../../../data/experts.json';
import Products from '../../../data/products.json';
import Customers from '../../../data/customers.json';
import ModalConfirm from '../modal/modalConfirm';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrderStep : 0,
      newOrderUserSex : undefined,
      newOrderProduct : undefined,
      newOrderExpert : undefined,
      newOrderUserName : undefined,
      newOrderPhone: undefined,
      newOrderStart : this.props.selectedDate,
      newOrderEnd : undefined,
      newOrderComment : undefined
    };
    this.nextStep = this.nextStep.bind(this);
    this.inputChangeExpert = this.inputChangeExpert.bind(this);
    this.inputChangeProduct = this.inputChangeProduct.bind(this);
    this.inputChangeUserName = this.inputChangeUserName.bind(this);
    this.inputChangeUserSex = this.inputChangeUserSex.bind(this);
    this.inputChangeOrderStart = this.inputChangeOrderStart.bind(this);
    this.inputChangeOrderEnd = this.inputChangeOrderEnd.bind(this);
    this.inputChangeComment = this.inputChangeComment.bind(this);
  }

  nextStep () {
    switch (this.state.newOrderStep) {
      case 0 :
        this.setState({
          newOrderStep : this.state.newOrderStep +1
        });
        break;
      case 1 :
        this.setState({ newOrderStep : this.state.newOrderStep +1 });
        break;
      case 2 :
        this.setState({ newOrderStep : this.state.newOrderStep +1 });
        break;
      default:
        break;
    };
  }

  inputChangeProduct (e)   { this.setState({ newOrderProduct: e.label }); }
  inputChangeExpert (e)    { this.setState({ newOrderExpert : e.label }); }
  inputChangeUserName (e)  { this.setState({ newOrderUserName : e.label }); }
  inputChangeUserSex (e)   { this.setState({ newOrderUserSex : e.target.value }); }
  inputChangeOrderStart (e){ this.setState({ newOrderStart : e.target.value }); }
  inputChangeOrderEnd (e)  { this.setState({ newOrderEnd : e.target.value }); }
  inputChangeComment (e)   { this.setState({ newOrderComment : e.target.value }); }// 신규생성 인풋값 초기화

  render () {
    const state = this.state;
    const step = this.state.newOrderStep;
    const nextButton = (
      <div className="complete">
        <button
          className="new-order-submit"
          disabled={
            /* NEXT 버튼의 활성화 비활성화 여부를 결정합니다 */
            step === 0 ? (
              /* [ 스텝 1 : "서비스선택" 단계 ] */
              (state.newOrderProduct) || (state.newOrderSex) ? false : true
            ) : (
              step === 1 ? (
                /* [ 스텝 2 : "시술자선택" 단계 ] */
                (state.newOrderExpert) ? false : true
              ) : (
                step === 2 ? (
                  /* [ 스텝 3 : "고객정보입력" 단계 ] */
                  false
                ) : (
                  step === 3 ? (
                    /* [ 스텝 4 : "예약시간선택" 단계 ] */
                    false
                  ) : (
                    /* [ 기본 (해당없음) ] */
                    true
                  )
                )
              )
            )
          }
          onClick={this.nextStep}>
            <span>
              {step === 2 ? (state.newOrderUserName ? 'NEXT' : 'SKIP') : 'NEXT'}
            </span>
            <i className="bullet"></i>
        </button>
      </div>
    );

    const newOrderStep_1 = (
      <div className="service-input">
        <div className="radio-group">
          <input type="radio" name="user-sex" id="user-mail" value="mail" onChange={this.inputChangeUserSex}/>
          <label htmlFor="user-mail">남성</label>
          <input type="radio" name="user-sex" id="user-femail" value="femail" onChange={this.inputChangeUserSex}/>
          <label htmlFor="user-femail">여성</label>
        </div>
        <Selectbox
          selectType="searchable"
          name="products"
          className="search-product"
          placeholder="상품명 검색"
          options={Products}
          value={this.state.newOrderProduct}
          onChange={this.inputChangeProduct}
          searchable={true}
        />
      </div>
    );
    const newOrderStep_2 = (
      <div className="service-input">
        <Selectbox
          selectType="selectable"
          name="epxerts"
          className="select-expert"
          placeholder="선택"
          options={Experts}
          value={this.state.newOrderExpert}
          onChange={this.inputChangeExpert}
          searchable={false}
        />
      </div>
    )
    const newOrderStep_3 = (
      <div className="service-input">
        <Selectbox
          selectType="searchable"
          name="customer"
          className="search-customer"
          placeholder="고객님의 이름을 입력해주세요"
          options={Customers}
          value={this.state.newOrderUserName}
          onChange={this.inputChangeUserName}
          searchable={true}
        />
        <div className="customer-phone">
          <input type="text" value={this.state.newOrderPhone ? this.state.newOrderPhone.slice(0,3) : ''} readOnly/><i>-</i>
          <input type="text" value={this.state.newOrderPhone ? this.state.newOrderPhone.slice(4,8) : ''} readOnly/><i>-</i>
          <input type="text" value={this.state.newOrderPhone ? this.state.newOrderPhone.slice(9,14) : ''} readOnly/>
        </div>
        <div><input type="text" value={this.state.newOrderStart} onChange={ this.inputChangeOrderStart} placeholder="예약시작시간"/></div>
        <div><input type="text" value={this.state.newOrderEnd} onChange={ this.inputChangeOrderEnd } placeholder="예약종료시간"/></div>
        <div><input type="text" value={this.state.newOrderComment} onChange={ this.inputChangeComment } placeholder="남길말" /></div>
      </div>
    )
    const newOrderStep_4 = (
      ""
    )
    return (
      <div className={`new-order-wrap step-${this.state.newOrderStep}`}>
        <div className="viewview">
          <span>newOrderStep</span> : {this.state.newOrderStep !== undefined ? this.state.newOrderStep : '알수없음'} <br />
          <span>newOrderExpert</span> : {this.state.newOrderExpert ? this.state.newOrderExpert : '알수없음'} <br />
          <span>newOrderProduct</span> : {this.state.newOrderProduct ? this.state.newOrderProduct : '알수없음'} <br />
          <span>newOrderUserName</span> : {this.state.newOrderUserName ? this.state.newOrderUserName : '알수없음'} <br />
          <span>newOrderUserSex</span> : {this.state.newOrderUserSex ? this.state.newOrderUserSex : '알수없음'} <br />
          <span>newOrderStart</span> : {this.state.newOrderStart ? this.state.newOrderStart : '알수없음'} <br />
          <span>newOrderEnd</span> : {this.state.newOrderEnd ? this.state.newOrderEnd : '알수없음'} <br />
          <span>newOrderPhone</span> : {this.state.newOrderPhone ? this.state.newOrderPhone : '알수없음'} <br />
          <span>newOrderComment</span> : {this.state.newOrderComment ? this.state.newOrderComment : '알수없음'} <br />
        </div>
        <div className="new-order-navigator">
          <h2>예약생성</h2>
          <ol className="navigator">
            <li><button onClick={ () => {this.setState({newOrderStep:0})} }>1.서비스선택</button></li>
            <li><button onClick={ () => {this.setState({newOrderStep:1})} }>2.시술자 선택</button></li>
            <li><button onClick={ () => {this.setState({newOrderStep:2})} }>3.고객정보 입력</button></li>
            <li><button onClick={ () => {this.setState({newOrderStep:3})} }>4.예약시간 선택</button></li>
          </ol>
          <button className="new-order-close ir" onClick={ () => this.props.isNewOrder(false)}>닫기</button>
        </div>
        <ReactCSSTransitionGroup
            transitionName="new-order"
            transitionEnterTimeout={-1}
            transitionLeaveTimeout={-1}
            transitionAppear={true}
            transitionAppearTimeout={200}>
          <div className="new-order">
            <div className="service-info">
              <div className="lt">
                <p className="product"><button onClick={ () => {this.setState({newOrderStep:0})} }>{this.state.newOrderStep !== 0 ? this.state.newOrderProduct : '서비스 입력'}</button></p>
                <p className="service-time"><button onClick={ () => {this.setState({newOrderStep:0})} }>{this.state.newOrderStep !== 0 ? this.state.newOrderTime : '00:00 - 00:00'}</button></p>
              </div>
              <div className="rt">
                <p className="user"><button onClick={ () => {this.setState({newOrderStep:2})} }>{this.state.newOrderStep > 2 ? this.state.newOrderUserName : '고객정보 입력'}</button></p>
                <p className="picture"><span><img src="" alt="" /></span></p>
              </div>
            </div>
            <div className="service-input-wrap">
              { this.state.newOrderStep === 0 ? newOrderStep_1 : '' }
              { this.state.newOrderStep === 1 ? newOrderStep_2 : '' }
              { this.state.newOrderStep === 2 ? newOrderStep_3 : '' }
              { this.state.newOrderStep === 3 ? newOrderStep_4 : '' }
            </div>
            {nextButton}
            {
              this.props.isConfirm ?
                <ModalConfirm
                  newOrderStart={this.state.newOrderStart}
                  newOrderEnd={this.state.newOrderEnd}
                  newOrderName={this.state.newOrderUserName}
                  newOrderProduct={this.state.newOrderProduct}
                  confirmOrder={ (bool) => this.props.renderOrder(bool, this.state) }
                />
                : undefined
            }
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
