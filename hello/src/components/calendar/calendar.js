import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import * as Functions from '../../js/common';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import DatePicker from './datePicker';
import ModalConfirm from './modal/modalConfirm';
import RenderEventConfirm from './modal/renderEventConfirm';
import UserCard from '../userCard';
// import Notifier from '../../components/notifier';
import DailyCalendar from './fullCalendar/dailyCalendar';
import WeeklyCalendar from './fullCalendar/weeklyCalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import '../../css/fullcalendar-scheduler-customizing.css';
import _ from 'lodash';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType : this.props.defaultView, // state에 의해 타임라인 view를 렌더링함 [agendaDay or agendaWeekly]
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
      //임시 아이디생성 ( dom의 id는 'ID_생성된아이디' 값 으로 제어가능 );
      return Math.floor((Math.random() * 99999) + 1);
  }

  runUserCardSlide(t, calSchedule, jsEvent, view) {
    let selectedDate = moment(calSchedule.start);
    // 더블클릭으로 선택된 이벤트객체를 가져옵니다
    let selectedCard = calSchedule;
    // 선택된 이벤트객체의 리소스ID에 맞는 expert id를 찾아 가져옵니다
    let selectedStaff  = $(t.refs.Calendar).fullCalendar('getResourceById', selectedCard.resourceId);

    // userCard 컴포넌트의 초기값을 전달한다
    t.isUserCard(true, {
        selectedDate: selectedDate,
        selectedCard: selectedCard,
        selectedStaff: selectedStaff
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

    switch(calendarConfig.viewType) {
      case "agendaDay" :
        if(momentDate.isBefore(calendarConfig.start))
          this.props.setCalendarStart(momentDate);
        if(momentDate.isAfter(calendarConfig.end))
          this.props.setCalendarEnd(momentDate.add('7', 'days'));
        break;
      case "agendaWeek":
        break;
      default:
        break;
    }

    this.props.fetchSchedulesIfNeeded(selectedShopID);
  }

  setTimelineDate(date) {
    this.setState({
      viewDate: date
    });
  }

  returnScheduleObj(newSchedule) {
      return {
          reservation_dt: moment(newSchedule.newOrderStart).format('YYYY-MM-DD'),
          shop_id: null,
          start_time: moment(newSchedule.newOrderStart).format('HH:mm'),
          end_time: moment(newSchedule.newOrderEnd).format('HH:mm'),
          user_id: null,
          guest_id: null,
          status: '01',
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

    var viewChangeButtons = $('.fc-toolbar.fc-header-toolbar .fc-right button');
    if (view === 'agendaDay') {
      $('.fc-agendaDayCustom-button').addClass('fc-state-active');
    } else {
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
    //우측하단 예약생성 고정버튼 Ui toggle
    $('.create-order-wrap.fixed .create-order-ui').toggle();

    $('.create-order-wrap.fixed').bind('mouseleave', function() {
        $('.create-order-wrap.fixed .create-order-ui').hide();
    });
  }

  // 타임라인 예약생성 버튼의 data-date 값을 set/return
  mouseenterSlotTime(isSetting, date) {
    const createButtonElem = $('.create-order-wrap.timeline');
    if (isSetting) {
      return $(createButtonElem).attr('data-date', date);
    } else {
      return $(createButtonElem).attr('data-date');
    }
  }

  newOrderCancel() {
      let {Calendar} = this.refs;
      /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
      $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
      // 시작시간을 미리 선택하지않고 이벤트를 생성중에 취소할 경우
      if (this.state.unknownStart || this.state.isEditEvent) {
          this.resetOrder();
      } else if (this.state.newScheduleID) {
          // enable editable
          let evt = $(Calendar).fullCalendar('clientSchedule', this.state.newScheduleID);
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

  // Expert를 Priority기준으로 재배열 한다
  sortExpert(allOfStaff) {
      if(_.isEmpty(allOfStaff))
        return;
      //let staffNewArray = [];
      let staffNewArray = allOfStaff.sort(function(a, b) {
          return a.priority < b.priority
              ? -1
              : a.priority > b.priority
                  ? 1
                  : 0;
      });
      return staffNewArray;
  }

  // GNB 예약 활성/비활성화
  activeGnb(view, condition) {
    if(!condition) {
      $('.nav-reservation a').removeClass('active');
    } else {
      $('.nav-reservation > a').addClass('active');
      $('.nav-reservation .header-nav-sub a').removeClass('active');
      if (view == 'agendaDay') {
        $('.nav-daily > a').addClass('active');
      } else {
        $('.nav-overview > a').addClass('active');
      }
    }
  }

  componentDidMount() {
    const { selectedShopID } = this.props;
    this.props.fetchSchedulesIfNeeded(selectedShopID);
    this.props.fetchStaffsIfNeeded(selectedShopID);
    this.props.fetchServicesIfNeeded(selectedShopID);
  }

  componentWillUnmount() {
    this.activeGnb(null, false);
  }

  fetchSchedule() {
    const { selectedShopID } = this.props;
    this.props.fetchSchedulesIfNeeded(selectedShopID);
  }

  render() {
    this.sortExpert(this.props.staffs.data);

    const CreateOrderButtonFixed = (_this) =>  {
      return (
        <div className="create-order-wrap fixed">
            <div className="create-order-slot">
                <button className="create-button" onClick={this.toggleCreateOrderFixedUi}>
                    <span>+</span>
                </button>
            </div>
            <div className="create-order-ui">
                <button onClick={() => _this.newOrder('unknownStart')} className="ui-reservation">예약생성</button>
                <button onClick={() => _this.bindNewOfftime('weekly')} className="ui-offtime">OFF TIME 생성</button>
            </div>
        </div>
      )
    }

    const CreateOrderButtonTimeline = (_this, view) => {
        return (
          <div data-date="" className={`create-order-wrap timeline${_this.state.isCreateOfftime
              ? " off-time"
              : _this.state.unknownStart
                  ? " has-card"
                  : _this.state.isEditEvent
                      ? " edit"
                      : ""}`}>
              <div className="create-order-inner">
                  <div className="create-order-slot">
                      {_this.state.isCreateOfftime && view === 'agendaWeekly'
                          ? (
                              <button className="create-button" onClick={() => _this.bindNewOfftime('render', 'offtime')}>
                                  <i className="time"></i>
                                  <span>+</span>
                              </button>
                          )
                          : (_this.state.unknownStart || _this.state.isEditEvent) && view === 'agendaWeekly'
                              ? (
                                  <button className="create-button create-event">
                                      <i className="time"></i>
                                      <span>+</span>
                                  </button>
                              )
                              : (
                                  <button className="create-button" onClick={ (e) => {
                                      _this.toggleCreateOrderUi(e);
                                    }}>
                                      <i className="time"></i>
                                      <span>+</span>
                                  </button>
                              )
                          }
                      <div className="create-order-ui-wrap">
                          <div className="create-order-ui-inner">
                              <div className="create-order-ui">
                                  <button onClick={() => _this.newOrder(null)} className="ui-reservation">예약생성</button>
                                  <button onClick={() => _this.bindNewOfftime('timeline')} className="ui-offtime">OFF TIME 생성</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    };

    const TodayTimelineButton = (_this) => {
      if (moment(_this.state.timelineDate).isSame(moment(new Date), 'day')) {
        return (
          <div className="fc-today-timeline-button-wrap today">
            <button className="fc-today-timeline-button today" disabled={true}>
              {moment(new Date()).format('DD')}
            </button>
          </div>
        )
      } else {
        return (
          <div className="fc-today-timeline-button-wrap">
            <button className="fc-today-timeline-button" onClick={() =>_this.changeDate(moment(new Date))}>
              {moment(new Date()).format('DD')}
            </button>
          </div>
        )
      }
    }

    const UserCardComponent = (_this) => {
      if (!_this.state.isUserCard) return '';
      return (
        <UserCard
          schedules={this.props.schedules.data}
          services={this.props.services.data}
          staffs={this.props.staffs.data}
          isUserCard={(bool) => _this.isUserCard(bool)}
          onRemoveEvent={(schedule) => _this.removeConfirm(schedule)}
          onEditEvent={(schedule) => _this.editEvent(schedule)}
        />
      )
    }

    const DatePickerComponent = (_this) => {
      if (!_this.state.isChangeDate) return '';
      return (
          <DatePicker
            selectedDate={_this.state.timelineDate}
            onChange={_this.changeDate}
            onClose={() => _this.isChangeDate(false)}
            className="timeline-date-picker"
          />
      )
    }

    const ModalConfirmComponent = (_this) => {
      if (!_this.state.isModalConfirm) return '';
      return (
        <ModalConfirm
          options={_this.state.newSchedule}
          selectedEvent={_this.state.selectedEvent}
          editedDate={_this.state.editedDate}
          newScheduleID={_this.state.newScheduleID}
          unknownStart={_this.state.unknownStart}
          modalConfirmHide={_this.modalConfirmHide}
          renderNewSchedule={(bool, newScheduleID, type) => _this.renderNewSchedule(bool, newScheduleID, type)}
          removeEvent={_this.removeEvent}
        />
      )
    }

    const RenderConfirmComponent = (_this, view) => {
      if (!_this.state.isRenderConfirm) return '';
      return (
        <RenderEventConfirm
          viewType={view}
          isModalConfirm={_this.state.isModalConfirm}
          modalConfirm={_this.beforeFinalConfirmRenderNewSchedule}
          newScheduleID={_this.state.newScheduleID}
        />
      )
    }

    // Daily, Weekly FullCalendar 공통 옵션
    const fc_options = {
        schedulerLicenseKey: `${ process.env.REACT_APP_FULLCALENDAR_LISENCE ? process.env.REACT_APP_FULLCALENDAR_LISENCE : 'GPL-My-Project-Is-Open-Source'}`,
        scheduleStatus: actions.ScheduleStatus,
        guestClass: actions.GuestClass,
        shopServices: this.props.services.data,
        resourceOrder: 'priority', // staff의 정렬 순서를 무엇을 기준으로 할지 정함
        defaultDate: moment(this.state.viewDate), //기본 날짜
        filterResourcesWithSchedule: false, // 이벤트가 없는 staff를 숨길지 여부
        locale: 'ko', //언어선택
        longPressDelay: 125, // touch delay
        eventOverlap: false, //중복되는 시간의 이벤트 수정 여부
        selectOverlap: false, //중복되는 시간의 이벤트 생성 여부
        slotEventOverlap: false, //중복시간의 슬롯을 오버랩킬지 여부
        //eventResourceEditable: ,//리소스간에 이벤트 이동이 가능한지 여부
        slotDuration: '00:10:00',
        snapDuration: '00:10:00',
        slotLabelInterval: '00:60:00', //캘린더 좌측 시간 label 시간간격마다 표시
        slotLabelFormat: 'h A', //캘린더 좌측 시간 label
        timeFormat: 'HH:mm', //slot 시간 단위
        columnFormat: 'D ddd', //캘린더 상단 날자
        //slotMinutes : 20,        //슬롯 생성 분단위 범위 설정 default :30
        //minTime: '09:00',        //예약가능한 최소 시작시간 지정 (출근시간)
        //maxTime: '18:00',        //예약마감시간 지정
        //businessHours: {},       //샵 영업시간 지정 (모든 Expert 의 업무시간이 동일한경우) (staff 별로 지정할경우는 resources 에서 선언)
        //eventConstraint: false,  //이벤트 수정을 특정 시간 내로 제한함 (businessHours 와 관련)
        nowIndicator: true,
        dragOpacity: 1,
        dragScroll: true,
        editable: true, //수정가능한지 여부
        selectable: false, //드래그로 날짜를 선택하여 추가기능 활성화
        selectHelper: true, //드래그시 배경색상 효과
        windowResizeDelay: 0, //윈도우 리사이즈시 캘린더 리사이징 딜레이
        handleWindowResize: true, //캘린더 resizable 여부
        allDayDefault: false
    };

    const commonViewProps = {
      fcOptions: fc_options,
      //schedule: _.isEmpty(this.props.schedules) ? Schedule : this.props.schedules.data,
      //staffs: _.isEmpty(this.props.staffs) ? Staff : this.props.staffs.data,
      schedules: this.props.schedules.data,
      staffs: this.props.staffs.data,
      services: this.props.services.data,
      changeView: this.changeView,
      changeDate: this.changeDate,
      returnScheduleObj: this.returnScheduleObj,
      returnNewID: this.returnNewID,

      getSlotTime: this.mouseenterSlotTime,
      // defaultStaff: function() { _.isEmpty(this.props.staffs) ? Staff[0] : this.props.staffs.data },
      defaultStaff: this.props.staffs[0],
      createNewSchedule: (scheduleData) => this.props.createNewSchedule(scheduleData),
      activeGnb: (view, condition) => this.activeGnb(view, condition),
      runUserCardSlide:             function(t, calSchedule, jsEvent, view) { this.runUserCardSlide(t, calSchedule, jsEvent, view) },

      getTodayTimelineButton:       function(t) { return TodayTimelineButton(t) },
      getCreateOrderButtonFixed:    function(t) { return CreateOrderButtonFixed(t) },
      getCreateOrderButtonTimeline: function(t, view) { return CreateOrderButtonTimeline(t, view) },
      getDatePickerComponent:       function(t) { return DatePickerComponent(t) },
      getUserCardComponent:         function(t) { return UserCardComponent(t) },
      getModalConfirmComponent:     function(t) { return ModalConfirmComponent(t) },
      getRenderConfirmComponent:    function(t, view) { return RenderConfirmComponent(t, view) }
    }

    const viewview = (
      <div className="viewview viewContainer">
        <dl>
          <dt>viewType : </dt> <dd>{this.state.viewType}</dd>
          <dt>viewDate : </dt> <dd>{this.state.viewDate.format('YYYY-MM-DD')}</dd>
          <dt>isNewOrder : </dt> <dd>{this.state.isNewOrder}</dd>
        </dl>
      </div>
    )

    const DailyTimeline = (
      <DailyCalendar
        {...commonViewProps}
        ref="daily"
        wasMount={ () => this.timelineWasMount('agendaDay') }
        setTimelineDate={ (date) => this.setTimelineDate(date) }
        newOrder={ (options) => this.newOrderByDailyTimeline(options) }
      />
    );

    const WeeklyTimeline = (
      <WeeklyCalendar
        {...commonViewProps}
        ref="weekly"
        wasMount={ () => this.timelineWasMount('agendaWeekly') }
        setTimelineDate={ (date) => this.setTimelineDate(date) }
        isBindedNewOrder={this.state.isNewOrder}
        getNewOrderStates={() => this.returnNewOrderStates()}
      />
    );

    return (
      <div className="calendar">
        {/*viewview*/}
        <div className="full-calendar">
          {
            this.state.viewType === 'agendaWeekly'
            ? WeeklyTimeline
            : DailyTimeline
          }
        </div>
      </div>
    );
  }
}

Calendar.PropTypes = {
  fetchSchedulesIfNeeded: PropTypes.func.isRequired,
  fetchStaffsIfNeeded: PropTypes.func.isRequired,
  fetchServicesIfNeeded: PropTypes.func,
  staffs: PropTypes.object.isRequired,
  schedules: PropTypes.object.isRequired,
  services: PropTypes.object,
  selectedShopID: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => {
  const {
    calendarConfig,
    selectedShopID,
    getSchedulesBySelectedShopID,
    getStaffsBySelectedShopID,
    getServicesBySelectedShopID,
  } = state;

  const { schedules } = getSchedulesBySelectedShopID[selectedShopID] || { isFetching: false, schedules: { data: require('../../data/schedules').default } };
  const { staffs } = getStaffsBySelectedShopID[selectedShopID] || { isFetching: false, staffs: { data: require('../../data/staffs').default } };
  const { services } = getServicesBySelectedShopID[selectedShopID] || { isFetching: false, services: { data: require('../../data/services').default } };
  // const { schedules } = { isFetching: false, schedules: { data: require('../../data/schedules').default} };
  // const { staffs } = { isFetching: false, staffs: { data: require('../../data/staffs').default} };
  // const { services } = { isFetching: false, services: { data: require('../../data/services').default} };

  return {
    selectedShopID,
    schedules,
    staffs,
    services,
    calendarConfig,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSchedulesIfNeeded: shopID => (dispatch(actions.fetchSchedulesIfNeeded(shopID))),
    fetchStaffsIfNeeded: shopID => (dispatch(actions.fetchStaffsIfNeeded(shopID))),
    fetchServicesIfNeeded: shopID => (dispatch(actions.fetchServicesIfNeeded(shopID))),
    createNewSchedule: scheduleData => (dispatch(actions.createNewSchedule(scheduleData))),

    setCalendarViewType: viewType => (dispatch(actions.setCalendarViewType(viewType))),
    setCalendarStart: start => (dispatch(actions.setCalendarStart(start))),
    setCalendarEnd: end => (dispatch(actions.setCalendarEnd(end))),
    setCalendarCurrent: current => (dispatch(actions.setCalendarCurrent(current))),
    // or simply do...
    // actions: bindActionCreators(acations, dispatch)
    // this will dispatch all action
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
