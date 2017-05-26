import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';
import 'fullcalendar/dist/fullcalendar.min.css';
import * as actions from '../../actions';
import RenderEventConfirm from './modal/renderEventConfirm';
import ReservationCardContainer from '../userCard';
// import Notifier from '../../components/notifier';
import DailyCalendar from './fullCalendar/dailyCalendar';
import WeeklyCalendar from './fullCalendar/weeklyCalendar';
import '../../css/fullcalendar-scheduler-customizing.css';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewType: this.props.defaultView, // state에 의해 타임라인 view를 렌더링함 [agendaDay or agendaWeekly]
            viewDate: moment(),
            isNewOrder: false,
            newOrderStates: {
                type: undefined,
                staff: undefined,
                start: undefined,
                schedule: undefined
            }
        };

        this.changeDate = this.changeDate.bind(this);
        this.newOrderByDailyTimeline = this.newOrderByDailyTimeline.bind(this);
        this.newOrderCancel = this.newOrderCancel.bind(this);
        this.changeView = this.changeView.bind(this);
        this.returnNewID = this.returnNewID.bind(this);
        this.timelineWasMount = this.timelineWasMount.bind(this);
        this.returnNewOrderStates = this.returnNewOrderStates.bind(this);
        this.returnScheduleObj = this.returnScheduleObj.bind(this);
        this.setTimelineDate = this.setTimelineDate.bind(this);
        this.runUserCardSlide = this.runUserCardSlide.bind(this);

        this.fetchSchedule = this.fetchSchedule.bind(this);
        this.test = this.test.bind(this);
    }

    test(e) {
        this.props.newOrder(!this.props.newOrderConfig.condition);
        this.props.toggleNotifier(!this.props.isModalNotifier);
    }

    componentDidMount() {
        const { selectedShopID } = this.props;
        this.props.fetchSchedulesIfNeeded(selectedShopID);
        this.props.fetchStaffsIfNeeded(selectedShopID);
        this.props.fetchServicesIfNeeded(selectedShopID);
        this.props.fetchGuestsIfNeeded(selectedShopID);
    }

    componentWillUnmount() {
        this.activeGnb(null, false);
    }

    setTimelineDate(date) {
        this.setState({
            viewDate: date
        });
    }

    // Daily Timeline 에서 예약생성 모듈로 접근시 실행하는 함수.
    newOrderByDailyTimeline(options) {
        this.setState({
            isNewOrder: true,
            newOrderStates: {
                type: options.type,
                staff: options.staff,
                start: options.start,
                schedule: options.schedule
            }
        }, () => this.changeView('agendaWeekly'));
    }

    returnNewID() {
        // 임시 아이디생성 ( dom의 id는 'ID_생성된아이디' 값 으로 제어가능 );
        return Math.floor((Math.random() * 99999) + 1);
    }

    runUserCardSlide(t, calSchedule, jsEvent, view) {
        const selectedDate = moment(calSchedule.start);
        // 더블클릭으로 선택된 이벤트객체를 가져옵니다
        const selectedCard = calSchedule;
        // 선택된 이벤트객체의 리소스ID에 맞는 expert id를 찾아 가져옵니다
        const selectedStaff = $(t.Calendar).fullCalendar('getResourceById', selectedCard.resourceId);

        // userCard 컴포넌트의 초기값을 전달한다
        t.isUserCard(true, {
            selectedDate,
            selectedCard,
            selectedStaff,
        });
    }

    changeView(type) {
        this.setState({
            viewType: type
        });

        this.props.setCalendarViewType(type);
    }

    /**
     *
     * @param {string} YYYY-MM-DD formatted date
     */
    changeDate(momentDate) {
        const { calendarConfig, selectedShopID } = this.props;

        this.props.setCalendarCurrent(momentDate);

        switch (calendarConfig.viewType) {
            case 'agendaDay':
                if (momentDate.isBefore(calendarConfig.start))
                    this.props.setCalendarStart(momentDate);
                if (momentDate.isAfter(calendarConfig.end))
                    this.props.setCalendarEnd(momentDate.add('7', 'days'));
                break;
            case 'agendaWeek':
                break;
            default:
                break;
        }

        this.props.fetchSchedulesIfNeeded(selectedShopID);
    }

    returnScheduleObj(newSchedule) {
        return {
            reservation_dt: moment(newSchedule.newOrderStart).format('YYYY-MM-DD'),
            shop_id: null,
            start_time: moment(newSchedule.newOrderStart).format('HH:mm'),
            end_time: moment(newSchedule.newOrderEnd).format('HH:mm'),
            user_id: null,
            guest_id: null,
            status: actions.ScheduleStatus.CREATED,
            guest_name: (newSchedule.newOrderGuest.guest_name || newSchedule.newOrderGuestName),
            guest_mobile: newSchedule.newOrderGuest.guest_mobile,
            guest_class: newSchedule.newOrderGuest.geust_class,
            guest_memo: newSchedule.newOrderGuestMemo,
            shop_service_id: newSchedule.newOrderService.id,
            service_code: newSchedule.newOrderService.code,
            service_time: newSchedule.newOrderService.time,
            start: newSchedule.newOrderStart,
            end: newSchedule.newOrderEnd,
            staff_Id: (newSchedule.newOrderStaff.id || newSchedule.resourceId),
            resourceId: (newSchedule.newOrderStaff.id || newSchedule.resourceId)
        };
    }

    // 주/일단위 컴포넌트 componentDidMount 에서 실행하는 공통 사용함수
    timelineWasMount(view) {
        this.insertElements();
        this.activeGnb(view, true);

        // const viewChangeButtons = $('.fc-toolbar.fc-header-toolbar .fc-right button');
        if (view === 'agendaDay')
            $('.fc-agendaDayCustom-button').addClass('fc-state-active');
        else {
            $('.fc-agendaWeeklyCustom-button').addClass('fc-state-active');
            this.setState({
                isNewOrder: false
            });
        }
    }

    insertElements() {
        // 캘린더상단 오늘로이동 버튼 삽입
        $('.fc-today-timeline-button-wrap').appendTo('.fc-left');
    }

    returnNewOrderStates() {
        return this.state.newOrderStates;
    }

    toggleCreateOrderFixedUi() {
        // 우측하단 예약생성 고정버튼 Ui toggle
        $('.create-order-wrap.fixed .create-order-ui').toggle();

        $('.create-order-wrap.fixed').bind('mouseleave', () => {
            $('.create-order-wrap.fixed .create-order-ui').hide();
        });
    }

    // 타임라인 예약생성 버튼의 data-date 값을 set/return
    mouseenterSlotTime(isSetting, date) {
        const createButtonElem = $('.create-order-wrap.timeline');
        if (isSetting)
            return $(createButtonElem).attr('data-date', date);
        return $(createButtonElem).attr('data-date');
    }

    newOrderCancel() {
        const { Calendar } = this;
        // 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
        $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
        // 시작시간을 미리 선택하지않고 이벤트를 생성중에 취소할 경우
        if (this.state.unknownStart || this.state.isEditEvent)
            this.resetOrder();
        else if (this.state.newScheduleID) {
            // enable editable
            const evt = $(Calendar).fullCalendar('clientSchedule', this.state.newScheduleID);
            evt.editable = true;
            $(Calendar).fullCalendar('updateEvent', evt);
            // $(Calendar).fullCalendar('option', 'editable', true);
        }

        $('.create-order-wrap.fixed').removeClass('hidden');
        $('#render-confirm').hide();

        this.setState({
            isNewOrder: false
        });
    }

    // STAFFS data를 Priority기준으로 재배열 한다
    sortStaff(staffs) {
        if (!_.isEmpty(staffs)) {
            const sortStaffs = staffs.sort((a, b) => {
                if (a.priority < b.priority)
                    return -1;
                if (a.priority > b.priority)
                    return 1;
                return 0;
            });
            return sortStaffs;
        } return null;
    }

    // GNB 예약 활성/비활성화
    activeGnb(view, condition) {
        if (!condition)
            $('.nav-reservation a').removeClass('active');
        else {
            $('.nav-reservation > a').addClass('active');
            $('.nav-reservation .header-nav-sub a').removeClass('active');
            if (view === 'agendaDay')
                $('.nav-daily > a').addClass('active');
            else
                $('.nav-overview > a').addClass('active');
        }
    }

    fetchSchedule() {
        const { selectedShopID } = this.props;
        this.props.fetchSchedulesIfNeeded(selectedShopID);
    }

    render() {
        this.sortStaff(this.props.staffs.data);

        const UserCardComponent = (_this) => {
            if (!_this.state.isUserCard) return '';
            return (
                <ReservationCardContainer
                    schedules={_this.props.schedules}
                    services={_this.props.services}
                    staffs={_this.props.staffs}
                    isUserCard={bool => _this.isUserCard(bool)}
                    onRemoveEvent={schedule => _this.removeConfirm(schedule)}
                    onEditEvent={schedule => _this.editEvent(schedule)}
                />
            );
        };

        const RenderConfirmComponent = (_this, view) => {
            if (!_this.state.isRenderConfirm) return '';
            return (
                <RenderEventConfirm
                    viewType={view}
                    isModalConfirm={_this.state.isModalConfirm}
                    modalConfirm={_this.beforeFinalConfirmRenderNewSchedule}
                    newScheduleID={_this.state.newScheduleID}
                />
            );
        };

        const fcOptions = {
            schedulerLicenseKey: `${process.env.REACT_APP_FULLCALENDAR_LISENCE ? process.env.REACT_APP_FULLCALENDAR_LISENCE : 'GPL-My-Project-Is-Open-Source'}`,
            scheduleStatus: actions.ScheduleStatus,
            guestClass: actions.GuestClass,
            shopServices: this.props.services.data,
            resourceOrder: 'priority', // staff의 정렬 순서를 무엇을 기준으로 할지 정함
            defaultDate: moment(this.state.viewDate), // 기본 날짜
            filterResourcesWithSchedule: false, // 이벤트가 없는 staff를 숨길지 여부
            locale: 'ko', // 언어선택
            longPressDelay: 125, // touch delay
            eventOverlap: false, // 중복되는 시간의 이벤트 수정 여부
            selectOverlap: false, // 중복되는 시간의 이벤트 생성 여부
            slotEventOverlap: false, // 중복시간의 슬롯을 오버랩킬지 여부
            // eventResourceEditable: ,//리소스간에 이벤트 이동이 가능한지 여부
            slotDuration: '00:10:00',
            snapDuration: '00:10:00',
            slotLabelInterval: '00:60:00', // 캘린더 좌측 시간 label 시간간격마다 표시
            slotLabelFormat: 'h A', // 캘린더 좌측 시간 label
            timeFormat: 'HH:mm', // slot 시간 단위
            columnFormat: 'D ddd', // 캘린더 상단 날자
            // slotMinutes : 20,        //슬롯 생성 분단위 범위 설정 default :30
            // minTime: '09:00',        //예약가능한 최소 시작시간 지정 (출근시간)
            // maxTime: '18:00',        //예약마감시간 지정
            // businessHours: {},       //샵 영업시간 지정 (모든 Expert 의 업무시간이 동일한경우) (staff 별로 지정할경우는 resources 에서 선언)
            // eventConstraint: false,  //이벤트 수정을 특정 시간 내로 제한함 (businessHours 와 관련)
            nowIndicator: true,
            dragOpacity: 1,
            dragScroll: true,
            editable: true, // 수정가능한지 여부
            selectable: false, // 드래그로 날짜를 선택하여 추가기능 활성화
            selectHelper: true, // 드래그시 배경색상 효과
            windowResizeDelay: 0, // 윈도우 리사이즈시 캘린더 리사이징 딜레이
            handleWindowResize: true, // 캘린더 resizable 여부
            allDayDefault: false
        };

        const commonViewProps = {
            fcOptions,
            schedules: this.props.schedules.data,
            staffs: this.props.staffs.data,
            services: this.props.services.data,
            guests: this.props.guests.data,

            defaultStaff: this.props.staffs[0],
            // defaultStaff: function() { _.isEmpty(this.props.staffs) ? Staff[0] : this.props.staffs.data },
            changeView: this.changeView,
            changeDate: this.changeDate,
            returnScheduleObj: this.returnScheduleObj,
            returnNewID: this.returnNewID,
            getSlotTime: this.mouseenterSlotTime,

            activeGnb: (view, condition) => this.activeGnb(view, condition),
            runUserCardSlide(t, calSchedule, jsEvent, view) { this.runUserCardSlide(t, calSchedule, jsEvent, view); },

            getUserCardComponent(t) { return UserCardComponent(t); },
            getRenderConfirmComponent(t, view) { return RenderConfirmComponent(t, view); }

        };

        const viewstate = (
            <div className="viewstate viewContainer">
                <h3>calendar container states</h3>
                <dl>
                    <dt>viewType : </dt> <dd>{this.state.viewType}</dd>
                    <dt>viewDate : </dt> <dd>{this.state.viewDate.format('YYYY-MM-DD')}</dd>
                    <dt>isNewOrder : </dt> <dd>{this.props.newOrderConfig.condition ? 'true' : 'false'}</dd>
                </dl>
            </div>
        );

        const DailyTimeline = (
            <DailyCalendar
                {...commonViewProps}
                ref={(c) => { this.daily = c; }}
                wasMount={() => this.timelineWasMount('agendaDay')}
                setTimelineDate={date => this.setTimelineDate(date)}
                newOrder={options => this.newOrderByDailyTimeline(options)}
            />
        );

        const WeeklyTimeline = (
            <WeeklyCalendar
                {...commonViewProps}
                ref={(c) => { this.weekly = c; }}
                wasMount={() => this.timelineWasMount('agendaWeekly')}
                setTimelineDate={date => this.setTimelineDate(date)}
                isBindedNewOrder={this.state.isNewOrder}
                getNewOrderStates={() => this.returnNewOrderStates()}
            />
        );

        const test = (
            <button
                style={{
                    position: 'fixed',
                    left: '80px',
                    top: '0px',
                    zIndex: '10',
                    background: '#ec0'
                }} onClick={() => this.test()}
            > CLICK ME!
          </button>
        );

        return (
            <div className="calendar">
                {test}
                {/* viewstate */}
                <div className="full-calendar">
                {this.state.viewType === 'agendaWeekly'
                  ? WeeklyTimeline
                  : DailyTimeline
                }
                </div>
            </div>
        );
    }
}

