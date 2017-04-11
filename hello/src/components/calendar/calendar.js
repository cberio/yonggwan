import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import moment from 'moment';
import Products from '../../data/products.json';
import * as Functions from '../../js/common';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
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
    };
    this.changeView = this.changeView.bind(this);
    this.returnNewID = this.returnNewID.bind(this);
    this.returnEventObj = this.returnEventObj.bind(this);
    this.getExpert = this.getExpert.bind(this);
    this.bindTimelineAccess = this.bindTimelineAccess.bind(this);
  }


  // 타임라인 빈 슬롯에 마우스오버시 신규생성 버튼 활성화
  bindTimelineAccess(__this) {
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

    // Daily, Weekly FullCalendar 공통 옵션
    const fc_options = {
        schedulerLicenseKey: '0912055899-fcs-1483528517',
        resourceOrder: 'priority', // expert의 정렬 순서를 무엇을 기준으로 할지 정함
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

    const DailyTimeline = (
      <DailyCalendar
        ref="daily"
        fcOptions={fc_options}
        events={Events}
        experts={Experts || this.props.staffs.data}
        changeView={this.changeView}
        returnEventObj={this.returnEventObj}
        returnNewID={this.returnNewID}
        getExpert={this.getExpert}
        defaultExpert={_.isEmpty(this.props.staffs) ? Experts[0] : this.props.staffs.data }
      />
    );

    const WeeklyTimeline = (
      <WeeklyCalendar
        ref="weekly"
        fcOptions={fc_options}
        events={Events}
        experts={Experts || this.props.staffs.data}
        changeView={this.changeView}
        returnEventObj={this.returnEventObj}
        returnNewID={this.returnNewID}
        getExpert={this.getExpert}
        defaultExpert={_.isEmpty(this.props.staffs) ? Experts[0] : this.props.staffs.data }
      />
    );

    return (
      <div className="calendar">
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
