import React, { Component } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import moment from 'moment';
import update from 'react-addons-update';
import DatePicker from '../datePicker';
import Experts from '../../../data/experts.json';
import Products from '../../../data/products.json';
import NewOrder from '../newOrder';
import ModalConfirm from '../modal/modalConfirm';
import RenderEventConfirm from '../modal/renderEventConfirm';
import UserCard from '../../userCard';
import Notifier from '../../../components/notifier';
import 'jquery.nicescroll';
import 'fullcalendar-scheduler';
import 'fullcalendar-scheduler/node_modules/fullcalendar/dist/fullcalendar.min.css';
import '../../../css/fullcalendar-scheduler-customizing.css';

class FullCalendar extends Component {
  constructor (props) {
    super (props);
    this.state = {
      // Calendar view type states
      viewType : undefined,
      viewTypePrev : undefined,
      viewTypeOrder : undefined,
      // conditions
      isNewOrder : false,
      isModalConfirm : false,
      isRenderConfirm: false,
      isUserCard : false,
      isChangeDate : false,
      isEditEvent : false,
      isCreateOfftime: false,
      isRequestReservation : false,
      isNotAutoSelectTime: false,
      isAbleBindRemoveEvent: false,
      isDragging: false,
      // Expert states
      defaultExpert : undefined,                // 관리자가 설정한 1순위 expert
      priorityExpert : undefined,               // 타임라인 렌더링시 0순위로 기준이 되는 expert (일부 이벤트 등록시 해당된다)
      // prevExpert: this.props.defaultExpert,  // 이전에 렌더링 된 expert (현재 해당 state 는 사용하지않음)
      // prevExpertAll: undefined,              // 이전에 렌더링 된 experts (현재 해당 state 는 사용하지않음)
      renderedExpert : [],                      // 현재 타임라인에 렌더링 된 expert
      lastExpert: undefined,                    // 타임라인을 재 렌더링 할때 기준이되는 expert (해당 expert로 렌더링됨)
      selectedExpert : undefined,               // 타임라인에 마우스 오버시 해당 타임라인의 expert
      // ... etc
      selectedDate: undefined,
      editedDate: undefined,
      selectedEvent: undefined,
      renderedEvent: undefined,
      newEvents: undefined,
      newEventId: undefined,
      newEventProductTime: undefined,
      newEventSelector: undefined
    };
    // event binding
    this.isNewOrder = this.isNewOrder.bind(this);
    this.step_render = this.step_render.bind(this);
    this.step_modal = this.step_modal.bind(this);
    this.step_confirm = this.step_confirm.bind(this);
    this.backToOrder = this.backToOrder.bind(this);
    this.modalConfirmHide = this.modalConfirmHide.bind(this);
    this.setCalendarColumn = this.setCalendarColumn.bind(this);
    this.setCalendarHeight = this.setCalendarHeight.bind(this);
    this.changeDateBasic = this.changeDateBasic.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.isUserCard = this.isUserCard.bind(this);
    this.renderExpert = this.renderExpert.bind(this);
    this.changeExpert = this.changeExpert.bind(this);
    this.changeView = this.changeView.bind(this);
    this.createOfftime = this.createOfftime.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.createNewEventId = this.createNewEventId.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.removeConfirm = this.removeConfirm.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.getExpert = this.getExpert.bind(this);
    this.sortExpert = this.sortExpert.bind(this);
    this.toggleCreateUi = this.toggleCreateUi.bind(this);
    this.checkRenderedDate = this.checkRenderedDate.bind(this);
    this.initializeViewRender = this.initializeViewRender.bind(this);
    this.autoScrollTimeline = this.autoScrollTimeline.bind(this);
    this.controlerInit = this.controlerInit.bind(this);
    this.controler = undefined; // overview timeline 상단 날자 스크롤러(컨트롤러 obj)
    this.test = this.test.bind(this);
  }

  test (e) {
    let { Calendar } = this.refs;
    let _component = this;
  }

  initializeViewRender (viewType) {
    let { Calendar } = this.refs;
  }

  // 주단위 에서의 상단 controler 스크롤러 바인딩
  controlerInit () {
    let { Calendar } = this.refs;
    let _component = this;

    var controlerElem = $('.fc-head-container .fc-row.fc-widget-header'),
        timeline = $('.fc-scroller.fc-time-grid-container'),
        timelineHours = $('.fc-slats-clone'),

        isScrollingControler = false,
        isScrollingTimeline = false,

        scrollDayFormat = $(Calendar).fullCalendar('getDate').add(5, 'day').format('YYYY-MM-DD'),
        initOffsetLeft = $('.fc-agendaWeekly-view .fc-bg td[data-date="'+ scrollDayFormat + '"]').offset().left;

    // 날짜 텍스트 드래그 색상 하이라이팅 방지
    $(controlerElem).find('th').on({
      dragstart:   function () { return false; },
      selectstart: function () { return false; }
    });

    this.controler = $(controlerElem);
    $(controlerElem).niceScroll({
      autohidemode: false,
      touchbehavior: true,
      cursordragontouch: true
    });

    // init controler
    $(controlerElem).scroll(function(){
      if (isScrollingTimeline) return false;
      isScrollingControler = true;

      var thisLeft = $(this).scrollLeft();
      $(timeline).scrollLeft(thisLeft);

      isScrollingControler = false;
    });



    // init timeline
    var lastX = $(timeline).scrollLeft();
    var lastY = $(timeline).scrollTop();
    var direction;

    $(timeline).scroll(function(){
      if (isScrollingControler) return false;
      isScrollingTimeline = true;

      var thisX = $(this).scrollLeft();
      var thisY = $(this).scrollTop();

      if      (lastX < thisX) { direction = 'right'; }
      else if (lastX > thisX) { direction = 'left'; }
      else if (lastY < thisY) { direction = 'bottom'; }
      else if (lastY > thisY) { direction = 'top'; }

      // 이벤트를 드래그 시 빠르게 스크롤하기 위함
      // if(_component.state.isDragging) {
      //   switch (direction) {
      //     case 'right':
      //       $(timeline).scrollLeft(thisX +10);
      //       break;
      //     case 'left':
      //       $(timeline).scrollLeft(thisX -10);
      //       break;
      //     case 'top':
      //       $(timeline).scrollTop(thisY +10);
      //       break;
      //     case 'bottom':
      //       $(timeline).scrollTop(thisY -10);
      //       break;
      //     default:
      //       break;
      //   }
      // }

      $(controlerElem).scrollLeft(thisX);

      lastX = thisX;
      lastY = thisY;

      isScrollingTimeline = false;
    });

  }

