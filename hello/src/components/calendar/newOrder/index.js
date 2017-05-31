import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';
import update from 'immutability-helper';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Draggable from 'react-draggable';
import { Head } from './head';
import { Body } from './body';
import { Foot } from './foot';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import '../../../css/newOrder.css';
import '../../../css/customerCard.css';

class NewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1, // int 1-3
            schedule: this.props.schedule,
            temporaryScheduleObject: {
                guest_mobile: ['', '', ''],
                guest_sex: undefined
            }
        };
        this.initEditEvent = this.initEditEvent.bind(this);
        this.insertComponent = this.insertComponent.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.autoFocus = this.autoFocus.bind(this);
        this.inputChangeStaff = this.inputChangeStaff.bind(this);
        this.inputChangeService = this.inputChangeService.bind(this);
        this.inputChangeGuest = this.inputChangeGuest.bind(this);
        this.inputChangePhone = this.inputChangePhone.bind(this);
        this.inputChangeSex = this.inputChangeSex.bind(this);
        this.inputChangeOrderStart = this.inputChangeOrderStart.bind(this);
        this.inputChangeOrderEnd = this.inputChangeOrderEnd.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.newOrderCancel = this.newOrderCancel.bind(this);

        this.test = this.test.bind(this);
    }

    test(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /* *************************************************
      Lifecyle related
    ************************************************* */
    componentDidMount() {
        // Window event binding
        // init insert NewOrder component
        if (this.props.status === actions.NewOrderStatus.DIRECT)
            this.insertComponent(this.props.schedule);

        // 예약수정, 예약요청확인 인경우
        if (this.props.status === actions.NewOrderStatus.REQUESTED)
            this.initEditEvent(this.props.willEditEventObject);
        // 스타일 적용
        this.toggleInterfaces(true);
    }

    componentWillUnmount() {
        this.toggleInterfaces(false);
    }

    componentWillReceiveProps(nextProps) {
        // 예약생성중 Guest를 변경했을경우 state를 변경한 Guest의 object로 update
        console.info(this.props);
        console.info(nextProps);
        if (this.props.schedule.guest_id !== nextProps.schedule.guest_id) {
            this.setState({
                schedule: nextProps.schedule
            })
        }
    }
    /* *************************************************/

    /* *************************************************
      예약생성 관련
    ************************************************* */
    updateSchedule(object) {
        const component = this;
        const updatedSchedule = Object.assign({}, this.state.schedule, object);
        this.setState({
            schedule: updatedSchedule
        }, () => {
            component.props.updateSchedule(updatedSchedule);
        });
    }

    // [예약생성 취소]
    newOrderCancel() {
        const component = this;
        this.props.modal({
            condition: true,
            htmls: [
                { text: '이전까지 입력된 예약정보는 ', classes: ['block'] },
                { text: '저장되지 않습니다.', classes: ['block'] },
                { text: '예약을 취소하시겠습니까?', classes: ['black', 'bold'] }
            ],
            buttons: [
                {
                    text: '취소',
                    classes: ['cancel'],
                    autoFocus: false,
                    click: function() {
                        component.props.modal({ condition: false })
                    }
                },
                {
                    text: '확인',
                    classes: ['confirm'],
                    autoFocus: true,
                    click: function() {
                        component.props.modal({ condition: false });
                        component.props.updateSchedule(component.state.schedule, actions.ScheduleStatus.CANCELED);
                    }
                },
            ]
        })
    }
    /* *************************************************/

    /* *************************************************
      DOM RELATED
    ************************************************* */
    getTitle(status) {
        switch (status) {
            case actions.NewOrderStatus.DIRECT :
                return '예약생성';
            default:
                return '예약';
        }
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
                    const left = savedDomElement.offset().left + savedDomElement.width();
                    const top = savedDomElement.offset().top;
                    $(this.Container).find('.new-order').css({ left, top });
                }
            }
        };
        // $(scrollerX).scroll((e) => { insert(this.props.schedule); });
        // $(scrollerY).scroll((e) => { insert(this.props.schedule); });

        // 초기 한번 실행
        insert(savedScheduleObject);
    }

    autoFocus(e, idx) {
        const mobile = this.state.schedule.guest_mobile;
        if (!_.isEmpty(mobile), mobile.length === 3) {
            if (idx === 2) {
                if (mobile[0].length >= 3 &&
                    mobile[1].length >= 4 &&
                    mobile[2].length >= 4
                ) return true; // this.next.focus();
            }
        }
    }
    /* *************************************************/

    /* *************************************************
      INPUT UPDATES
    ************************************************* */
    inputChangeService(service) {
        const object = {
            shop_service_id: service.id,
            service_code: service.code,
            service_time: service.time
        };
        if (this.props.status === actions.NewOrderStatus.DIRECT) {
            const end = moment(this.state.schedule.start).add(service.time, 'minutes');
            object.end = end;
            object.end_time = end.format('HH:mm');
        }
        this.updateSchedule(object);
    }
    inputChangeStaff(staff) {
        this.updateSchedule({
            staff_id: staff.id
        })
    }
    inputChangePhone(e, index) {
        const component = this;
        const mobile = update(this.state.temporaryScheduleObject.guest_mobile, {
            [index]: { $set: e.target.value }
        })
        // this.updateSchedule({
        //     guest_mobile: mobile
        // })
        // component.autoFocus(e, index);
    }
    inputChangeGuest(guest, isNewGuest) {
        const component = this;
        const object = {
            guest_name: guest.guest_name
        };

        // 신규고객을 입력한경우
        if (isNewGuest) {
            // ...
        }
        else {
            object.guest_id = guest.id;
            object.guest_class = guest.guest_class;
            object.guest_mobile = guest.guest_mobile;
        }
        // else if (!_.isEmpty(guest))
        //     component.phone1.focus();
        this.updateSchedule(object)
    }
    inputChangeSex(e) { this.updateSchedule({ __guest_sex: e.target.value }); }
    inputChangeOrderStart(e) { this.updateSchedule({ __start: e.target.value }); }
    inputChangeOrderEnd(e) { this.updateSchedule({ __end: e.target.value }); }
    /* *************************************************/

    /* *************************************************
      etc..
    ************************************************* */
    initEditEvent(e) {
        this.setState({
            step: 3,
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

    setNewOrderStaff(staff) {
        this.setState({ newOrderStaff: staff });
    }

    getScheduleObj() {
        return this.state;
    }

    backToStep(step) {
        this.setState({ step: step });
    }

    nextStep() {
        const component = this;
        switch (this.state.step) {
            case 1 :
                this.changeStep(2);
                break;
            case 2 :
                switch (this.props.status) {
                    case actions.NewOrderStatus.QUICK :
                        this.props.renderNewScheduleUnknownStart(true, this.state);
                        break;
                    case actions.NewOrderStatus.DIRECT :
                        this.props.beforeInitConfirmRenderNewSchedule(true, this.state);
                        break;
                    default:
                        break;
                }
                this.setState({ step: 3 });
                break;
            case 3 :
                this.props.modal(true);
                break;
            default:
                break;
        }
    }

    changeStep(step) {
        this.setState({
            step
        });
    // 렌더링을 한 후에 이전단계의 step 으로 가는 경우
    // if (this.state.step === 3 && step < 3) {
    // }
    }

    render() {
        const { state, props } = this;
        const title = this.getTitle(props.status);
        const guest = !_.isEmpty(JSON.stringify(state.schedule.guest_id)) ? Functions.getGuest(state.schedule.guest_id, props.guests) : null;

        /* **********************************************
            container dom element 스타일 적용관련 클래스 선언
        ************************************************/
        const classes = ['new-order-wrap'];
        classes.push(`step-${state.step}`);
        if (!_.isEmpty(props.schedule))
            classes.push('inner-event');
        else
            classes.push('overlay');
        /* *********************************************/


        /* **********************************************
            state 단순 확인용 임시 컴포넌트.
        ************************************************/
        const mapToComponentStates = object => {
            const transformToArray = [];
            for (var propertyName in object) {
                transformToArray.push({
                    propertyName: propertyName,
                    propertyValue: object[propertyName]
                });
            }
            return transformToArray.map(obj => (
                  <div className="table-row" key={obj.propertyName}>
                      <div className="table-cell th">{obj.propertyName} :</div>
                      <div className="table-cell td">{JSON.stringify(obj.propertyValue)}</div>
                  </div>
                )
            );
        }
        /* *********************************************/

        return (
            <div ref={(c) => { this.Container = c; }} className={classes.join(' ')}>
                <button onClick={this.test} style={{ position: 'fixed', left: '280px', top: '111px', zIndex: '1111', background: 'rgb(123, 111, 238)' }}>
                    테스트!
                </button>
                <div className="viewstate order" style={{ display: 'block', top: '400px' }}>
                    <button onClick={() => { $('.viewstate.order').hide(); }}>X</button>
                    <h3>SCHEDULE</h3>
                    <div className="table">
                        {mapToComponentStates(this.state.schedule)}
                    </div>
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
                            <Head title={title} handleClick={this.newOrderCancel} />
                            <Body
                                schedule={this.state.schedule}
                                temporaryScheduleObject={this.state.temporaryScheduleObject}
                                step={this.state.step}
                                guests={this.props.guests}
                                services={this.props.services}
                                staffs={this.props.staffs}
                                changeStep={this.changeStep}
                                inputChangeGuest={this.inputChangeGuest}
                                inputChangePhone={this.inputChangePhone}
                                inputChangeSex={this.inputChangeSex}
                                inputChangeService={this.inputChangeService}
                                inputChangeStaff={this.inputChangeStaff}
                            />
                            <Foot />
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
    status: PropTypes.string,
    schedule: PropTypes.object
};

const defaultProps = {
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
    schedule: {},
    status: actions.NewOrderStatus.DIRECT
};

NewOrder.defaultProps = defaultProps;

const mapStateToProps = state => ({
    schedule: defaultProps.schedule,
    status: defaultProps.status,
    ...state.newOrderConfig
});

const mapDispatchToProps = dispatch => ({
    modal: options => dispatch(actions.modal(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOrder);