Calendar.defaultProps = {
    staffs: {
        isFetching: false,
        didInvalidate: false,
        staffs: []
    },
    schedules: {
        isFetching: false,
        didInvalidate: false,
        schedules: []
    },
    services: {
        isFetching: false,
        didInvalidate: false,
        services: []
    },
    guests: {
        isFetching: false,
        didInvalidate: false,
        guests: []
    }
};

Calendar.propTypes = {
    defaultView: PropTypes.string.isRequired,
    fetchSchedulesIfNeeded: PropTypes.func.isRequired,
    fetchStaffsIfNeeded: PropTypes.func.isRequired,
    fetchServicesIfNeeded: PropTypes.func.isRequired,
    fetchGuestsIfNeeded: PropTypes.func.isRequired,
    staffs: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        staffs: PropTypes.object,
    }),
    schedules: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        schedules: PropTypes.object,
    }),
    services: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        services: PropTypes.object,
    }),
    guests: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        guests: PropTypes.object,
    }),
    selectedShopID: PropTypes.string.isRequired,
    setCalendarViewType: PropTypes.func.isRequired,
    setCalendarCurrent: PropTypes.func.isRequired,
    setCalendarStart: PropTypes.func.isRequired,
    setCalendarEnd: PropTypes.func.isRequired,
    calendarConfig: PropTypes.shape({
        viewType: PropTypes.string,
        start: PropTypes.object,
        end: PropTypes.object,
        current: PropTypes.object,
    }).isRequired,

    newOrder: PropTypes.func.isRequired,
    newOrderConfig: PropTypes.shape({
        condition: PropTypes.bool
    }).isRequired,
    toggleNotifier: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const {
        calendarConfig,
        selectedShopID,
        scheduleReducer,
        staffReducer,
        serviceReducer,
        guestReducer,
        newOrderConfig,
    } = state;

    const { schedules } = scheduleReducer[selectedShopID] || { isFetching: false, didInvalidate: false, schedules: { data: require('../../data/schedules').default } };
    const { staffs } = staffReducer[selectedShopID] || { isFetching: false, didInvalidate: false, staffs: { data: require('../../data/staffs').default } };
    const { services } = serviceReducer[selectedShopID] || { isFetching: false, didInvalidate: false, services: { data: require('../../data/services').default } };
    const { guests } = guestReducer[selectedShopID] || { isFetching: false, didInvalidate: false, guests: { data: require('../../data/guests').default } };
    // const { schedules } = { isFetching: false, schedules: { data: require('../../data/schedules').default } };
    // const { staffs } = { isFetching: false, staffs: { data: require('../../data/staffs').default } };
    // const { services } = { isFetching: false, services: { data: require('../../data/services').default } };
    // const { guests } = { isFetching: false, guests: { data: require('../../data/guests').default } };

    return {
        isModalNotifier: state.notifier.isModalNotifier,
        selectedShopID,
        schedules,
        staffs,
        services,
        calendarConfig,
        guests,
        newOrderConfig,
    };
};

const mapDispatchToProps = dispatch => ({
    fetchSchedulesIfNeeded: shopID => (dispatch(actions.fetchSchedulesIfNeeded(shopID))),
    fetchStaffsIfNeeded: shopID => (dispatch(actions.fetchStaffsIfNeeded(shopID))),
    fetchServicesIfNeeded: shopID => (dispatch(actions.fetchServicesIfNeeded(shopID))),
    fetchGuestsIfNeeded: shopID => (dispatch(actions.fetchGuestsIfNeeded(shopID))),

    setCalendarViewType: viewType => (dispatch(actions.setCalendarViewType(viewType))),
    setCalendarStart: start => (dispatch(actions.setCalendarStart(start))),
    setCalendarEnd: end => (dispatch(actions.setCalendarEnd(end))),
    setCalendarCurrent: current => (dispatch(actions.setCalendarCurrent(current))),

    newOrder: params => (dispatch(actions.newOrderInit(params))),
    toggleNotifier: condition => dispatch(actions.modalNotifier({ isModalNotifier: condition })),
    // or simply do...
    // actions: bindActionCreators(actions, dispatch)
    // this will dispatch all action
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