  checkRenderedDate (date) {
    let { Calendar } = this.refs;
    var dayDates = $(Calendar).fullCalendar('getView').dayGrid.dayDates;
    var renderedDates = dayDates.map(function(elem, i){
      return elem.format();
    });

    if (renderedDates.indexOf(date.format('YYYY-MM-DD')) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  // 일, 주단위 타임라인 스크롤 트리거 공통
  autoScrollTimeline (selector, getTimeout, callback) {
    var timeline = $('.fc-time-grid-container');
    var timeout;
    if (getTimeout > 0) { timeout = getTimeout; }
    else                { timeout = 0; }

    setTimeout(function(){
      console.log('Top:' + $(selector).offset().top, 'Left:' + $(selector).offset().left);
      $(timeline).stop().animate({
        scrollTop: $(selector).offset().top,
        scrollLeft: $(selector).offset().left
      }, 400, function (){
        if (callback) callback();
      });
    }, timeout);
  }


  toggleCreateUi () {
    // Ui 버튼 toggle
    $('.timeline .create-order-ui-wrap').toggle();
    // 타임라인 내 신규예약생성 버튼 클릭시 z index 스타일 클래스 추가
    if (this.state.viewType === 'agendaWeekly') {
      $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').addClass('create-order-overlap');
    } else if (this.state.renderedExpert.length <= 1) {
      $('.fc-agendaDay-view .fc-time-grid .fc-slats').addClass('create-order-overlap');
    }
  }

  // Daily의 다수의 Expert 타임라인을 렌더링한경우 스크린에 최적화하여 컬럼을 정렬한다
  setCalendarColumn () {
    if (this.state.viewType === 'agendaWeekly') return false;
    let { Calendar } = this.refs;
    let windowWidth = $(window).width();
    let headerWidth = $('#header').width();
    let columnWidth = null;
    let columnMinWidth = 450;
    let timeSlatWidth = 50;
    let expertLength = $(Calendar).fullCalendar('getResources').length;
    //console.log(windowWidth, headerWidth);

    if (expertLength >= 2 && windowWidth < ( headerWidth + timeSlatWidth + (columnMinWidth * expertLength)) ) {
      $('.fc-view-container .fc-agendaDay-view').width(timeSlatWidth + (columnMinWidth * expertLength));
    } else {
      $('.fc-view-container .fc-agendaDay-view').attr('style', '');
    }

    // let cloneTimeGrid = $('.fc-time-grid > .fc-slats').clone();
    // $('.fc-time-grid > .fc-slats').after($(cloneTimeGrid).addClass('fc-slats-clone'));

  }

  // 예약 생성 단계에 따른 Calendar Height 사이즈를 조절합니다
  setCalendarHeight (step) {
    let { Calendar } = this.refs;
    let expertUiHeight = this.state.viewType === 'agendaDay' ? 0 : 38;
    // 예약 3단계 이면서, 시작시간을 미리 선택하지 않는 예약생성 단계 이거나 혹은 예약변경 인 경우
    if (step === 3 && (this.state.isNotAutoSelectTime || this.state.isEditEvent)) {
      $(Calendar).fullCalendar('option', 'height', (window.innerHeight -324) -expertUiHeight); // 324 = step3의 'NewOrder' layer height
    } else {
      $(Calendar).fullCalendar('option', 'height', window.innerHeight -expertUiHeight);
    }
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

  createNewEventId () {
    //임시 아이디생성 ( dom의 id는 'ID_생성된아이디' 값 으로 제어가능 );
    return Math.floor((Math.random() * 99999) + 1);
  }

  //예약카드 삭제 1단계
  removeConfirm (event) {
    this.props.isModalConfirm('removeEvent');
    this.setState({
      isModalConfirm: true,
      selectedEvent: event
    });
  }
  //예약카드 삭제 2단계 최종삭제
  removeEvent (event) {
    let _component = this;
    let { Calendar } = this.refs;
    let eventId = event ? event.id : $(Calendar).fullCalendar('removeEvents', [_component.state.selectedEvent.id]);
    this.modalConfirmHide();
    this.setState({
      selectedEvent: undefined
    });
    if (event) { this.props.guider(event.name + '님의 ' + event.product + ' 예약이 삭제되었습니다!'); }
    else       { this.props.guider(this.state.selectedEvent.name +'님의 ' + this.state.selectedEvent.product + ' 예약이 삭제되었습니다!'); }
  }

  // 생성 A___예약시작시간을 미리 '선택하하지 않고' 예약생성할 경우__1 : 빈 예약타임의 슬롯을 활성화 시킨다
  createEvent (bool, newEvent) {
    let _component = this;
    let { Calendar } = this.refs;
    // 취소일경우 초기화
    if (bool === false) {
      this.resetOrder();
    } else {
      // 현재 view type이 daily timeline 일 경우 overview timeline으로 view type 변경
      if (this.state.viewType === 'agendaDay') {
        this.setState({
          lastExpert: newEvent.newOrderExpert
          //,viewType: 'agendaWeekly'
        }, () => {
          this.changeView('agendaWeekly');
          this.eventSlotHighlight(true, 'event', newEvent.newOrderProduct);
        });
      } else {
        // 선택한 expert로 view를 rendering합니다
        $('.expert-each input#expert_w_' + newEvent.resourceId).prop('checked', true);
        this.changeExpert(newEvent.newOrderExpert, undefined, function(){
          _component.expertInputCheck('direct');
          _component.eventSlotHighlight(true, 'event', newEvent.newOrderProduct);
        });
      }
      let newEventId = this.createNewEventId();
      let insertEvent = $.extend(this.returnEventObj(newEvent),{
        id: newEventId
      });
      this.setState({
        isNotAutoSelectTime: true,
        newEventProductTime: newEvent.newOrderTime
      });
      // button ui hidden
      $('.create-order-wrap.fixed').addClass('hidden');

      // event slot highlight button binding
      $('.create-order-wrap.timeline button.create-event').ready(function () {
        $('.create-order-wrap.timeline button.create-event').unbind('click');
        $('.create-order-wrap.timeline button.create-event').bind('click', function () {
          insertEvent = $.extend(insertEvent, {resourceId: _component.state.selectedExpert.id });
          _component.fakeRenderNewEvent(insertEvent, newEventId, 'weekly');
           $(this).unbind('click');
        });
      });
    }
  }

  // 생성 B___예약시작시간을 미리 선택하여 예약생성할 경우___1 : 이벤트를 임시로 렌더링한다
  step_confirm (bool, newEvent) {
    let _component = this;
    let { Calendar } = this.refs;
    this.setState({ isRenderConfirm : false });

    if (!bool) return; //취소하는 경우

    // '이벤트 수정' 중에 이벤트 다시 렌더링한 경우: 배경마스크 및 이벤트 초기화
    if (this.state.isEditEvent) {
      let id = this.state.newEventId || this.state.selectedEvent.id;
      //this.eventSlotHighlight(false, 'edit');
      $('.create-order-wrap.timeline').removeClass('edit');
      $('.create-order-wrap.timeline button.create-event').unbind('click');
      $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
      // 수정전의 이벤트 레이어 시각적 숨김
      $('#render-confirm').hide();
      $('.modal-mask.mask-event').css('top','376px');
      $('.fc-event#ID_'+ this.state.selectedEvent.id).remove();
      $('.fc-event#ID_'+ this.state.selectedEvent.id + '_FAKE').remove();
      $(Calendar).fullCalendar('removeEvents', [id]);
      $('.render-confirm-inner').find('.cancel').unbind('click');
    }

    let newEventId = this.createNewEventId();
    let insertEvent = $.extend(this.returnEventObj(newEvent),{
      id: newEventId
    });

    this.setState({
      newEvents: $.extend(insertEvent, {class: Functions.getProductColor(insertEvent.product, Products)}),
      newEventId: newEventId,
      newEventSelector: '#ID_' + newEventId
    }, () => {
      /// ↓↓↓↓↓↓↓↓↓ 예약생성을 할 이벤트의 Expert 타임라인을 렌더링한다  ↓↓↓↓↓↓↓↓///
      // 1. weekly 생성인 경우
      if (this.state.viewType === 'agendaWeekly') {
        // 현재 렌더링된 expert가 아닌 다른 expert로 생성하는 경우: expert view change
        if ((this.state.lastExpert && this.state.lastExpert.id !== insertEvent.resourceId) || (this.state.renderedExpert[0].id !== insertEvent.resourceId)) {
          // 선택한 expert로 view를 rendering합니다
          $('.expert-each input#expert_w_' + insertEvent.resourceId).prop('checked', true);
          this.setState({
            lastExpert: this.getExpert(insertEvent.resourceId)
          }, () => {
            this.changeExpert(this.getExpert(insertEvent.resourceId));
            setTimeout(function() {
              _component.fakeRenderNewEvent(insertEvent, newEventId, 'selectedStart');
            }, 0);
          });
        } else {
          this.fakeRenderNewEvent(insertEvent, newEventId, 'selectedStart');
        }
      // 2. daily 생성인 경우
      } else {
        // 생성할 이벤트의 expert가 렌더링 되어있는경우
        if ($('input#expert_' + insertEvent.resourceId).prop('checked')) {
          _component.fakeRenderNewEvent(insertEvent, newEventId, 'selectedStart');
        // 생성할 이벤트의 expert가 렌더링 되어있지 않은경우 (생성할 expert 타임라인을 렌더링한다)
        } else {
          $('input#expert_'+ insertEvent.resourceId).prop('checked', true);
          this.renderExpert(this.getExpert(insertEvent.resourceId), $('input#expert_' + insertEvent.resourceId), true);
          setTimeout( function(){
            _component.fakeRenderNewEvent(insertEvent, newEventId, 'selectedStart');
          },100);
        }
      }
    });
  }
  // 생성 A,B ___ 2 : 임시렌더링된 이벤트 등록을 할것인지 확인한다
  step_modal (bool, id) {
    let { Calendar } = this.refs;
    let type = this.state.isEditEvent ? 'editEvent' : 'newEvent';
    if (bool) {
      this.props.isModalConfirm(type);
      this.setState({
        isModalConfirm: true
      });
    } else {
      // 취소 1__ 시작시간을 지정하지 않고 예약하는 중에 취소
      if (this.state.isNotAutoSelectTime) {
        this.backToOrder(id);
        this.refs.NewOrder.backToStep(2);
        $(Calendar).fullCalendar('removeEvents', [id]);
      // 취소 2__ 예약변경 중에 취소
      } else if (this.state.isEditEvent) {
        // 예약 변경중에 취소는 이 함수에서는 실행하지않습니다.  함수 fakeRenderEditEvent() 에서 바인딩으로 실행합니다
      // 취소 3__ daily timeline에서 예약하는 중에 취소
      } else if (this.state.viewType === 'agendaDay') {
        this.refs.NewOrder.backToStep(2);
        this.backToOrder(id);
        $('.mask-event').hide();
      // 취소 4__ weekly timeline에서 예약하는 중에 취소
      } else {
        this.refs.NewOrder.backToStep(2);
        this.backToOrder(id);
      }
      // 임시로 렌더링한 이벤트를 제거
      $(Calendar).fullCalendar('removeEvents', [id]);
    }
  }

  // 생성 A,B 최종 : 이벤트를 등록을 결정하고 종료한다.
  step_render (bool, id, isNotAutoSelectTime) {
    let { Calendar } = this.refs;

    // 등록
    if (bool) {
      // 생성 B(시작시간 자동선택없이 예약생성)일 경우
      if (isNotAutoSelectTime) {
        if (this.state.viewTypeOrder === 'agendaDay') {
          // 생성한 이벤트의 날자로 캘린더 타임라인을 변경
          $(Calendar).fullCalendar('gotoDate', moment(this.state.selectedDate).format('YYYY-MM-DD'));
          this.changeView('agendaDay', function () {
            // render event
            this.autoScrollTimeline($('#ID_'+ id));
            //$('.fc-scroller.fc-time-grid-container').animate({scrollTop: $('#ID_'+ id).css('top') }, 300);
          });
        } else {
          // 생성된 슬롯에 자동 스크롤
          this.autoScrollTimeline($('#ID_'+ id));
        }
      }
      this.props.guider('ABCD'+'님의 ' + 'AAAA'+ ' 예약이 생성되었습니다!');
    // 취소
    } else {
      $(Calendar).fullCalendar('removeEvents', [id]);
    }
    // 공통
    this.eventSlotHighlight(false);
    this.resetOrder();
  }

  modalConfirmHide () {
    this.setState({
      isModalConfirm: false
    });
  }

  // reset states and styles ( off-time 이벤트는 해당하지않음 )
  resetOrder () {
    let { Calendar } = this.refs;
    // 생성된 이벤트 스타일 제거
    $('.fc-event.new-event').removeClass('new-event');
    // 시각적 복제 생성된 이벤트 삭제
    $('.fc-fake-event').remove();
    // 배경 마스크 제거
    $('#render-confirm').hide();
    $('.mask-event').hide();
    // 스크롤링 방지 클래스 삭제
    $('.fc-scroller.fc-time-grid-container').removeClass('overflow-hidden');
    $('.create-order-wrap.timeline').removeClass('red blue yellow green purple');
    // show create order ui
    $('.create-order-wrap.fixed').removeClass('hidden');
    // remove z-index inline style
    $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').attr('style', '');
    // unbind create event button
    $('.create-order-wrap.timeline button.create-event').unbind('click');
    // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
    if ($('.create-order-overlap').length) $('.create-order-overlap').removeClass('create-order-overlap');
    // store isModalConfirm init
    this.props.isModalConfirm('');

    // enable editable
    if (this.state.newEventId) {
      let evt = $(Calendar).fullCalendar('clientEvents', this.state.newEventId)[0];
      evt.editable = true;
      setTimeout(function(){
        $(Calendar).fullCalendar('updateEvent', evt);
      },0);
    }

    // reset states
    this.setState({
      viewTypeOrder: undefined,
      newEvents: undefined,
      selectedExpert : undefined,
      selectedDate : undefined,
      selectedEvent: undefined,
      renderedEvent: undefined,
      newEventId: undefined,
      newEventSelector: undefined,
      newEventProductTime: undefined,
      isNotAutoSelectTime: false,
      isEditEvent: false,
      isRequestReservation: false,
      isModalConfirm: false,
      isNewOrder: false,
      isRenderConfirm: false
    });
  }

  backToOrder (id) {
    let { Calendar } = this.refs;
    let eventId = id || this.state.newEventId;

    if (eventId) {
      $(Calendar).fullCalendar('removeEvents', [eventId]);
    }
    //  reset styles and states
    $('.fc-scroller.fc-time-grid-container').scrollTop(0);
    $('.create-order-wrap.timeline button.create-event').unbind('click');
    $('.fc-fake-event').remove();
    this.eventSlotHighlight(false, 'event');
    this.setState({
      isRenderConfirm: false,
      newEventProductTime: undefined
    });
  }


  // offtime 생성 1/2
  createOfftime (order, type) {
    let { Calendar } = this.refs;
    let _component = this;
    let defaultMinute = 20;
    let endTime = this.state.selectedDate;
        endTime = moment(endTime).add(defaultMinute, 'minute');
        endTime = endTime.format("YYYY-MM-DDTHH:mm:ss");
    let newEventId = this.createNewEventId();
    // event option
    let insertOfftime = {
      product: "OFF TIME",
      class: "off-time",
      id: newEventId
    };
    switch (order) {
      // '주,일 단위' 타임라인 테이블 안에서 시작시간을 지정하여 생성하는 경우
      case 'timeline' :
        insertOfftime = $.extend(insertOfftime, {
          resourceId: this.state.selectedExpert.id,
          start: this.state.selectedDate,
          end: endTime,
        });
        /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
        $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
        $('.timeline .create-order-ui-wrap').hide();
        this.renderEvent(insertOfftime);
        break;
      // '주 단위' 에서 시작시간을 지정하지 않고 생성하는 경우
      case 'weekly' :
        if (this.state.viewType === 'agendaDay') {
          this.setState({
            isCreateOfftime: true,
            newEventProductTime: 20,
            // priorityExpert: this.state.defaultExpert,
            viewTypeOrder: 'agendaDay'
          }, () => {
            this.changeView('agendaWeekly');
            offTime();
          });
        } else {
          this.setState({
            isCreateOfftime: true,
            newEventProductTime: 20
          }, () => {
            offTime();
            this.eventSlotHighlight(true, 'off-time');
          });
        }
        //call back
        function offTime () {
          // esc 바인딩
          $(document).bind('keydown', function(e){
            if (e.which === 27 && _component.state.isCreateOfftime) {
              _component.setState({
                isCreateOfftime: false,
                newEventProductTime: undefined,
                newEventId: undefined,
                newEventSelector: undefined,
                isAbleBindRemoveEvent: false
              });
              _component.eventSlotHighlight(false);
              $('#render-confirm').hide();
              // show create order ui
              $('.create-order-wrap.fixed').removeClass('hidden');
              $(document).unbind('keydown');
            }
          });
        }

        break;
      // '주 단위' 에서 빈 슬롯에 생성할 경우
      case 'render' :
        insertOfftime = $.extend(insertOfftime, {
          resourceId: this.state.selectedExpert.id,
          start: this.state.selectedDate,
          end: endTime
        });
        this.renderEvent(insertOfftime);
        break;
      default:
        break;
    }
    // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
    if ($('.create-order-overlap').length) $('.create-order-overlap').removeClass('create-order-overlap');
  }

  // offtime 생성 2/2
  renderEvent (insertOfftime) {
    let _component = this;
    let { Calendar } = this.refs;

    // A _ 상시 예약생성 버튼을 통해 offtime을 생성한 경우
    if (_component.state.isCreateOfftime) {
      this.eventSlotHighlight(false);

      $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
      // 타임라인 예약생성 버튼 상위로 노드로 삽입
      $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());

      if (this.state.viewTypeOrder === 'agendaDay') {
        // daily 로 view를 변경한 후 오프타임 렌더링
        $(Calendar).fullCalendar('gotoDate', moment(insertOfftime.start).format('YYYY-MM-DD'));
        this.changeView ('agendaDay', function () {
          // render event
          $(Calendar).fullCalendar('renderEvent', insertOfftime, true ); //stick?  true
          _component.autoScrollTimeline($('#ID_'+ insertOfftime.id));
          //$('.fc-scroller.fc-time-grid-container').animate({scrollTop: $('#ID_'+ insertOfftime.id).css('top') }, 300);
        });
      } else {
        $(Calendar).fullCalendar('renderEvent', insertOfftime, true ); //stick?  true
      }
      $('#ID_' + insertOfftime.id).addClass('new-event');
      $('.create-order-wrap.fixed').removeClass('hidden');
      _component.props.guider('OFF TIME이 생성되었습니다!');
      // _component.state.isAbleBindRemoveEvent 가 true일경우 ESC key등의 이벤트 발생시 삭제가 가능하도록 접근성 바인딩을 합니다
      _component.setState({
        viewTypeOrder: undefined,
        isCreateOfftime: false,
        newEventProductTime: undefined,
        newEventId: insertOfftime.id,
        newEventSelector: '#ID_' + insertOfftime.id,
        isAbleBindRemoveEvent: true
        }, () => {
        // callback
          // ESC key 입력시 신규생성한 event 삭제
          $(document).bind('keydown', function(e){
              if (e.which === 27 && !_component.state.isModalConfirm) {
                if (_component.state.isAbleBindRemoveEvent) {
                  /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                  $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                  $(Calendar).fullCalendar('removeEvents', [_component.state.newEventId]);
                  _component.setState({
                    isAbleBindRemoveEvent: false,
                    newEventId: undefined,
                    newEventSelector: undefined
                  });
                  _component.props.guider('OFF TIME이 삭제되었습니다!');
                }
                $(document).unbind('keydown');
              }
          });
          // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
          $('body').one('click', function (e) {
            if (insertOfftime.id === _component.state.newEventId) {
              $('#ID_' + insertOfftime.id).removeClass('new-event');
              _component.setState({
                isAbleBindRemoveEvent: false,
                newEventId: undefined,
                newEventSelector: undefined
              });
            }
          });
        }
      );

    // B _ 타임라인 내에서 오프타임을 생성한 경우
    } else {
      //$(Calendar).fullCalendar('gotoDate', moment(insertOfftime.start).format('YYYY-MM-DD'));
      // render event
      $(Calendar).fullCalendar('renderEvent', insertOfftime, true ); //stick?  true
      $('#ID_' + insertOfftime.id).addClass('new-event');
      $('.create-order-wrap.fixed').removeClass('hidden');
      _component.props.guider('OFF TIME이 생성되었습니다!');

      // _component.state.isAbleBindRemoveEvent 가 true일경우 ESC key등의 이벤트 발생시 삭제가 가능하도록 접근성 바인딩을 합니다
      _component.setState({
        newEventId: insertOfftime.id,
        isAbleBindRemoveEvent: true
        }, () => {
        // callback
          // ESC key 입력시 신규생성한 event 삭제
          $(document).bind('keydown', function(e){
              if (e.which === 27 && !_component.state.isModalConfirm) {
                if (_component.state.isAbleBindRemoveEvent) {
                  /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                  $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                  $(Calendar).fullCalendar('removeEvents', [_component.state.newEventId]);
                  _component.setState({
                    isAbleBindRemoveEvent: false,
                    newEventId: undefined,
                    newEventSelector: undefined
                  });
                  _component.props.guider('OFF TIME이 삭제되었습니다!');
                }
                $(document).unbind('keydown');
              }
          });
          // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
          $('body').one('click', function (e) {
            if (insertOfftime.id === _component.state.newEventId) {
              $('#ID_' + insertOfftime.id).removeClass('new-event');
              _component.setState({
                isAbleBindRemoveEvent: false,
                newEventId: undefined,
                newEventSelector: undefined
              });
            }
          });
        }
      );
    }
  }

  // 신규예약 이벤트를 렌더링합니다 (실제 이벤트를 생성한 후 최종확인 버튼을통해 삭제할지 말지 결정합니다)
  fakeRenderNewEvent (insertEvent, newEventId, type) {
    let { Calendar } = this.refs;
    if (type === 'selectedStart') {
      $(Calendar).fullCalendar('renderEvent', insertEvent , true); // stick? = true
      // animate scroll after event rendered
      this.autoScrollTimeline($('#ID_'+ newEventId), 0, function () {
        $('.fc-scroller.fc-time-grid-container').addClass('overflow-hidden');
      });
      // $('.fc-scroller.fc-time-grid-container').animate({scrollTop: $('#ID_'+ newEventId).css('top') }, 300, function () {
      //   $(this).addClass('overflow-hidden');
      // });
      $('#ID_'+ newEventId).addClass('new-event').after($('.mask-event').show());
    // weekly
    } else {
      let startTime = this.state.selectedDate;
      let endTime = moment(startTime).add(this.state.newEventProductTime, 'minute').format("YYYY-MM-DDTHH:mm:ss");
      let newInsertEvent = $.extend(insertEvent, {
        start: startTime,
        end: endTime
      });
      $(Calendar).fullCalendar('renderEvent', newInsertEvent, true); // stick? = true
      let realEventElem = $('#ID_'+ newEventId);
      let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + newEventId + '_FAKE');
      $(fakeEventElem).addClass('new-event').appendTo($('.fc-time-grid-container td[data-date="'+ moment(this.state.selectedDate).format('YYYY-MM-DD') +'"]'));
      $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
      this.setState({
        newEventId: newEventId,
        newEventSelector: '#ID_' + newEventId,
        newEvents: $.extend(newInsertEvent, {class: Functions.getProductColor(newInsertEvent.product, Products)}),
      });
    }
    // button ui hidden
    $('.create-order-wrap.fixed').addClass('hidden');
    this.setState({ isRenderConfirm: false }, () => {
      this.setState({ isRenderConfirm: true });
    });
  }

  // 예약 변경시 이벤트를 렌더링합니다 (실제 이벤트를 생성한 후 최종확인 버튼을통해 삭제할지 말지 결정합니다)
  fakeRenderEditEvent (editEvent, rerender) {
    let _component = this;
    let { Calendar } = this.refs;
    console.log(editEvent);
    // rerendering 일 경우 이벤트를 다시 등록한다
    if (rerender) $(Calendar).fullCalendar('renderEvent', editEvent, true); // stick? = true

    let realEventElem = $('#ID_'+ editEvent.id).hide();
    let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editEvent.id + '_FAKE').show();
    $(fakeEventElem).addClass('new-event edit').appendTo($('.fc-time-grid-container td[data-date="'+ moment(editEvent.start).format('YYYY-MM-DD') +'"]'));
    $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
    this.setState({
      newEventId: editEvent.id,
      newEventSelector: '#ID_' + editEvent.id,
      newEvents: $.extend(editEvent, {class: Functions.getProductColor(editEvent.product, Products)}),
      newEventProductTime: Functions.millisecondsToMinute(moment(editEvent.end).diff(moment(editEvent.start)))
    });
    // 이벤트 생성버튼 Click 바인딩
    $('.create-order-wrap.timeline button.create-event').ready(function () {
      $('.create-order-wrap.timeline button.create-event').bind('click', function () {
        // 렌더링 된 이벤트 삭제
        $(fakeEventElem).remove();
        fakeEventElem = null;
        $(Calendar).fullCalendar('removeEvents', [editEvent.id]);
        // 수정된 이벤트 객체 정보
        let getEventObj  = _component.refs.NewOrder.getEventObj();
        let editEventObj = _component.returnEventObj(getEventObj);
        let editedStart = moment(_component.state.selectedDate);
        let editedEnd = moment(_component.state.selectedDate).add(_component.state.newEventProductTime, 'minutes');
        let insertEvent  = $.extend(editEventObj, {
          id: editEvent.id,
          resourceId: _component.state.selectedExpert.id,
          start: editedStart,
          end: editedEnd
        });
        // 수정된 이벤트 렌더링
        $(Calendar).fullCalendar('renderEvent', insertEvent, true); // stick? = true
        realEventElem = $('#ID_'+ editEvent.id);
        fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editEvent.id + '_FAKE');
        $(fakeEventElem).addClass('new-event edit').appendTo($('.fc-time-grid-container td[data-date="'+ editedStart.format('YYYY-MM-DD') +'"]'));
        $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
        _component.setState({
          isRenderConfirm: true,
          editedDate: {
            start: editedStart,
            end: editedEnd
          }
        }, () => {
          // 수정된 이벤트 임시 렌더링 후의 취소버튼 바인딩
          $('.render-confirm-inner').ready(function () {
            $('.render-confirm-inner').find('.cancel').unbind('click'); // 중복 바인딩 방지
            $('.render-confirm-inner').find('.cancel').bind('click', function () {
              // fake 이벤트레이어 삭제
              $('.fc-fake-event').remove();
              $(fakeEventElem).remove();
              // 수정된 이벤트를 임시 삭제
              $(Calendar).fullCalendar('removeEvents', [editEvent.id]);
              $('.render-confirm-inner').find('.cancel').unbind('click');
              $('.render-confirm-inner').remove();
              // reset states and remove dom elements and event
              _component.setState({
                isRenderConfirm: false
              });
              // 수정전의 이벤트를 인수로 넘겨 함수를 재실행한다
              _component.fakeRenderEditEvent(editEventObj, true);
            });
          });
        });
        $(this).unbind('click');
      });
    });
  }

  // 상단 컨트롤러를 통해 일반적으로 타임라인을 변경할때
  changeDateBasic (dir, view) {
    let { Calendar } = this.refs;


    switch (view) {
      case 'agendaDay' :
        if (dir === 'prev') {
          $(Calendar).fullCalendar('prev');
        } else {
          $(Calendar).fullCalendar('next');
        }
        break;
      case 'agendaWeekly' :
        if (dir === 'prev') {
          $(Calendar).fullCalendar('incrementDate', {week: -4});
        } else {
          $(Calendar).fullCalendar('incrementDate', {week: 4});
        }
        break;
      default: break;
    }
  }

  // 상단 datepicker 컨트롤러를 통해 타임라인 날짜를 변경할때
  changeDate (date, show) {
    let { Calendar } = this.refs;

    if (show === false) {
      this.setState({
        isChangeDate: false
      });
      return false;
    }

    if (this.state.viewType === 'agendaDay') {
      $(Calendar).fullCalendar('gotoDate', date.format());
    } else {
      // 해당 날짜가 이미 타임라인에 렌더링 되어있는 경우
      if (this.checkRenderedDate(date)) {
        this.autoScrollTimeline($('th.fc-day-header.fc-widget-header[data-date="'+ date.format('YYYY-MM-DD') +'"]'));
      } else {
        $(Calendar).fullCalendar('gotoDate', date.format());
      }
    }


    this.setState({
      isChangeDate: false
    });
  }

  // 예약정보수정
  editEvent (event) {
    let { Calendar } = this.refs;
    let _component = this;
    let type = event.product ==='OFF TIME' ? 'off-time' : 'edit';
    // 예약카드 상세보기에서 예약수정을 클릭한경우
    if (this.state.isUserCard) {
      this.isUserCard(false);
    }
    // view change시, 선택된 이벤트의 expert를 기본 expert로 렌더링하도록 설정해준다
    this.setState({
      priorityExpert: this.getExpert(event.resourceId),
      lastExpert: this.getExpert(event.resourceId)
    }, () => {
      // view change시, 선택된 이벤트의 요일이 처음으로 오도록 설정해준다
      let fcOptions = {
        firstDay: event.start.day(),
        gotoDate: event.start.format('YYYY-MM-DD'),
        editable: false
      };
      $(Calendar).fullCalendar('option', fcOptions);
      this.changeView('agendaWeekly', function () {
        _component.autoScrollTimeline($('#ID_'+ event.id));
      });
      this.eventSlotHighlight(true, type, event.product);
      this.fakeRenderEditEvent(event);
    });
    this.setState({
      isEditEvent: true,
      isNewOrder: true
    });
  }

  isNewOrder (bool, startTime) {
    let { Calendar } = this.refs;
    if (bool) {
      // 우측하단 상시 예약생성 버튼을 통한 생성일 경우
      if (startTime === 'notAutoSelectTime')   this.setState({ isNotAutoSelectTime: true });
      // 일단위 타임라인에서 예약생성 시작시, 예약등록후 일단위 타임라인으로 다시돌아오도록 설정한다.
      if (this.state.viewType === 'agendaDay') this.setState({ viewTypeOrder: 'agendaDay' });

      $('.create-order-wrap.fixed').addClass('hidden');
      /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
      $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
      $('.timeline .create-order-ui-wrap').hide();
      // $(Calendar).fullCalendar('option', 'editable', false);
    } else {
      /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
      $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
      // 시작시간을 미리 선택하지않고 이벤트를 생성중에 취소할 경우
      if (this.state.isNotAutoSelectTime || this.state.isEditEvent) {
        this.resetOrder();
      } else {
        // enable editable
        let evt = $(Calendar).fullCalendar('clientEvents', this.state.newEventId);
            evt.editable = true;
        $(Calendar).fullCalendar('updateEvent', evt);
        // $(Calendar).fullCalendar('option', 'editable', true);
      }

      $('.create-order-wrap.fixed').removeClass('hidden');
      $('#render-confirm').hide();
    }
    this.setState({
      isNewOrder : bool
    });
  }

  isRenderEventConfirm (bool) {
    this.setState({
      isModalConfirm : bool
    });
   }

  isUserCard (bool, options) {
    if (bool) {
      this.props.initUserCard({
        defaultSlideIndex: options.defaultSlideIndex,
        expert: options.expert,
        userCards: options.userCards
      });
    }
    this.setState({
      isUserCard : bool
    });
  }

  // overview timeline 에서 선택가능한 slot을 활성화 or 활성화 해제 시킨다
  eventSlotHighlight (bool, type, product) {
    //console.log('실행', bool, type);
    let _component = this;
    let bgCell = '<span class="bg-cell"></span>';
    //오늘 날짜(임시)의 .fc-day 레이어를 가져옵니다
    let daySlot = $('.fc-agendaWeekly-view .fc-bg .fc-day[data-date="'+ moment(new Date()).format('YYYY-MM-DD') +'"]');
    let color = Functions.getProductColor(product, Products);
    this.setState({ newEventProduct: product });
    // highlighting
    if (bool) {
      // background mask 삽입 및 스타일 지정
      $('.fc-content-skeleton').css('z-index', '2');
      $("#render-confirm").show().css('z-index', '2').addClass('mask-white mask-overview');
      $('.create-order-wrap.fixed').addClass('hidden');
      $('.create-order-wrap.timeline').removeClass('red blue yellow green purple');
      if (color) setTimeout(function(){ $('.create-order-wrap.timeline').addClass(color); },0);
      /*[공통]  활성화 가능한 타임 블록의 tr에 class="slot-highlight"를      적용해주어야 합니다
        [공통]  활성화 가능한 타임 블록의 첫번째 tr에 class="start"를  추가로 적용해주어야 합니다
        [공통]  활성화 가능한 타임 블록의 마지막 tr에 class="end"를    추가로 적용해주어야 합니다
        [예약수정]  활성화 가능한 타임 블록의 tr에 class="edit"을 추가로 적용해주어야 합니다
        [off time]  활성화 가능한 타임 블록의 tr에 class="off-time"을 추가로 적용해주어야 합니다 */
      switch (type) {
        case 'off-time' :
          $(daySlot).find('tr[data-time="15:00:00"]').addClass('slot-highlight off-time start').find('td').append(bgCell);
          $(daySlot).find('tr[data-time="15:00:00"]').nextUntil('tr[data-time="16:00:00"]').addClass('slot-highlight off-time').find('td').append(bgCell);
          $(daySlot).find('tr[data-time="16:00:00"]').addClass('slot-highlight off-time end').find('td').append(bgCell);
          break;
        case 'edit' :
          $(daySlot).find('tr[data-time="15:00:00"]').addClass(`slot-highlight edit start ${color}`).find('td').append(bgCell);
          $(daySlot).find('tr[data-time="15:00:00"]').nextUntil('tr[data-time="16:00:00"]').addClass(`slot-highlight edit ${color}`).find('td').append(bgCell);
          $(daySlot).find('tr[data-time="16:00:00"]').addClass(`slot-highlight edit end ${color}`).find('td').append(bgCell);
          break;
        default :
          $(daySlot).find('tr[data-time="15:00:00"]').addClass(`slot-highlight start ${color}`).find('td').append(bgCell);
          $(daySlot).find('tr[data-time="15:00:00"]').nextUntil('tr[data-time="16:00:00"]').addClass(`slot-highlight ${color}`).find('td').append(bgCell);
          $(daySlot).find('tr[data-time="16:00:00"]').addClass(`slot-highlight end ${color}`).find('td').append(bgCell);
          break;
      }
    // reset highlighted
    } else {
      setTimeout(function(){
        $('.fc-agendaWeekly-view .fc-bg .fc-day tr').removeClass('slot-highlight off-time start end red blue yellow green purple').find('.bg-cell').remove();
        $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
        $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').attr('style', '');
        $('#render-confirm').hide();
        $('.create-order-wrap.timeline').removeClass('green red purple blue yellow');
      },0);
    }
  }

  // 주, 일단위 epxert input checking
  expertInputCheck (view) {
    let { Calendar } = this.refs;
    const {
      viewType,
      viewTypePrev,
      isCreateOfftime,
      isEditEvent,
      lastExpert,
      defaultExpert,
      renderedExpert,
      priorityExpert
    } = this.state;

    // 기본적인 view rendering and change rendering
    if ( (viewTypePrev && viewTypePrev !== view.type) || view === 'direct') {
      console.log('VIEW 전환');
      // 공통으로 초기 인풋 체크 해제
      $('.expert-each input:checked')
        .prop('checked', false)
        .parent('.expert-each').attr('data-active', false);

      // 1. Weekly input checking (Weekly 에서 Expert별 렌더링은 calendar 옵션중 eventRender 에서 필터링 처리함)
      if (view.type === 'agendaWeekly' || view === 'direct') {
        // 1-1
        if (priorityExpert) {
          $('.expert-weekly .expert-each input#expert_w_' + priorityExpert.id).prop('checked', true);
          console.log('1-1 priorityExpert');
        // 1-2
        } else if (renderedExpert.length >= 2) {
          $('.expert-weekly .expert-each input#expert_w_' + defaultExpert.id).prop('checked', true);
          console.log('1-2 Default Expert');
        // 1-3 :
        } else if (lastExpert) {
          console.log('1-3 Last Expert');
          $('.expert-weekly .expert-each input#expert_w_' + lastExpert.id).prop('checked', true);
        // 1-4 :
        } else {
          console.log('1-4 Default Expert');
          $('.expert-weekly .expert-each input#expert_w_' + defaultExpert.id).prop('checked', true);
        }
      // 2. Daily 이벤트 필터링 및 input checking
      } else {
        // 2-0
        if (priorityExpert) {
          console.log('2-0');
          $('.expert-each.checkbox[data-id="expert_'+ priorityExpert.id +'"]')
            .attr('data-active', true)
            .find('input').prop('checked', true);
          $(Calendar).fullCalendar('addResource', priorityExpert);
          for (let i = 0; i < renderedExpert.length; i++) {
            if (priorityExpert.id !== renderedExpert[i].id) $(Calendar).fullCalendar('removeResource', renderedExpert[i].id);
          }
        // 2-1 : 2명이상의 Expert를 렌더링 했었을경우 > 1순위인 Default Expert로 렌더링
        } else if (renderedExpert.length >= 2) {
          console.log('2-1');
          $('.expert-each.checkbox[data-id="expert_'+ defaultExpert.id +'"]')
            .attr('data-active', true)
            .find('input').prop('checked', true);
          $(Calendar).fullCalendar('addResource', defaultExpert);
          for (let i = 0; i < renderedExpert.length; i++) {
            if (defaultExpert.id !== renderedExpert[i].id) $(Calendar).fullCalendar('removeResource', renderedExpert[i].id);
          }
        // 2-2 : Expert를 변경했었을 경우 > 마지막으로 렌더링했던 Expert로 렌더링
        } else if (lastExpert) {
          console.log('2-2');
          $('.expert-each.checkbox[data-id="expert_'+ lastExpert.id +'"]')
            .attr('data-active', true)
            .find('input').prop('checked', true);
          for (let i = 0; i < renderedExpert.length; i++) {
            if (lastExpert.id !== renderedExpert[i].id) $(Calendar).fullCalendar('removeResource', renderedExpert[i].id);
          }
          $(Calendar).fullCalendar('addResource', lastExpert);
        // 2-3 : (기본) Default Expert > 1순위 Expert로 렌더링
        } else {
          console.log('2-3');
          $('.expert-each.checkbox[data-id="expert_'+ defaultExpert.id +'"]')
            .attr('data-active', true)
            .find('input').prop('checked', true);
        }
      }
    // **** END  // 예약 주,일단위 view change시 실행 input checked
    // **** START// 초기 예약페이지 접근시 실행 ****
  } else if (!viewTypePrev) {
      console.log('VIEW 예약 초기접근 Default Expert');
      if (view.type === 'agendaDay') {
        $('.expert-each[data-id="expert_'+ defaultExpert.id +'"]').attr('data-active', true);
        $('.expert-each input#expert_' + defaultExpert.id).prop('checked', true);
      } else {
        $('.expert-each input#expert_w_' + defaultExpert.id).prop('checked', true);
      }
    } // ****END // input checked
    if (view.type === 'agendaDay') this.expertInputAutoSort();
  }

  // Daily 에서의 Expert input 정렬
  expertInputAutoSort (e) {
    //  ddddd/......
  }

  getExpert (id) {
    for (let i = 0; i < Experts.length; i++) {
      if (Experts[i].id === id) {
        return Experts[i];
      }
    }
  }

  changeView (type, callback) {
    let { Calendar } = this.refs;
    $(Calendar).fullCalendar('changeView', type);
    if (callback) setTimeout(callback, 0);
    console.log(this.state.viewTye);
  }

  // change expert: only weekly timeline
  changeExpert (expert, input, callback) {
    $('.fc-view-container .fc-body').addClass('fade-loading');
    let { Calendar } = this.refs;
    if (this.state.isNewOrder) this.refs.NewOrder.setNewOrderExpert(expert);
    this.setState({
      priorityExpert: expert,
      lastExpert: expert
    }, () => {
      $(Calendar).fullCalendar('rerenderEvents');
      if (callback) callback();
    });
    console.log('Expert Change');
  }

  // show and hide calendar each experts: only dailyTimeline
  renderExpert (expert, input, isRemoveSiblings) {
    //this.props.loading(true);
    let { Calendar } = this.refs;
    let _component = this;
    let element = $(input);

    // 1. Expert Show
    if (element.prop('checked')) {
      $('.fc-view-container').addClass('fade-loading');
      // 1-1 All of experts
      if (expert === 'all') {
        $('.expert-each.checkbox')
        .attr('data-active', true)
        .find('input').prop('checked', true);

        for (let i=0; i < Experts.length; i++) {
          $(Calendar).fullCalendar('addResource', Experts[i], true);
        }
      }
      // 1-2 Each Expert
      else {
        $(Calendar).fullCalendar('addResource', expert);
        if (isRemoveSiblings) {
          for (let i = 0; i < this.state.renderedExpert.length; i++) {
            $(Calendar).fullCalendar('removeResource', this.state.renderedExpert[i].id);
            $('.expert-each.checkbox')
              .attr('data-active', false)
              .find('input').prop('checked', false);
            element.parent('.expert-each').attr('data-active', true);
          }
        }
        element.parent('.expert-each').attr('data-active', true);
        // 모두선택이 될 경우
        if ($('.expert-each.checkbox').find('input:checked').length === $('.expert-each.checkbox').find('input').length -1) {
          $('input#expert_all').prop('checked', true);
        }
        this.setState({
          prevExpert: this.state.lastExpert || this.state.defaultExpert,
          prevExpertAll: this.state.renderedExpert,
          lastExpert: expert
        });
      }

    // 2. Expert Hide
    } else {
      // 2-1 공통 현재 렌더링된 Expert가 1명 이하일경우 리턴 false
      if ($('.expert-each.checkbox').find('input:checked').length < 1) {
        element.prop('checked', true);
        return false;
      }
      // 2-2 All of experts
      if (expert === 'all') {
        // 1순위 defaultExpert를 제외한 Experts의 Input값 해제
        $('.expert-each.checkbox input').each(function(i, elem){
          if (_component.state.defaultExpert.id === $(elem).val()) {
            $(elem).prop('checked', true);
            $(Calendar).fullCalendar('addResource', _component.getExpert($(elem).val()));
          } else {
            $(elem).prop('checked', false);
            $(elem).parent('.expert-each').attr('data-active', false);
            $(Calendar).fullCalendar('removeResource', $(elem).val());
          }
        });
      // 2-3 Each Expert
      } else {
        // Input - All이 Check 되있으면 Check 해제
        if ($('#expert_all').prop('checked')) {
          $('#expert_all').prop('checked', false);
        }
        if (this.state.renderedExpert.length <= 2) {
          this.setState({
            lastExpert: this.getExpert($('.expert-each.checkbox').find('input:checked').val()),
            prevExpert: undefined
          });
        } else {
          this.setState({
            lastExpert: this.state.prevExpert || this.state.defaultExpert,
            prevExpert: undefined
          });
        }
        element.parent('.expert-each').attr('data-active', false);
        $(Calendar).fullCalendar('removeResource',expert.id);
        // if (_component.state.prevExpertAll) {
        //   let i = 0;
        //   while (i < _component.state.prevExpertAll.length) {
        //     if (_component.state.prevExpertAll[i].id === $(element).val()) {
        //       _component.setState({
        //         prevExpertAll: update(
        //           _component.state.prevExpertAll,{
        //           $splice: [[i, 1]]
        //         })
        //       });
        //     }
        //     i++;
        //   }
        // }
      }
      $('.fc-view-container').addClass('fade-loading');
    }
  }

  // Expert를 Priority기준으로 재배열 한다
  sortExpert (allOfExperts) {
    //let expertNewArray = [];
    let expertNewArray = allOfExperts.sort(function(a,b) {
      return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
    });
    return expertNewArray;
  }

  componentWillMount() {
    // show Loading bar
    this.props.loading(true);
  }

  componentDidMount() {

    const _component = this;
    let { Calendar } = this.refs;
    var date  = new Date();
    var time  = date.getTime();
    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();
    // var defaultDate = moment(date).subtract(7, 'day');
    var defaultDate = date;
    var firstDay = moment(date).day();
    var defaultScrollTime = moment(time).subtract(1, 'hour').format('HH:mm'); //현재시간으로부터 1시간 이전의 시간
    var isLastTime = moment(date).subtract(2, 'hour'); //오늘로부터 1시간 이전의 시간 ( "YYYY-MM-DD" )
    var expertUiHeight = 38;
    if (location.pathname.indexOf('daily') !== -1) expertUiHeight = 0;

    this.sortExpert(Experts);
    this.setState({ defaultExpert: Experts[0]});

    // fullcalendar option
    var fc__options = {
      schedulerLicenseKey:'0912055899-fcs-1483528517',
      resources: [ Experts[0] ],
      resourceOrder: 'priority', // expert의 정렬 순서를 무엇을 기준으로 할지 정함 (일단 title, id가 가능함)
      filterResourcesWithEvents: false, // 이벤트가 없는 expert를 숨길지 여부
      events: this.props.events,  //스케쥴 이벤트*
      locale : 'ko',              //언어선택
      defaultView : this.props.defaultView,  // init view type set
      header: {
        left: 'todayTimeline agendaDay agendaWeekly',
				// center: 'prev title next, changeDate',
        center: 'prevTimeline title nextTimeline, changeDate',
				right: 'agendaDay agendaWeekly'
			},
      firstDay: firstDay,
      longPressDelay: 125, // touch delay
      eventOverlap : false, //중복되는 시간의 이벤트 수정 여부
      selectOverlap : false, //중복되는 시간의 이벤트 생성 여부
      slotEventOverlap: false, //중복시간의 슬롯을 오버랩킬지 여부
      //eventResourceEditable: ,//리소스간에 이벤트 이동이 가능한지 여부
			defaultDate: defaultDate,   //기본 날짜
      scrollTime: defaultScrollTime, //초기 렌더링시 스크롤 될 시간을 표시합니다
      slotDuration: '00:10:00',
      snapDuration: '00:10:00',
      slotLabelInterval: '00:60:00', //캘린더 좌측 시간 label 시간간격마다 표시
      slotLabelFormat: 'h A', //캘린더 좌측 시간 label
      timeFormat: 'HH:mm',   //slot 시간 단위
      columnFormat: 'D ddd', //캘린더 상단 날자
      navLinks: true,        //(캘린더 상단 날자 링크 비활성화) can click day/week names to navigate views
      customButtons: {
        changeDate: {
          text: '날짜선택',
          click: function() {
            _component.setState({ isChangeDate: !_component.state.isChangeDate });
          }
        },
        todayTimeline: {
          text: 'TODAY',
          click: function() {
            _component.changeDate(moment(date));
          }
        },
        prevTimeline : {
          text: '이전',
          click: function() {
            _component.changeDateBasic('prev',  _component.state.viewType);
          }
        },
        nextTimeline : {
          text: '다음',
          click: function() {
            _component.changeDateBasic('next',  _component.state.viewType);
          }
        }
      },
      buttonText: {
        day: 'DAILY',
        week: 'WEEKLY'
      },
      //slotMinutes : 20,        //슬롯 생성 분단위 범위 설정 default :30
      //minTime: '09:00',        //예약가능한 최소 시작시간 지정 (출근시간)
      //maxTime: '18:00',        //예약마감시간 지정
      //businessHours: {},       //샵 영업시간 지정 (모든 Expert 의 업무시간이 동일한경우) (expert 별로 지정할경우는 resources 에서 선언)
      //eventConstraint: false,  //이벤트 수정을 특정 시간 내로 제한함 (businessHours 와 관련)
      height: window.innerHeight -expertUiHeight,
      nowIndicator: true,
      dragOpacity: 1,
      dragScroll: true,
      editable: true,            //수정가능한지 여부
			selectable: false,         //드래그로 날짜를 선택하여 추가기능 활성화
			selectHelper: true,        //드래그시 배경색상 효과
      windowResizeDelay : 0,     //윈도우 리사이즈시 캘린더 리사이징 딜레이
      handleWindowResize: true,  //캘린더 resizable 여부
      allDayDefault: false,
      titleFormat: 'YYYY. M. DD',
      views: {
        agendaWeekly: {
          eventLimit: 1,
					type: 'agenda',
          buttonText: 'WEEKLY',
          titleFormat: 'YYYY.MM.DD',
					duration: {
            weeks: 4
          }
				}
      },

      eventClick: function (event, jsEvent, view) {
        _component.setState({
          selectedEvent: $.extend(event, {class: Functions.getProductColor(event.product, Products)})
        });
        // **** '일 단위 타임라인에서' 이벤트 슬롯 삭제 및 수정버튼 바인딩
        if (view.type === 'agendaDay' && !_component.state.isEditEvent) {
          // ***수정***
          if (jsEvent.target.className === 'fc-ui-edit') {
            _component.editEvent(event);
          // ***삭제***
          } else if (jsEvent.target.className === 'fc-ui-delete') {
            _component.props.isModalConfirm('removeEvent');
            _component.setState({ isModalConfirm: true });
          }
        }
      },
      eventDragStart: function (event, jsEvent, ui, view) {
        _component.setState({ isDragging: true });
      },
      eventDragStop: function (event, jsEvent, ui, view) {
        // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
        _component.setState({ isDragging: false });
        if (_component.state.isAbleBindRemoveEvent) {
          _component.setState({
            newEventId: undefined,
            newEventSelector: undefined,
            isAbleBindRemoveEvent: false
          });
        }
      },
      eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
        /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
        $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
        // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
        if (_component.state.isAbleBindRemoveEvent) {
          _component.setState({
            newEventId: undefined,
            newEventSelector: undefined,
            isAbleBindRemoveEvent: false
          });
        }
        // 30분 이하의 이벤트의 element에 클래스 추가
        if (Functions.millisecondsToMinute(event.end.diff(event.start)) <= 30) {
          setTimeout(function(){
            // 20분 이하의 이벤트인경우
            if (Functions.millisecondsToMinute(event.end.diff(event.start)) <= 20) {
              $('.fc-event#ID_'+ event.id).addClass('fc-short');
            } else {
              $('.fc-event#ID_'+ event.id).addClass('fc-short no-expand');
            }
          },0);
        }
        // 20분 미만으로 이벤트 시간을 수정할 경우 수정을 되돌린다.
        if (Functions.millisecondsToMinute(event.end.diff(event.start)) < 20) {
          revertFunc();
          alert('변경할 수 없습니다');
        }
        if (event.id === _component.state.newEventId) {
          // off-time slot의 new evnet 클래스 시각적 제거
          setTimeout(function(){
            $('#ID_' + event.id).removeClass('new-event');
          }, 1);
        }
      },
      eventResizeStart: function( event, jsEvent, ui, view ) {
        _component.setState({ isDragging: true });
      },
      eventResizeStop: function( event, jsEvent, ui, view ) {
        _component.setState({ isDragging: false });
      },
      windowResize: function (view) {
        $(Calendar).fullCalendar('option', 'height', window.innerHeight -expertUiHeight );
        _component.setCalendarColumn();
      },
      resourceRender: function(resourceObj, labelTds, bodyTds) {
        setTimeout(function(){
          var expertUi = $('.expert-each[data-id="expert_'+ resourceObj.id + '"]');
          $(labelTds).html($(expertUi));
        },0);
      },
      eventRender: function( event, element, view ) {
        // 주단위 타임라인 에서 expert 별로 이벤트를 렌더링합니다. (filtering)
        let currentExpertId;
        if (view.type === 'agendaWeekly') {
          if (_component.state.priorityExpert) {
            currentExpertId = _component.state.priorityExpert.id;
          } else if (_component.state.renderedExpert.length >= 2) {
            currentExpertId = Experts[0].id;
          } else if (_component.state.lastExpert) {
            currentExpertId = _component.state.lastExpert.id;
          } else {
            currentExpertId = Experts[0].id;
          }
          if (event.resourceId !== currentExpertId) {
            return false;
          }
        }

        // Event Card 의 상품별로 Class를 삽입합니다
        if (event.product === 'OFF TIME') {
            $(element).addClass('off-time');
        } else {
          for (let i = 0; i < Products.length; i++) {
            if (event.product === Products[i].product) {
              $(element).addClass(Products[i].itemColor);
              break;
            }
          }
        }

        //시간이 지난 이벤트건 혹은, 예약 신규생성 도중인 이벤트에 대한 수정 비활성화 및 스타일 클래스 적용
        if (event.end.isBefore(isLastTime, 'hour') || _component.state.isNewOrder) {
          event.editable = false;
          $(element).addClass('disabled');
        }

        // service time이 20분 이하인 슬롯은 class 추가하여 스타일 추가 적용
        if (Functions.millisecondsToMinute(event.end.diff(event.start)) <= 20) {
          $(element).addClass('fc-short');
        } else {
          $(element).removeClass('fc-short');
        }

      },

      eventAfterAllRender: function (view) {
        if (view.type === 'agendaWeekly') $('.fade-loading').removeClass('fade-loading');
      },

      // 캘린더 이벤트 day 렌더링시
      dayRender: function (d, cell) {
        // 필요없는 node dom 삭제(all day slot 관련한 dom)
        $('.fc-day-grid.fc-unselectable').remove();

        // 오늘 날짜의 타임라인에서 예약마감버튼 바인딩
        if (d.isSame(date, 'day')) {
          $('.order-deadline-button')
            .unbind('click')
            .bind('click', function () {
            //....
          });
        }
      },
      // 캘린더 이벤트 view 렌더링시
      viewRender: function (view, elem) {
        let { Calendar } = _component.refs;

        console.log('VIEW 렌더링');

        // let renderedExpert = [];
        let renderedExpert = $(Calendar).fullCalendar('getResources');
        // if (view.type === 'agendaDay') {
        //    renderedExpert = $(Calendar).fullCalendar('getResources');
        // } else {
        //   renderedExpert[0] = _component.state.lastExpert || _component.state.defaultExpert;
        // }
        // view type setting
        _component.props.setRenderedViewType(view.type);
        // return object experts
        _component.setState({
          viewType: view.type,
          viewTypePrev: _component.state.viewType,
        }, () => {
          // **** START// 예약 주,일단위 view change시 실행 input checked ****
        _component.expertInputCheck(view);
          // view rendering 시 초기실행함수
          if (!_component.state.viewTypePrev) _component.initializeViewRender(view.type);
        });
        _component.setState({
          renderedExpert: renderedExpert
        });


        if (view.type === 'agendaWeekly') {
        // $(Calendar).fullCalendar('incrementDate', {week: -1});

        // weekly timeline 에서 좌측 시간 element를 복제하여 삽입 (스크롤시 고정적으로 따라다니도록 별도의 스타일 class 적용)
          var cloneTimelineSlats = $('.fc-time-grid > .fc-slats').clone().addClass('fc-slats-clone');
            $(cloneTimelineSlats).find('.fc-slot').remove();
            $(cloneTimelineSlats).insertAfter('.fc-time-grid > .fc-slats');
          // 주 단위 타임라인의 scroller module 실행
          _component.controlerInit();
        } else {
          _component.setCalendarColumn();
        }

        // 오늘날짜인경우 today 버튼 비활성화
        if (view.type === 'agendaDay' && view.start.isSame(moment(date), 'day')) {
          $('.fc-todayTimeline-button').prop('disabled', true);
        } else {
          $('.fc-todayTimeline-button').prop('disabled', false);
        }


        // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
        if ($('.create-order-overlap').length) $('.create-order-overlap').removeClass('create-order-overlap');

        //** expert ui 의 레이어를 상단으로 이동 (hasClass를통해 이미 삽입되었으면 실행안함) **
        if (!$('.fc-view-container > .fc-view').hasClass('inserted-expert')) {
          $('.expert-daily')
            .appendTo($('.fc-resource-cell-unselected'))
            .find('.expert-each.all').appendTo('th.fc-axis.fc-widget-header');
          $('.expert-weekly').insertBefore($('.fc-header-toolbar'));
          $('.fc-view-container > .fc-view').addClass('inserted-expert');
        }

        //** daily, weekly 뷰 체인지 버튼을 gnb의 버튼 레이어에 덮어씌움 (투명 레이어). (hasClass를통해 이미 삽입되었으면 실행안함) **
        if (!$('.fc-header-toolbar .fc-left').hasClass('inserted')) {
          $('.nav-reservation .nav-daily').append($('.fc-left .fc-agendaDay-button'));
          $('.nav-reservation .nav-overview').append($('.fc-left .fc-agendaWeekly-button'));
          $('.fc-header-toolbar .fc-left').addClass('inserted');
        }
        $('.fc-agendaDay-button, .fc-agendaWeekly-button').css('visibility', 'visible');
        $('.nav-reservation .header-nav-sub > li > a').css('visibility', 'hidden');

        if (_component.state.isCreateOfftime) {
          // 시간을 지정하지 않고 예약생성 혹은 offtime생성을 하는 단계에서 도중에 날짜이동을 한 경우 bg highlight 이벤트를 재실행합니다
          _component.eventSlotHighlight(true, 'off-time');
        } else if (_component.state.isNewOrder) {
          //_component.eventSlotHighlight(true, 'event');
          //$('#render-confirm').show();
          if (_component.state.newEventId) {
            //$(Calendar).fullCalendar('removeEvents', [_component.state.newEventId]);
          }
          // 임시로 이벤트를 렌더링 한 후 날짜 이동시, 다시 렌더링한다
          if (_component.state.isRenderConfirm) {
            _component.setState({ isRenderConfirm: false });            // event slot highlight button binding
            let getEventObj = _component.refs.NewOrder.getEventObj();
            let insertEvent = $.extend(_component.returnEventObj(getEventObj), {
              id: _component.state.newEventId
            });
            $('.create-order-wrap.timeline button.create-event').ready(function () {
              $('.create-order-wrap.timeline button.create-event').unbind('click'); //렌더링 시 마다 중복 binding 방지
              $('.create-order-wrap.timeline button.create-event').bind('click', function () {
                _component.fakeRenderNewEvent(insertEvent, _component.state.newEventId, 'weekly');
                _component.setState({ isRenderConfirm: true });
                 $(this).unbind('click');
              });
            });
          }
          $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').css('z-index', '4');
        }

        // Insert Helper & Buttons
        if (view.type === 'agendaWeekly') {
          // hide create order button
          $('.order-deadline-button').remove();
        }

        ///↓↓↓↓↓↓ 타임라인 빈 슬롯에 마우스오버시 신규생성 버튼 활성화  관련 ↓↓↓↓↓↓↓///
        // get today and variabling
        var getDate,
            d,
        // slot / button variabling
            createButtonElem = $('.create-order-wrap.timeline'),
            createHelperSlot;

        // **** case 1 : Daily timeline **** //
        if (view.type === 'agendaDay') {
          getDate = $(Calendar).fullCalendar('getDate');
          d = getDate.format('YYYY-MM-DD');
          let getExperts = $(Calendar).fullCalendar('getResources');
          // case 1__1 : expert 1명의 타임라인을 보고있는 경우
          if (getExperts.length === 1) {
            createHelperSlot = $('.fc-agendaDay-view .fc-time-grid-container .fc-slats tr');
            // style aplly
            $('.fc-agendaDay-view .fc-time-grid .fc-bg').css('z-index', '0');
            $('.fc').removeClass('multi-experts');
            for (let i = 2; i <= 10; i++) {
              $('.fc').removeClass(`expert-${i}`);
            }

          // case 1__2: expert 2명 이상의 타임라인을 보고있는 경우
          } else {
            createHelperSlot = $('.fc-agendaDay-view .fc-time-grid .fc-bg .fc-day .fc-create-helper tr');
            $('.fc-day-grid .fc-create-helper').remove();
            for (let i = 2; i <= 10; i++) {
              $('.fc').removeClass(`expert-${i}`);
            }
            $('.fc').addClass(`expert-${getExperts.length}`);
            $('.fc').addClass('multi-experts');
          }

        // **** case 2 : weekly timeline **** //
        } else {
          $('.fc').removeClass('multi-experts');
          createHelperSlot = $('.fc-agendaWeekly-view .fc-time-grid .fc-bg .fc-day .fc-create-helper tr');
        }
        // **** ↓ 마우스 오버시 해당 슬롯에 -> 1.'예약생성버튼 삽입' 2. '슬롯 하이라이트 버튼 삽입' - [공통] ↓ **** //
        // ( mouseenter 바인딩 부분에 해당 slot에 예약카드가 있는지 체크하는 추가 개발이 필요합니다 )
        $(createHelperSlot).each(function (parentIndex, parentElem) {
          $(parentElem).find('.fc-slot').each(function (){
            $(this).on({
              mouseenter : function (e) {
                if (
                  _component.state.isDragging ||
                  _component.state.isRenderConfirm
                ) return false;

                ///////마우스 오버한 슬롯 시간이 현재시간기준으로 지난 시간일때';//
                //return false;

                // init hidden ui buttons
                $('.create-order-wrap.timeline .create-order-ui-wrap').hide();
                // get current slot's date and variabling ( weekly view )
                if (view.type === 'agendaWeekly') {
                  d = $(this).parents('td.fc-day').data('date'); // it will be return ( YYYY-MM-DD )
                }

                // current time setting
                var slotTime = 'T' + $(parentElem).data('time');
                var selectedTime = d + slotTime;
                let mouseenteredTime = moment($(parentElem).data('time'),"hh:mm:ss");
                let color;
                if (_component.state.newEventProduct) color = Functions.getProductColor(_component.state.newEventProduct, Products);

                // current slot time display
                if (_component.state.isNotAutoSelectTime) {
                  $(createButtonElem).find('.time').html(
                    mouseenteredTime.format("a hh:mm") + ' - ' +
                    mouseenteredTime.add(_component.state.newEventProductTime, 'minute').format("a hh:mm")
                  );
                } else {
                  $(createButtonElem).find('.time').html(mouseenteredTime.format("A hh:mm"));
                }

                // insert create button
                $(this).append($(createButtonElem).show());
                if (_component.state.newEventProductTime) {
                  let className = (
                    _component.state.isEditEvent ? 'shc-edit' :
                    _component.state.isRequestReservation ? 'shc-edit' :
                    _component.state.isCreateOfftime ? 'shc-off-time' : ''
                  );
                  let fullTimeFormat = moment(mouseenteredTime).add(_component.state.newEventProductTime, 'minutes').format('HH:mm:ss');

                  $('.shc').removeClass('shc');
                  let elems = $(this).parent(parentElem).nextUntil(`tr[data-time="${fullTimeFormat}"]`);
                  $(elems).each(function(i, elem){
                    $(elem).addClass(`shc${color ? ' shc-'+color :''}${className ? ' '+className : ''}`);
                    if (i === elems.length -1) $(elem).addClass('shc-end');
                  });
                }
                _component.setState({ selectedDate: selectedTime });

                // get selected expert ( case : daily view)
                if (view.type === 'agendaDay') {
                  if ($(Calendar).fullCalendar('getResources').length === 1) {
                    _component.setState({ selectedExpert: _component.getExpert($('.expert-each.checkbox input:checked').val()) });
                  } else {
                    _component.setState({ selectedExpert: _component.getExpert($(this).parents('.fc-day').data('resource-id')) });
                  }
                // getting selected expert ( case : weekly view )
                } else {
                  _component.setState({ selectedExpert: _component.getExpert($('.expert-ui input:checked').val()) });
                }
                // console.log(_component.state.selectedDate);
                // console.log(_component.state.selectedExpert);
              },
              mouseleave: function (e) {
                // bg cell style reset
                $('.shc').removeClass('shc shc-edit shc-off-time shc-end shc-start shc-green shc-red shc-purple shc-blue shc-yellow');
                /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
                $('.full-calendar > .fc').append($(createButtonElem).hide());
                // 타임라인 내 신규예약생성 버튼 클릭시 z index 스타일 클래스 제거
                $('.create-order-overlap').removeClass('create-order-overlap');
              }
            });
          });
        });

        // loading bar hide
        _component.props.loading(false);
        $('.fade-loading').removeClass('fade-loading');

      }, //end viewRender

      viewDestroy: function (view, elem) {
        $('.fc-agendaDay-button, .fc-agendaWeekly-button').css('visibility', 'hidden');
        $('.nav-reservation .header-nav-sub > li > a').css('visibility', 'visible');

        // daily 에서의 expert input element 제거되는것을 방지함
        if (view.type === 'agendaDay') {
          $('.fc-head').find('.expert-each.checkbox').each(function (i, element){
            // $(element).appendTo('.expert-daily .expert-inner');
            $(element).appendTo('.expert-daily .expert-inner');
            console.log('view was destroy');
          });
        }
      },
      // open customer card
      eventDoubleClick: function(calEvent, jsEvent, view) {
        if (_component.state.isNewOrder) {
          // 신규예약 생성중에는 더블클릭 이벤트 실행않함
          return false;
        } else {
          // 더블클릭으로 선택된 이벤트객체를 가져옵니다
          let selectedCustomer = calEvent;
          // 선택된 이벤트객체의 리소스ID에 맞는 expert id를 찾아 가져옵니다
          let selectedExpert = $(Calendar).fullCalendar('getResourceById', selectedCustomer.resourceId);
          // 선택된 expert의 예약 카드들을 모두 가져옵니다.  추가로 필터링이 필요합니다 (오늘날짜이벤트, 오프타임 이벤트제외, 시간순 정렬)
          let slideCustomerCards = $(Calendar).fullCalendar('getResourceEvents', selectedCustomer.resourceId);

          // OFF TIME 이벤트는 제거한다
          let i = 0;
          while (i < slideCustomerCards.length) {
            if (slideCustomerCards[i].product === 'OFF TIME') {
              slideCustomerCards.splice(i, 1);
            }
            i++;
          }

          _component.isUserCard(true,{
            defaultSlideIndex: selectedCustomer,
            expert: selectedExpert,
            userCards: slideCustomerCards
          });
        }
      }
    }; /////// fullcalendar option //END

    // 스케쥴러 init 실행
    $(Calendar).fullCalendar(fc__options);

    $(document).ready(function(){
      $('.nav-reservation > a').addClass('active');
    });

    //우측하단 예약생성 고정버튼 Ui toggle
    $('.create-order-wrap.fixed .create-order-slot').bind('click', function() {
        $('.create-order-wrap.fixed .create-order-ui-wrap').toggle();
    });
    $('.create-order-wrap.fixed').bind('mouseleave', function() {
      $('.create-order-wrap.fixed .create-order-ui-wrap').hide();
    });

  } //////// ComponentDidMount //END


  componentWillUnmount() {
    let { Calendar } = this.refs;
    //** daily, weekly 뷰 체인지 버튼을 gnb의 버튼 레이어에 덮어씌움 (투명 레이어). (hasClass를통해 이미 삽입되었으면 실행안함) **
    $('.nav-reservation > a').removeClass('active');
    $('.fc-header-toolbar .fc-left').removeClass('inserted');
    $('.fc-agendaDay-button, .fc-agendaWeekly-button').remove();

    // 예약생성 단계에서 un mount시 임시로 렌더링한 이벤트를 삭제.
    if (this.state.isRenderConfirm) {
      $(Calendar).fullCalendar('removeEvents', [this.state.newEventId]);
    }
    $(Calendar).fullCalendar('destroy');
  }

  componentWillReceiveProps(nextProps){
    // 예약요청확인 이벤트 클릭시
    if (nextProps.requestReservation.condition) {
      // 함수 실행과 동시에 중복실행을 막기위해 store state 초기화
      this.props.finishRequestReservation();
      // 예약생성(예약요청확인)으로 넘어감
      this.goToRequestReservation(nextProps.requestReservation);
    }
  }

  //예약요청확인
  goToRequestReservation (options) {
    const { Calendar } = this.refs;
    const { condition, requestEvent } = options;

    this.setState({
      isEditEvent: true,
      isRequestReservation: true,
      selectedEvent: requestEvent,
      lastExpert: this.getExpert(requestEvent.resourceId),
      selectedExpert: this.getExpert(requestEvent.resourceId)
      }, () => {
        this.setState({
          isNewOrder: true
        });
      if (this.state.viewType !== 'agendaWeekly') {
        let fcOptions = {
          firstDay: moment(requestEvent.start).day(),
          defaultDate: moment(requestEvent.start).format('YYYY-MM-DD')
        };
        $(Calendar).fullCalendar('option', fcOptions);
        this.changeView('agendaWeekly', function () {
          // view change시, 선택된 이벤트의 요일이 처음으로 오도록 설정해준다
          //$('.fc-scroller.fc-time-grid-container').animate({scrollTop: $('#ID_'+ requestEvent.id).css('top') }, 300);
          this.autoScrollTimeline($('#ID_'+ requestEvent.id));
        });
      }
      this.eventSlotHighlight(true, 'edit', requestEvent.product);
      this.fakeRenderEditEvent(requestEvent);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    /* Header GNB 버튼 시각적 스타일 활성화 (라우터를 통한 링크이동이 아님) */
    if (prevState.viewType !== this.state.viewType) {
      $('.header-nav li.nav-daily a, .header-nav li.nav-overview a').removeClass('active');
      if (this.state.viewType === 'agendaDay') {
        $('.header-nav li.nav-daily a').addClass('active');
      } else {
        $('.header-nav li.nav-overview a').addClass('active');
      }
    }
  }

  render() {

    const CreateOrderButtonFixed = (
      <div className="create-order-wrap fixed">
        <div className="create-order-slot">
          <button className="create-button">
            <span>+</span>
          </button>
        </div>
        <div className="create-order-ui">
          <button onClick={ () => this.isNewOrder(true, 'notAutoSelectTime') } className="ui-reservation">예약생성</button>
          <button onClick={ () => this.createOfftime('weekly') } className="ui-offtime">OFF TIME 생성</button>
        </div>
      </div>
    );
    const CreateOrderButtonTimeline = (
      <div className={`create-order-wrap timeline${this.state.isCreateOfftime ? " off-time": this.state.isNotAutoSelectTime ? " has-card": this.state.isEditEvent ? " edit" : ""}`}>
        <div className="create-order-inner">
          <div className="create-order-slot">
            {this.state.isCreateOfftime ? (
                <button className="create-button" onClick={ () => this.createOfftime('render', 'offtime') }>
                  <i className="time"></i>
                  <span>+</span>
                </button>
              ) : this.state.isNotAutoSelectTime || this.state.isEditEvent ? (
                <button className="create-button create-event">
                  <i className="time"></i>
                  <span>+</span>
                </button>
              ) : (
                <button className="create-button" onClick={this.toggleCreateUi}>
                  <i className="time"></i>
                  <span>+</span>
                </button>
              )
            }
            <div className="create-order-ui-wrap">
              <div className="create-order-ui-inner">
                <div className="create-order-ui">
                  <button onClick={ () => this.isNewOrder(true) } className="ui-reservation">예약생성</button>
                  <button onClick={ () => this.createOfftime('timeline') } className="ui-offtime">OFF TIME 생성</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    let ExpertsInterfaceComponent = null;
    let NewOrderComponent = null;
    let ModalConfirmComponent = null;
    let RenderConfirmComponent = null;
    let DatePickerComponent = null;
    let UserCardComponent = null;

    ExpertsInterfaceComponent = (
      <div className="expert-wrap">
        <div className="expert-ui expert-daily" style={{display: this.state.viewType==='agendaWeekly' ? 'none' : 'block'}}>
          <div className="expert-inner">
            { Experts.length >= 2 ? (
              <div className="expert-each checkbox all">
                <input disabled={this.state.isRenderConfirm} className="expert-input" type="checkbox" name="expert" id="expert_all" value="all" onChange={ (input) => this.renderExpert('all', input.target)}/>
                <label className="expert-label" htmlFor="expert_all">ALL</label>
              </div>
            ) : ''}
            { Experts.map((expert, i) => {
                return (
                  <div className="expert-each checkbox" data-id={`expert_${expert.id}`} data-active="false" key={i}>
                    <input disabled={this.state.isRenderConfirm} className="expert-input" type="checkbox" name="expert" id={`expert_${expert.id}`} value={expert.id} onChange={ (input) => this.renderExpert(expert, input.target)} />
                    <label className="expert-label" htmlFor={`expert_${expert.id}`}>{expert.title}<i className="today-reservation">{expert.todayReservation}</i></label>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="expert-ui expert-weekly" style={{display: this.state.viewType==='agendaDay' ? 'none' : 'block'}}>
          <div className="expert-inner">
            { Experts.map((expert, i) => {
              return (
                <div className="expert-each" key={i}>
                  <input disabled={this.state.isRenderConfirm} className="expert-input" type="radio" name="expert_w" id={`expert_w_${expert.id}`} value={expert.id} onChange={ (input) => this.changeExpert(expert, input)} />
                  <label className="expert-label" htmlFor={`expert_w_${expert.id}`}>{expert.title}<i className="today-reservation">{expert.todayReservation}</i></label>
                </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );

    if (this.state.isNewOrder) {
      NewOrderComponent = (
        <NewOrder
          ref="NewOrder"
          step_confirm={ (bool, newEvent) => this.step_confirm(bool, newEvent) }
          setCalendarHeight={ (step) => this.setCalendarHeight(step) }
          isNewOrder={ (bool) => this.isNewOrder(bool) }
          changeView={ (type) => this.changeView(type) }
          backToOrder={this.backToOrder}
          isNotAutoSelectTime={this.state.isNotAutoSelectTime}
          isEditEvent={this.state.isEditEvent}
          isRequestReservation={this.state.isRequestReservation}
          willEditEventObject={this.state.selectedEvent}
          isModalConfirm={this.state.isModalConfirm}
          isRenderConfirm={this.state.isRenderConfirm}
          createEvent={this.createEvent}
          selectedDate={this.state.selectedDate}
          selectedExpert={this.state.selectedExpert}
        />
      )
    }

    if (this.state.isModalConfirm) {
        ModalConfirmComponent = (
        <ModalConfirm
          options={this.state.newEvents}
          selectedEvent={this.state.selectedEvent}
          editedDate={this.state.editedDate}
          newEventId={this.state.newEventId}
          isNotAutoSelectTime={this.state.isNotAutoSelectTime}
          modalConfirmHide={this.modalConfirmHide}
          step_render={ (bool, newEventId, type) => this.step_render(bool, newEventId, type) }
          removeEvent={this.removeEvent}
        />
      )
    }

    if (this.state.isRenderConfirm) {
      RenderConfirmComponent = (
        <RenderEventConfirm
          isModalConfirm={this.state.isModalConfirm}
          modalConfirm={this.step_modal}
          newEventId={this.state.newEventId}
        />
      )
    }


    if (this.state.isChangeDate) {
      DatePickerComponent = (
        <DatePicker
          onClick={this.changeDate}
          onClose={ () => this.changeDate('', false) }
        />
      )
    }

    if (this.state.isUserCard) {
      UserCardComponent = (
        <UserCard
          cards={this.props.events}
          isUserCard={ (bool) => this.isUserCard(bool)}
          onRemoveEvent={ (event) => this.removeConfirm(event) }
          onEditEvent={ (event) => this.editEvent(event) }
          onEditCustomer={""}
        />
      )
    }

    let viewview = (
      <dl className="viewview fc">
        <button onClick={()=> {$('.viewview.fc').hide() }}>X</button>
        <dt>viewType :</dt><dd>{this.state.viewType}</dd>
        <dt>viewTypePrev :</dt><dd>{this.state.viewTypePrev}</dd>
        <dt>viewTypeOrder :</dt><dd>{this.state.viewTypeOrder}</dd>
        <br />
        <dt>isRenderConfirm :</dt><dd>{this.state.isRenderConfirm?'true':""}</dd>
        <dt>isUserCard :</dt><dd>{this.state.isUserCard?'true':""}</dd>
        <dt>isChangeDate :</dt><dd>{this.state.isChangeDate?'true':""}</dd>
        <dt>isNewOrder :</dt><dd>{this.state.isNewOrder?'true':""}</dd>
        <dt>isRequestReservation: </dt><dd>{this.state.isRequestReservation?'true':""}</dd>
        <dt>isEditEvent: </dt><dd>{this.state.isEditEvent?'true':""}</dd>
        <dt>isCreateOfftime: </dt><dd>{this.state.isCreateOfftime?'true':""}</dd>
        <dt>isNotAutoSelectTime: </dt><dd>{this.state.isNotAutoSelectTime?'true':""}</dd>
        <dt>isAbleBindRemoveEvent: </dt><dd>{this.state.isAbleBindRemoveEvent?'true':""}</dd>
        <dt>isModalConfirm :</dt><dd>{this.state.isModalConfirm?'true':""}</dd>
        <dt>isDragging: </dt><dd>{this.state.isDragging && 'true'}</dd>
        <br />
        <dt>modalConfirmOption :</dt><dd>{this.props.modalConfirmOptionComponent ? this.props.modalConfirmOptionComponent : ""}</dd>
        <dt>editedDate: </dt><dd>{this.state.editedDate?'true':""}</dd>
        <dt>selectedDate: </dt><dd>{this.state.selectedDate}</dd>
        <dt>selectedEvent: </dt><dd>{this.state.selectedEvent ? this.state.selectedEvent.name +' ID:'+this.state.selectedEvent.id: ""}</dd>
        <br />
        <dt>defaultExpert: </dt><dd>{this.state.defaultExpert ? this.state.defaultExpert.title : ""}</dd>
        <dt>priorityExpert: </dt><dd>{this.state.priorityExpert ? this.state.priorityExpert.title : ""}</dd>
        <dt>selectedExpert: </dt><dd>{this.state.selectedExpert ? this.state.selectedExpert.title : ""}</dd>
        <dt>prevExpert</dt><dd>{this.state.prevExpert ? this.state.prevExpert.title : ""}</dd>
        {/*<dt>prevExpertAll</dt><dd>{this.state.prevExpertAll ? this.state.prevExpertAll.map((expert,i)=>{return expert.title+","}): ""}</dd>*/}
        <dt>lastExpert</dt><dd>{this.state.lastExpert ? this.state.lastExpert.title : ""}</dd>
        <dt>renderedExpert: </dt><dd>{this.state.renderedExpert ? this.state.renderedExpert.map((expert,i)=>{return expert.title+","}): ""}</dd>
        <br />
        <dt>newEventId: </dt><dd>{this.state.newEventId}</dd>
        <dt>newEventProduct: </dt><dd>{this.state.newEventProduct}</dd>
        <dt>newEventProductTime: </dt><dd>{this.state.newEventProductTime}</dd>
        <dt>newEventSelector: </dt><dd>{this.state.newEventSelector}</dd>
      </dl>
    );

    const test = (
      <button
        style={{'position': 'fixed', 'left': '80px', 'top': '0px', 'zIndex': '10', 'background': '#eee'}}
        onClick={ () => this.test() }
      >
          CLICK ME!
      </button>
    )

    return (
      <div ref="Calendar" id={`${this.state.viewType === 'agendaDay' ? 'daily':'weekly'}`}>
        {NewOrderComponent}
        {ExpertsInterfaceComponent}
        {CreateOrderButtonFixed}
        {CreateOrderButtonTimeline}
        {DatePickerComponent}
        {UserCardComponent}
        {ModalConfirmComponent}
        {RenderConfirmComponent}
        {viewview}
        {test}
      </div>
    );
  }
}

FullCalendar.defaultProps = {
  requestReservation: {
    condition: false,
    requestEvent: {}
  }
}

const mapStateToProps = (state) => {
  return {
    modalConfirmOptionComponent: state.modalConfirm.optionComponent,
    requestReservation: state.notifier.requestReservation
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    initUserCard: (options) => {
      let newOptions = {
        defaultSlideIndex: options.defaultSlideIndex,
        expert: options.expert,
        userCards: options.userCards
      }
      dispatch(actions.userCard(newOptions))
    },
    isModalConfirm: (optionComponent) => {
      dispatch(actions.modalConfirm(optionComponent))
    },
    guider: (message) => dispatch(
      actions.guider({ isGuider: true, message: message })
    ),
    loading: (condition) => dispatch(actions.loading(condition)),
    finishRequestReservation: () => dispatch(actions.requestReservation({condition: false, requestEvent: undefined}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FullCalendar);
