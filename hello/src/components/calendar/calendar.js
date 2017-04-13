import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import moment from 'moment';
import Products from '../../data/products.json';
import * as Functions from '../../js/common';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import DatePicker from './datePicker';
import ModalConfirm from './modal/modalConfirm';
import RenderEventConfirm from './modal/renderEventConfirm';
import UserCard from '../userCard';
// import Notifier from '../../components/notifier';
import DailyCalendar from './fullCalendar/dailyCalendar';
import WeeklyCalendar from './fullCalendar/weeklyCalendar';
import Experts from '../../data/experts.json';
import Events from '../../data/event.json';
import 'fullcalendar-scheduler/node_modules/fullcalendar/dist/fullcalendar.min.css';
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
        expert: undefined,
        start: undefined,
        event: undefined
      }
    };
    this.newOrder = this.newOrder.bind(this);
    this.newOrderCancel = this.newOrderCancel.bind(this);
    this.changeView = this.changeView.bind(this);
    this.returnNewID = this.returnNewID.bind(this);
    this.timelineWasMount = this.timelineWasMount.bind(this);
    this.returnNewOrderStates = this.returnNewOrderStates.bind(this);
    this.returnEventObj = this.returnEventObj.bind(this);
    this.setTimelineDate = this.setTimelineDate.bind(this);
    this.getExpert = this.getExpert.bind(this);
  }

  // Daily Timeline 에서 예약생성 모듈로 접근시 실행하는 함수.
  newOrder(options) {
    this.setState({
      isNewOrder: true,
      newOrderStates: {
        type: options.type,
        expert: options.expert
      }
    }, () => this.changeView('agendaWeekly'));
  }

  returnNewID() {
      //임시 아이디생성 ( dom의 id는 'ID_생성된아이디' 값 으로 제어가능 );
      return Math.floor((Math.random() * 99999) + 1);
  }

  getExpert(id) {
    let ExpertsArray = Experts || this.props.staffs.data;
      for (let i = 0; i < ExpertsArray.length; i++) {
          if (ExpertsArray[i].id === id) {
              return ExpertsArray[i];
          }
      }
  }

  changeView (type) {
    this.setState({
      viewType: type
    });
  }

  setTimelineDate (date) {
    this.setState({
      viewDate: date
    });
  }

  returnEventObj (newEvent) {
      return {
          product: newEvent.newOrderProduct,
          name: (newEvent.newOrderMember.name || newEvent.newOrderUserName),
          phone: newEvent.newOrderMember.phone,
          picture: newEvent.newOrderMember.picture,
          rating: newEvent.newOrderMember.rating,
          start: newEvent.newOrderStart,
          end: newEvent.newOrderEnd,
          comment: newEvent.newOrderComment,
          resourceId: (newEvent.newOrderExpert.id || newEvent.resourceId)
      };
  }

  timelineWasMount (view) {
    setTimeout(function(){
      $('.nav-reservation > a').addClass('active');
    },0);
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

  returnNewOrderStates () {
    return this.state.newOrderStates;
  }

  toggleCreateOrderFixedUi () {
    //우측하단 예약생성 고정버튼 Ui toggle
    $('.create-order-wrap.fixed .create-order-ui').toggle();

    $('.create-order-wrap.fixed').bind('mouseleave', function() {
        $('.create-order-wrap.fixed .create-order-ui').hide();
    });
  }

  // 타임라인 예약생성 버튼의 data-date 값을 set/return
  mouseenterSlotTime(isSetting, date) {
    var createButtonElem =  $('.create-order-wrap.timeline');
    if (isSetting) {
      $(createButtonElem).attr('data-date', date);
    } else {
      console.log('어쩌라구 어');
      return $(createButtonElem).attr('data-date');
    }
  }

  newOrderCancel() {
      let {Calendar} = this.refs;
      /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
      $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
      // 시작시간을 미리 선택하지않고 이벤트를 생성중에 취소할 경우
      if (this.state.isNotAutoSelectTime || this.state.isEditEvent) {
          this.resetOrder();
      } else if (this.state.newEventId) {
          // enable editable
          let evt = $(Calendar).fullCalendar('clientEvents', this.state.newEventId);
          evt.editable = true;
          $(Calendar).fullCalendar('updateEvent', evt);
          // $(Calendar).fullCalendar('option', 'editable', true);
      }

      $('.create-order-wrap.fixed').removeClass('hidden');
      $('#render-confirm').hide();

      this.setState({isNewOrder: false});
  }

  // Expert를 Priority기준으로 재배열 한다
  sortExpert(allOfExperts) {
      //let expertNewArray = [];
      let expertNewArray = allOfExperts.sort(function(a, b) {
          return a.priority < b.priority
              ? -1
              : a.priority > b.priority
                  ? 1
                  : 0;
      });
      return expertNewArray;
  }

  componentDidMount() {
    const { selectedShop } = this.props;
    const component = this;

    this.props.fetchSchedulesIfNeeded(selectedShop);
    this.props.fetchStaffsIfNeeded(selectedShop);

  }

  render () {

    this.sortExpert(Experts);

    const CreateOrderButtonFixed = (_this) =>  {
      return (
        <div className="create-order-wrap fixed">
            <div className="create-order-slot">
                <button className="create-button" onClick={this.toggleCreateOrderFixedUi}>
                    <span>+</span>
                </button>
            </div>
            <div className="create-order-ui">
                <button onClick={() => _this.newOrder('notAutoSelectTime')} className="ui-reservation">예약생성</button>
                <button onClick={() => _this.createOfftime('weekly')} className="ui-offtime">OFF TIME 생성</button>
            </div>
        </div>
      )
    }

    const CreateOrderButtonTimeline = (_this) => {
        return (
          <div data-date="" className={`create-order-wrap timeline${_this.state.isCreateOfftime
              ? " off-time"
              : _this.state.isNotAutoSelectTime
                  ? " has-card"
                  : _this.state.isEditEvent
                      ? " edit"
                      : ""}`}>
              <div className="create-order-inner">
                  <div className="create-order-slot">
                      {_this.state.isCreateOfftime
                          ? (
                              <button className="create-button" onClick={() => _this.createOfftime('render', 'offtime')}>
                                  <i className="time"></i>
                                  <span>+</span>
                              </button>
                          )
                          : _this.state.isNotAutoSelectTime || _this.state.isEditEvent
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
                                  <button onClick={_this.newOrder} className="ui-reservation">예약생성</button>
                                  <button onClick={() => _this.createOfftime('timeline')} className="ui-offtime">OFF TIME 생성</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    };

    const UserCardComponent = (_this) => {
      if (!_this.state.isUserCard) return '';
      return (
        <UserCard
          cards={Events}
          isUserCard={(bool) => _this.isUserCard(bool)}
          onRemoveEvent={(event) => _this.removeConfirm(event)}
          onEditEvent={(event) => _this.editEvent(event)}
          onEditCustomer={""}
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
          options={_this.state.newEvents}
          selectedEvent={_this.state.selectedEvent}
          editedDate={_this.state.editedDate}
          newEventId={_this.state.newEventId}
          isNotAutoSelectTime={_this.state.isNotAutoSelectTime}
          modalConfirmHide={_this.modalConfirmHide}
          step_render={(bool, newEventId, type) => _this.step_render(bool, newEventId, type)}
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
          modalConfirm={_this.step_modal}
          newEventId={_this.state.newEventId}
        />
      )
    }

    // Daily, Weekly FullCalendar 공통 옵션
    const fc_options = {
        schedulerLicenseKey: '0912055899-fcs-1483528517',
        resourceOrder: 'priority', // expert의 정렬 순서를 무엇을 기준으로 할지 정함
        defaultDate: moment(this.state.viewDate), //기본 날짜
        filterResourcesWithEvents: false, // 이벤트가 없는 expert를 숨길지 여부
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
        //businessHours: {},       //샵 영업시간 지정 (모든 Expert 의 업무시간이 동일한경우) (expert 별로 지정할경우는 resources 에서 선언)
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
      events: Events,
      experts: Experts || this.props.staffs.data,
      changeView: this.changeView,
      returnEventObj: this.returnEventObj,
      returnNewID: this.returnNewID,
      getExpert: this.getExpert,

      getSlotTime: this.mouseenterSlotTime,
      defaultExpert: function() { _.isEmpty(this.props.staffs) ? Experts[0] : this.props.staffs.data },

      getCreateOrderButtonFixed:    function(t) { return CreateOrderButtonFixed(t) },
      getCreateOrderButtonTimeline: function(t) { return CreateOrderButtonTimeline(t) },
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
        newOrder={ (options) => this.newOrder(options) }
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
        {viewview}
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
  staffs: PropTypes.object.isRequired,
  schedules: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  const {
    selectedShop,
    getSchedulesBySelectedShopID,
    getStaffsBySelectedShopID
  } = state;

  const {
    schedules,
  } = getSchedulesBySelectedShopID[selectedShop] || {
    isFetching: false,
    schedules: {}
  };

  const {
    staffs,
    isFetching
  } = getStaffsBySelectedShopID[selectedShop] || {
    isFetching: false,
    staffs: {}
  }

  return {
    isFetching,
    selectedShop,
    schedules,
    staffs,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSchedulesIfNeeded: shopID => (dispatch(actions.fetchSchedulesIfNeeded(shopID))),
    fetchStaffsIfNeeded: shopID => (dispatch(actions.fetchStaffsIfNeeded(shopID))),
    // or simply do...
    // actions: bindActionCreators(acations, dispatch)
    // this will dispatch all action
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
