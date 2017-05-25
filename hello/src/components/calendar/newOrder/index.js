import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';
import update from 'immutability-helper';
import { SearchGuest, SearchService, Selectable } from '../select';
import { ButtonElement } from './button';
import Draggable from 'react-draggable';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import '../../../css/newOrder.css';
import '../../../css/customerCard.css';

class NewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.newOrderConfig.type, // str
            newOrderStep: 1, // int 1-3
            newOrderGuestName: this.props.newOrderSchedule.guestName, // str
            newOrderSex: this.props.newOrderSchedule.sex, // int 0-2
            newOrderPhone: this.props.newOrderSchedule.phone, // array
            newOrderService: this.props.newOrderSchedule.service, // object (service object)
            newOrderStaff: !_.isEmpty(this.props.newOrderSchedule.staff) ? this.props.newOrderSchedule.staff : this.props.newOrderConfig.staff, // object
            newOrderGuest: !_.isEmpty(this.props.newOrderSchedule.guest) ? this.props.newOrderSchedule.guest : this.props.newOrderConfig.guest,  // object
            newOrderStart: !_.isEmpty(this.props.newOrderSchedule.start) ? this.props.newOrderSchedule.start : this.props.newOrderConfig.start, // moment format
            newOrderEnd: this.props.newOrderSchedule.end, // moment format
            newOrderTime: this.props.newOrderSchedule.time // HH:mm
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
        this.getTitle = this.getTitle.bind(this);
    }

    test(e) {
        e.preventDefault();
        e.stopPropagation();
        console.info(e);
    }

    createWarning(msg) {
        console.warn(`${msg} prop is undefined`);
    }

    getTitle(status) {
        switch (status) {
            case actions.NewOrderStatus.DIRECT :
                return '예약생성';
            default:
                return '예약';
        }
    }

    documentBinding() {
        const component = this;
        window.onbeforeunload = () => {
            if (false) {
                return '저장되지 않습니다~@!!!';
            }
        }
    // ESC key 입력시 닫기
        $(window).bind('keydown', (e) => {
            if (e.which === 27 && !component.props.isModalConfirm && !component.props.isRenderConfirm) {
                if (component.state.newOrderStep < 3)
                    component.props.newOrderFinish();
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
    }

    toggleInterfaces(isMount) {
        return;
        if (isMount)
            $('.create-order-wrap.fixed').addClass('hidden');
        else
            $('.create-order-wrap.fixed').removeClass('hidden');
    }

    insertComponent(savedScheduleObject) {
        const scrollerX = $('#daily .fc-view-container');
        const scrollerY = $('.fc-scroller.fc-time-grid-container');

        const insert = (scheduleObject) => {
            if (!_.isEmpty(scheduleObject)) {
                const savedDomElement = $(`#ID_${scheduleObject.id}`);
                if (savedDomElement.length) {
                    const left = savedDomElement.offset().left + savedDomElement.width() / 2;
                    const top = savedDomElement.offset().top;
                    $(this.Container).find('.new-order').css({ left, top });
                }
            }
        };
        // $(scrollerX).scroll((e) => { insert(this.props.newOrderConfig.savedSchedule); });
        // $(scrollerY).scroll((e) => { insert(this.props.newOrderConfig.savedSchedule); });

        // 초기 한번 실행
        insert(savedScheduleObject);
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
                switch (this.props.newOrderConfig.status) {
                    case actions.NewOrderStatus.QUICK :
                        this.props.renderNewScheduleUnknownStart(true, this.state);
                        break;
                    case actions.NewOrderStatus.DIRECT :
                        this.props.beforeInitConfirmRenderNewSchedule(true, this.state);
                        break;
                    default:
                        break;
                }
                this.setState({ newOrderStep: 3 });
                break;
            case 3 :
                this.props.modalConfirm(true);
                break;
            default:
                break;
        }
    }

    changeStep(step) {
        this.setState({
            newOrderStep: step
        });
    // 렌더링을 한 후에 이전단계의 step 으로 가는 경우
    // if (this.state.newOrderStep === 3 && step < 3) {
    // }
    }

    autoFocus(e, idx) {
        const phone = this.state.newOrderPhone;
        if (!_.isEmpty(phone), phone.length === 3) {
            if (idx === 2) {
                if (phone[0].length >= 3 &&
                    phone[1].length >= 4 &&
                    phone[2].length >= 4
                ) return true; // this.next.focus();
            }
        }
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
        const component = this;
        this.setState({
            newOrderPhone: update(this.state.newOrderPhone, {
                [idx]: { $set: e.target.value }
            })
        }, () => {
            component.autoFocus(e, idx);
        });
    }
    inputChangeGuest(option) {
        const component = this;
        // 등록된 고객중에 선택한 경우
        if (!_.isEmpty(JSON.stringify(option.id))) {
            // clear states
            this.setState({ newOrderGuest: option, newOrderGuestName: '' }, () => {
                // component.next.focus();
            });
        }
        // 등록된 고객중에 선택하지 않은경우
        else {
            // set states
            this.setState({ newOrderGuest: undefined, newOrderGuestName: option.value }, () => {
                if (!_.isEmpty(option))
                    component.phone1.focus();
            });
        }
    }
    inputChangeUserSex(e) { this.setState({ newOrderSex: e.target.value }); }
    inputChangeOrderStart(e) { this.setState({ newOrderStart: e.target.value }); }
    inputChangeOrderEnd(e) { this.setState({ newOrderEnd: e.target.value }); }

    componentDidMount() {
    // Window event binding
        this.documentBinding();
    // init insert NewOrder component
        if (this.props.newOrderConfig.status === actions.NewOrderStatus.DIRECT)
            this.insertComponent(this.props.newOrderConfig.savedSchedule);

    // 예약수정, 예약요청확인 인경우
        if (this.props.newOrderConfig.status === actions.NewOrderStatus.REQUESTED)
            this.initEditEvent(this.props.willEditEventObject);
    // 스타일 적용
        this.toggleInterfaces(true);
    }

    componentWillUnmount() {
        this.toggleInterfaces(false);

    }

    render() {
        const state = this.state;
        const step = this.state.newOrderStep;
        const title = this.getTitle(this.props.newOrderConfig.status);

        const newOrderStep1 = (
            <CSSTransitionGroup
                transitionName="service-input"
                transitionAppear={false}
                transitionLeave={false}
                transitionEnter={false}
                transitionAppearTimeout={0}
            >
                <div className="service-input">
                    <SearchGuest
                        name="customer"
                        autofocus
                        openOnFocus
                        labelKey="guest_name"
                        className="search-customer"
                        placeholder="고객님의 이름을 입력해주세요"
                        options={this.props.guests}
                        value={!_.isEmpty(this.state.newOrderGuest) ? this.state.newOrderGuest : undefined}
                        onChange={this.inputChangeGuest}
                        clearable={false}
                    />
                    {_.isEmpty(this.state.newOrderGuest) ? (
                        <div className="customer-phone">
                            <div>
                                <input
                                    type="text"
                                    maxLength="3"
                                    className={!_.isEmpty(this.state.newOrderPhone[0]) ? 'has-value' : 'null-value'}
                                    value={!_.isEmpty(this.state.newOrderPhone[0]) ? this.state.newOrderPhone[0] : ''}
                                    onChange={e => this.inputChangeUserPhone(e, 0)}
                                    ref={(c) => { this.phone1 = c; }}
                                    placeholder="010"
                                />
                                <i>-</i>
                                <input
                                    type="text"
                                    maxLength="4"
                                    className={!_.isEmpty(this.state.newOrderPhone[1]) ? 'has-value' : 'null-value'}
                                    value={!_.isEmpty(this.state.newOrderPhone[1]) ? this.state.newOrderPhone[1] : ''}
                                    onChange={e => this.inputChangeUserPhone(e, 1)}
                                    ref={(c) => { this.phone2 = c; }}
                                    placeholder="0000"
                                />
                                <i>-</i>
                                <input
                                    type="text"
                                    maxLength="4"
                                    className={!_.isEmpty(this.state.newOrderPhone[2]) ? 'has-value' : 'null-value'}
                                    value={!_.isEmpty(this.state.newOrderPhone[2]) ? this.state.newOrderPhone[2] : ''}
                                    onChange={e => this.inputChangeUserPhone(e, 2)}
                                    ref={(c) => { this.phone3 = c; }}
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
                transitionAppear={false}
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
                            autoFocus
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
                        noResultsText="일치하는 결과가 없습니다"
                        labelKey="name"
                        options={this.props.services}
                        autofocus={false}
                        openOnFocus
                        value={!_.isEmpty(this.state.newOrderService) ? this.state.newOrderService : undefined}
                        onChange={this.inputChangeService}
                    />
                    <br />
                    <Selectable
                        value={!_.isEmpty(this.state.newOrderStaff) ? this.state.newOrderStaff : undefined}
                        selectType="selectable"
                        name="epxerts"
                        className="select-expert"
                        placeholder="선택"
                        labelKey="nickname"
                        options={this.props.staffs}
                        onChange={this.inputChangeStaff}
                        searchable={false}
                    />
                </div>
            </CSSTransitionGroup>
        );

        const classes = ['new-order-wrap'];
        classes.push(`step-${this.state.newOrderStep}`);
        if (!_.isEmpty(this.props.newOrderConfig.savedSchedule))
            classes.push('inner-event');
        else
            classes.push('overlay');
        if (this.props.unknownStart || this.props.isEditEvent)
            classes.push('fixed');
        else
            classes.push('hidden');

        return (
            <div
                ref={(c) => { this.Container = c; }}
                className={classes.join(' ')}
            >
                <div className="viewstate order" style={{ display: 'block', top: '400px' }}>
                    <button onClick={() => { $('.viewstate.order').hide(); }}>X</button>
                    <div>{JSON.stringify(this.props.newOrderConfig)}</div>
                    <div>{JSON.stringify(this.props.newOrderSchedule)}</div>
                    <span>isModalConfirm</span> : {this.props.isModalConfirm ? 'true' : ''} <br />
                    <span>type</span> : {this.state.type} <br />
                    <span>newOrderStep</span> : {this.state.newOrderStep !== undefined ? this.state.newOrderStep : ''} <br />
                    <span>newOrderStaff</span> : {!_.isEmpty(this.state.newOrderStaff) ? this.state.newOrderStaff.label : ''} <br />
                    <span>newOrderService</span> : {!_.isEmpty(this.state.newOrderService) ? this.state.newOrderService.name : ''} <br />
                    <span>newOrderGuestName</span> : {this.state.newOrderGuestName ? this.state.newOrderGuestName : ''} <br />
                    <span>newOrderPhone</span> : {!_.isEmpty(this.state.newOrderPhone) ? this.state.newOrderPhone : ''} <br />
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
                    <Draggable>
                        <div className="new-order">
                            <div className="new-order-head">
                                <h2>{title}</h2>
                                <button className="new-order-close ir" onClick={this.props.newOrderFinish}>닫기</button>
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
                                        <button onClick={() => { this.changeStep(1); }} disabled={false}>
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
                                        <button onClick={() => { this.changeStep(2); }} disabled={false}>
                                          서비스 선택
                                        </button>
                                    </h3>
                                    <div className="service-input-inner">
                                        { step === 2 ? newOrderStep2 : '' }
                                    </div>
                                </div>
                            </div>
                            <div className="new-order-foot">
                                <ButtonElement
                                    text="CANCEL"
                                    disabled={false}
                                    autofocus={false}
                                    active={false}
                                    classNames={['new-order-btn', 'new-order-cancel', 'left']}
                                    handleClick={this.newOrderFinish}
                                />
                                <ButtonElement
                                    text="DELETE"
                                    disabled={true}
                                    autofocus={false}
                                    active={false}
                                    classNames={['new-order-btn', 'new-order-cancel', 'left']}
                                    handleClick={this.newOrderFinish}
                                />
                                <ButtonElement
                                    ref={(c) => { this.next = c; }}
                                    text="NEXT"
                                    disabled={false}
                                    autofocus={false}
                                    active={!_.isEmpty(state.newOrderGuest) && (!_.isEmpty(state.newOrderGuest.guest_name) || !_.isEmpty(state.newOrderGuestName))}
                                    classNames={['new-order-btn', 'new-order-submit', 'right']}
                                    handleClick={this.nextStep}
                                />
                                <ButtonElement
                                    text="SKIP"
                                    disabled={true}
                                    autofocus={false}
                                    active={false}
                                    classNames={['new-order-btn', 'new-order-submit', 'right']}
                                    handleClick={this.nextStep}
                                />
                                <ButtonElement
                                    text="CONFIRM"
                                    disabled={false}
                                    autofocus={false}
                                    active={true}
                                    classNames={['new-order-btn', 'new-order-submit', 'right']}
                                    handleClick={this.nextStep}
                                />
                            </div>
                        </div>
                    </Draggable>
                </CSSTransitionGroup>
            </div>
        );
    }
}

NewOrder.propTypes = {
    beforeInitConfirmRenderNewSchedule: PropTypes.func,
    newOrderFinish: PropTypes.func,
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
    selectedStaff: PropTypes.object,
    newOrderConfig: PropTypes.object,
    newOrderSchedule: PropTypes.object,
};

NewOrder.defaultProps = {
    beforeInitConfirmRenderNewSchedule() { Functions.createWarning('beforeInitConfirmRenderNewSchedule'); },
    newOrderFinish() { Functions.createWarning('newOrderFinish'); },
    changeView() { Functions.createWarning('changeView'); },
    backToOrder() { Functions.createWarning('backToOrder'); },
    renderNewScheduleUnknownStart() { Functions.createWarning('renderNewScheduleUnknownStart'); },
    unknownStart: false,
    isEditEvent: false,
    isRequestReservation: false,
    willEditEventObject: {},
    isModalConfirm: false,
    isRenderConfirm: false,
};

const mapStateToProps = state => ({
    newOrderConfig: state.newOrderConfig,
    newOrderSchedule: state.newOrderSchedule
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOrder);
