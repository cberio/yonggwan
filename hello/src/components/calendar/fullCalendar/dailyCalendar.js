import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import moment from 'moment';
import 'fullcalendar-scheduler';
import _ from 'lodash';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';

class DailyCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Calendar view type states
            alreadyRendered: false,
            viewTypeOrder: undefined,
            // conditions
            isNewOrder: false,
            isModalConfirm: false,
            isRenderConfirm: false,
            isUserCard: false,
            isChangeDate: false,
            isEditSchedule: false,
            isCreateOfftime: false,
            isRequestReservation: false,
            isAbleBindRemoveEvent: false,
            isDragging: false,
            // Expert states
            defaultStaff: undefined, // 관리자가 설정한 1순위 expert
            priorityStaff: undefined, // 타임라인 렌더링시 0순위로 기준이 되는 expert (일부 이벤트 등록시 해당된다)
            // prevStaff: this.props.defaultStaff,  // 이전에 렌더링 된 expert (현재 해당 state 는 사용하지않음)
            // prevStaffAll: undefined,              // 이전에 렌더링 된 experts (현재 해당 state 는 사용하지않음)
            renderedStaff: [], // 현재 타임라인에 렌더링 된 expert
            lastStaff: undefined, // 타임라인을 재 렌더링 할때 기준이되는 expert (해당 expert로 렌더링됨)
            selectedStaff: undefined, // 타임라인에 마우스 오버시 해당 타임라인의 expert
            // ... etc
            timelineDate: undefined,
            selectedDate: undefined,
            editedDate: undefined,
            selectedSchedule: undefined,
            renderedEvent: undefined,
            newSchedule: undefined,
            newScheduleId: undefined,
            newScheduleService: undefined,
            newScheduleServiceTime: undefined,
        };

        /*__________________ 함수 바인딩 __________________*/
        /* 예약 생성 관련 */
        this.newOrder = this.newOrder.bind(this);
        this.backToOrder = this.backToOrder.bind(this);
        this.modalConfirmHide = this.modalConfirmHide.bind(this);
        /* OFFT TIME 관련 */
        this.bindNewOfftime = this.bindNewOfftime.bind(this);
        this.renderNewOfftime = this.renderNewOfftime.bind(this);
        /* 예약 수정/삭제/요청 관련 */
        this.editSchedule = this.editSchedule.bind(this);
        this.removeSchedule = this.removeSchedule.bind(this);
        this.removeConfirm = this.removeConfirm.bind(this);1
        this.goToRequestReservation = this.goToRequestReservation.bind(this);
        /* 캘린더 DOM 관련 */
        this.changeView = this.changeView.bind(this);
        this.setCalendarColumn = this.setCalendarColumn.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.isChangeDate = this.isChangeDate.bind(this);
        this.bindTimelineAccess = this.bindTimelineAccess.bind(this);
        this.bindTimelineScroller = this.bindTimelineScroller.bind(this);
        this.setCalendarStates = this.setCalendarStates.bind(this);
        this.toggleCreateOrderUi = this.toggleCreateOrderUi.bind(this);
        this.scrollTimeline = this.scrollTimeline.bind(this);
        this.autoScrollTimeline = this.autoScrollTimeline.bind(this);
        this.autoFlowTimeline = this.autoFlowTimeline.bind(this);
        /* 예약카드 슬라이더 관련 */
        this.isUserCard = this.isUserCard.bind(this);
        /* STAFF 관련 */
        this.renderStaff = this.renderStaff.bind(this);
        this.getSlotStaff = this.getSlotStaff.bind(this);
        this.staffInputCheck = this.staffInputCheck.bind(this);
        this.insertStaffInterface = this.insertStaffInterface.bind(this);
        this.bindResourcesToTimeLine = this.bindResourcesToTimeLine.bind(this);
        /* SCHEDULE 관련*/
        this.bindEventsToTimeLine = this.bindEventsToTimeLine.bind(this);
        /* 기타 */
        this.test = this.test.bind(this);
    }

    test (e) {
        let {Calendar} = this.refs;
        let component = this;
        //this.props.changeView('agendaWeekly');
        //ReactDOM.unmountComponentAtNode(document.getElementById('root'));
        // 상태코드 변경
        $(Calendar).fullCalendar('getEventSources')[0].events[1].status = '00';
        $(Calendar).fullCalendar('rerenderEvents');
    }

    setTodayButton (date) {
      // 오늘날짜인경우 today 버튼 비활성화
      if (date.isSame(moment(new Date()), 'day')) {
          $('.fc-todayTimeline-button').prop('disabled', true);
      } else {
          $('.fc-todayTimeline-button').prop('disabled', false);
      }
    }

    setCalendarStates () {
      let { Calendar } = this.refs;
      let renderedStaff = $(Calendar).fullCalendar('getResources');
      let timelineDate = $(Calendar).fullCalendar('getDate');

      this.setState({
        renderedStaff: renderedStaff,
        timelineDate: timelineDate.format()
      });

      this.props.setTimelineDate(timelineDate);
    }

    // 이벤트 element를 타임라인 바깥영역으로 드래그 시 타임라인 스크롤링 이벤트
    autoFlowTimeline(x, y, jsEvent) {
        var timelineContainer = $('.fc-view-container'),
            timeline = $(timelineContainer).find('> .fc-agendaDay-view'),
            offset = timelineContainer.offset();
        var max = {
            left: offset.left,
            right: offset.left + timelineContainer.width()
        };
        var thisLeft = $(timelineContainer).scrollLeft();

        if(thisLeft <= timeline.width() - timelineContainer.width()) {
          if (x <= max.left + 1) {
              $(timelineContainer).scrollLeft(thisLeft - 5);
          } else if (x >= max.right - 1) {
              $(timelineContainer).scrollLeft(thisLeft + 5);
          }
        }
    }

    // 일, 주단위 타임라인 스크롤 트리거 공통
    autoScrollTimeline(selector, getTimeout, callback) {
        var timeline = $('.fc-time-grid-container');
        var timeout;
        if (getTimeout > 0) {
            timeout = getTimeout;
        } else {
            timeout = 0;
        }
        var x = ($(selector).parents('td:eq(0)').position().left - 36) - ($(timeline).width() / 2 - $(selector).width());
        var y = (Number($(selector).css('top').replace('px', '')) - 24) - ($(timeline).height() / 2 - $(selector).height());

        setTimeout(function() {
            $(timeline).scrollTop(0).stop().animate({
                scrollTop: y,
                scrollLeft: x
            }, 200, function() {
                if (callback)
                    callback();
                }
            );
        }, timeout);
    }

    // 다수의 Staffs 를 렌더링했을 때, 각 Expert timeline의 최소 width를 적용함,
    // 각 Expert timeline의 th에 expert input 을 삽입함.
    setCalendarColumn (type, staffs) {
        let {Calendar} = this.refs;
        let component = this;
        let windowWidth = $(window).width();
        let headerWidth = $('#header').width();
        let columnWidth = null;
        let columnMinWidth = 450;
        let timeSlatWidth = 50;
        let staffLength = $(Calendar).fullCalendar('getResources').length;
        let selector = $('.fc-head-container .fc-resource-cell');
        let timeGridHeader = $('.fc-resource-header');

        var scroller = $('#daily .fc-view-container');
        var handleStart = 'mousedown';
        var handleMove = 'mousemove';
        var handleEnd = 'mouseup';
        var startPos;
        var dragPos;
        var scrollPos;

        // return: binded controler elements
        var getStaffControlerEl = function(staff, isMulti) {
          var wrapEl = $('<div class="fc-resource-header-each" />');
          var innerEl = $('<div class="fc-resource-header-inner" />')
            .appendTo(wrapEl)
            .prepend('<div class="fc-resource-label">'+ staff.nickname +'</div')
            // 드래그관련 바인딩
            .on(handleStart, function (e) {
                scrollPos = $(scroller).scrollLeft();
                startPos = e.pageX;
                $(window)
                  .on(handleMove, function (e) {
                      dragPos = startPos - e.pageX;
                      $(scroller).scrollLeft(dragPos + scrollPos);
                      //$(scroller).scrollLeft($(scroller).scrollLeft()+1);
                  })
                  .on(handleEnd, function (e) {
                      $(window).off(handleMove);
                  });
            })

          // 다중 타임라인을 렌더링한경우: 타임라인 언마운트 버튼삽입
          if (isMulti) {
            $('<button class="fc-resource-button" />').appendTo(innerEl)
            .on('click', function() {
              // destroy staff timeline
              $('#expert_' + staff.id).prop('checked', false);
              component.renderStaff(staff, $('#expert_' + staff.id));
            })
          }

          return wrapEl;
        }

        // insert timeline rendering controler
        var insertStaffControler = function () {
          $(selector).each(function(i, element) {
              var staff = Functions.getStaff($(this).data('resource-id'), component.props.staffs);
              $(timeGridHeader).append(getStaffControlerEl(staff, $(selector).length > 1));
          });
          $('.fc-resource-header-each').css('width', 100/$('.fc-resource-header-each').length +'%')
        };

        // insert timeline Scrolling controler
        var insertTimelineControler = function () {
          $('.fc-resource-controler-wrap').insertBefore('.fc-view-container');
        }

        // 다중 타임라인을 렌더한경우: 스크린 사이즈 및 각 타임라인 최소사이즈 등을 고려하여 width를 적용함
        var setTimelineSize = function () {
          if (
              staffLength >= 2 &&
              windowWidth < (headerWidth + timeSlatWidth + (columnMinWidth * staffLength))
            ) {
              $('.fc-view-container .fc-agendaDay-view').width(timeSlatWidth + (columnMinWidth * staffLength));
          } else {
              $('.fc-view-container .fc-agendaDay-view').attr('style', '');
          }
        }

        switch (type) {
                // case ************************************************ //
            case 'init':
                insertStaffControler();
                insertTimelineControler();
                break;
                // case ************************************************ //
            case 'again':
                insertStaffControler();
                setTimelineSize();
                break;
                // case ************************************************ //
            case 'destroy':
                break;
                // case ************************************************ //
            case 'resize':
                break;
            default:
                break;
        }

    }


    // 타임라인 좌우 스크롤시 타임라인 시간 그리드 스크롤 바인딩
    bindTimelineScroller () {
      var scroller = $('#daily .fc-view-container');
      var timeGridAxis = $('#daily .fc-slats-clone');
      var thisX = $(scroller).scrollLeft();
      var thisY = $(scroller).scrollTop();
      $(scroller).on('scroll', function(e) {
        var thisNewX = $(this).scrollLeft();
        //console.log(thisNewX);
        if (thisX !== thisNewX)
          $(timeGridAxis).css('left', thisNewX);
          thisX = thisNewX;
      })
    }

    // 타임라인 controler를 통한 스크롤
    scrollTimeline (dir) {
      var scroller = $('#daily .fc-view-container');
      var timelineSize = $('.fc-bg td.fc-day.fc-widget-content').eq(0).width();
      if (dir === 'prev') {
        $(scroller).stop().animate({
          scrollLeft: $(scroller).scrollLeft() - timelineSize
        }, 200);
      } else {
        $(scroller).stop().animate({
          scrollLeft: $(scroller).scrollLeft() + timelineSize
        }, 200);
      }
    }

    /// 타임라인 빈 슬롯에 마우스오버시 신규생성 버튼 활성화 관련 바인딩 ///
    bindTimelineAccess () {
      let { Calendar } = this.refs;
      let component = this;

      // get today and variabling
      var getDate = $(Calendar).fullCalendar('getDate'),
          d = getDate.format('YYYY-MM-DD'),
          // slot / button variabling
          createButtonElem = $('.create-order-wrap.timeline'),
          createHelperSlot,
          getStaffs = $(Calendar).fullCalendar('getResources');

      // case 1__1 : expert 1명의 타임라인을 보고있는 경우
      if (getStaffs.length === 1) {
          createHelperSlot = $('.fc-agendaDay-view .fc-time-grid-container .fc-slats').not($('.fc-slats-clone')).find('tr');
          // style aplly
          $('.fc-agendaDay-view .fc-time-grid .fc-bg').css('z-index', '0');
          $('.fc').removeClass('multi-experts');
      // case 1__2: expert 2명 이상의 타임라인을 보고있는 경우
      } else {
          createHelperSlot = $('.fc-agendaDay-view .fc-time-grid .fc-bg .fc-day .fc-create-helper tr');
          $('.fc-day-grid .fc-create-helper').remove();
          $('.fc').addClass(`expert-${getStaffs.length}`);
          $('.fc').addClass('multi-experts');
      }
      for (let i = 2; i <= 10; i++) {
          $('.fc').removeClass(`expert-${i}`);
      }

      // **** ↓ 마우스 오버시 해당 슬롯에 -> 1.'예약생성버튼 삽입' 2. '슬롯 하이라이트 버튼 삽입' - [공통] ↓ **** //
      // ( mouseenter 바인딩 부분에 해당 slot에 예약카드가 있는지 체크하는 추가 개발이 필요합니다 )
      $(createHelperSlot).each(function(parentIndex, parentElem) {
          $(parentElem).find('.fc-slot').each(function() {
              $(this).on({
                  mouseenter: function(e) {
                      if (component.state.isDragging || component.state.isRenderConfirm)
                          return false;

                      // init hidden ui buttons
                      $('.create-order-wrap.timeline .create-order-ui-wrap').hide();

                      // current time setting
                      var thisService = Functions.getService(component.state.newScheduleService, component.props.services);
                      var slotTime = 'T' + $(parentElem).data('time');
                      var selectedTime = d + slotTime;
                      var mouseenteredTime = moment($(parentElem).data('time'), "HH:mm:ss");
                      var addedProductTime = moment(
                          JSON.parse(JSON.stringify(mouseenteredTime))
                        ).add(component.state.newScheduleServiceTime, 'minutes');
                      var color = '';
                      if (component.state.newScheduleService && thisService)
                          color = thisService.color;

                      // current slot time display
                      if (component.state.unknownStart) {
                          $(createButtonElem).find('.time').html(mouseenteredTime.format("a hh:mm") + ' - ' + addedProductTime.format("a hh:mm"));
                      } else {
                          $(createButtonElem).find('.time').html(mouseenteredTime.format("A hh:mm"));
                      }

                      // data set selectedDate
                      component.props.getSlotTime(true, selectedTime);

                      // insert create button
                      $(this).append($(createButtonElem).show());
                      if (component.state.newScheduleServiceTime) {
                          let className = (component.state.isEditSchedule
                              ? 'shc-edit'
                              : component.state.isRequestReservation
                                  ? 'shc-edit'
                                  : component.state.isCreateOfftime
                                      ? 'shc-off-time'
                                      : '');
                          let fullTimeFormat = addedProductTime.format('HH:mm:ss');

                          $('.shc').removeClass('shc');
                          let elems = $(this).parent(parentElem).nextUntil(`tr[data-time="${fullTimeFormat}"]`);
                          $(elems).each(function(i, elem) {
                              $(elem).addClass(`shc${color
                                  ? ' shc-' + color
                                  : ''}${className
                                      ? ' ' + className
                                      : ''}`);
                              if (i === elems.length - 1)
                                  $(elem).addClass('shc-end');
                              }
                          );
                      }

                  },
                  mouseleave: function(e) {
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
    }

    // Expert Interface Element 캘린더 날짜 하단으로 삽입
    insertStaffInterface () {
      // $('.expert-daily').appendTo($('.fc-widget-header-custom'));
      $('.expert-daily').insertAfter($('.fc-toolbar.fc-header-toolbar'));
    }

    getSlotStaff() {
      var createButtonElem = $('.create-order-wrap.timeline');
      if (this.state.renderedStaff.length > 1) {
        return Functions.getStaff(
          $(createButtonElem).parents('td.fc-day.fc-widget-content').data('resource-id'),
          this.props.staffs
        );
      } else {
        return this.state.renderedStaff[0];
      }
    }

    // 타임라인 내 예약생성 (+) 버튼 클릭시 ui toggling
    toggleCreateOrderUi(e) {
        this.setState({
          selectedStaff: this.getSlotStaff(),
          selectedDate: this.props.getSlotTime()
        });

        // Ui 버튼 toggle
        $('.timeline .create-order-ui-wrap').toggle();
        // 타임라인 내 신규예약생성 버튼 클릭시 z index 스타일 클래스 추가
        if (this.state.renderedStaff.length <= 1) {
            $('.fc-agendaDay-view .fc-time-grid .fc-slats').not($('.fc-slats-clone')).addClass('create-order-overlap');
        }
    }

    // 예약카드 삭제 1단계
    removeConfirm(schedule) {
        this.props.isModalConfirm('removeEvent');
        this.setState({
          isModalConfirm: true,
          selectedSchedule: schedule
        });
    }

    // 예약카드 삭제 2단계 최종삭제
    removeSchedule(schedule) {
        let component = this;
        let {Calendar} = this.refs;
        let scheduleId = schedule
            ? schedule.id
            : component.state.selectedSchedule.id;
        $(Calendar).fullCalendar('removeEvents', [scheduleId]);
        this.modalConfirmHide();
        this.setState({
          selectedSchedule: undefined
        });
    }

    modalConfirmHide() {
        this.setState({isModalConfirm: false});
    }

    // reset states and styles ( off-time 이벤트는 해당하지않음 )
    resetOrder() {
        let {Calendar} = this.refs;
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
        if ($('.create-order-overlap').length)
            $('.create-order-overlap').removeClass('create-order-overlap');

        // store isModalConfirm init
        this.props.isModalConfirm('');

        // enable editable
        if (this.state.newScheduleId) {
            let evt = $(Calendar).fullCalendar('clientEvents', this.state.newScheduleId)[0];
            evt.editable = true;
            setTimeout(function() {
                $(Calendar).fullCalendar('updateEvent', evt);
            }, 0);
        }

        // reset states
        this.setState({
            viewTypeOrder: undefined,
            newSchedule: undefined,
            selectedStaff: undefined,
            selectedDate: undefined,
            selectedSchedule: undefined,
            renderedEvent: undefined,
            newScheduleId: undefined,
            newScheduleService: undefined,
            newScheduleServiceTime: undefined,
            unknownStart: false,
            isEditSchedule: false,
            isRequestReservation: false,
            isModalConfirm: false,
            isRenderConfirm: false
        });
    }

    backToOrder(id) {
        let {Calendar} = this.refs;
        let eventId = id || this.state.newScheduleId;

        if (eventId) {
            $(Calendar).fullCalendar('removeEvents', [eventId]);
        }
        //  reset styles and states
        $('.fc-scroller.fc-time-grid-container').scrollTop(0);
        $('.create-order-wrap.timeline button.create-event').unbind('click');
        $('.fc-fake-event').remove();
        this.setState({isRenderConfirm: false, newScheduleServiceTime: undefined});
    }

    // Offtime 스케쥴 생성 1/2 (바인딩단계)
    bindNewOfftime(order, type) {
        switch (order) {
            // 타임라인 테이블 안에서 시작시간을 지정하여 생성하는 경우
            case 'timeline':
                /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
                $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                $('.timeline .create-order-ui-wrap').hide();

                this.renderNewOfftime();
                break;
            // '주 단위' 에서 시작시간을 지정하지 않고 생성하는 경우
            case 'weekly':
                this.changeView('agendaWeekly');
                break;
            default:
                break;
        }
        // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
        if ($('.create-order-overlap').length)
            $('.create-order-overlap').removeClass('create-order-overlap');
    }

    // offtime 생성 2/2
    renderNewOfftime() {
        const component = this;
        const { Calendar } = component.refs;

        const defaultMinute = 20;
        const scheduleObject = {
            reservation_dt: moment(this.state.selectedDate).format('YYYY-MM-DD'),
            start_time: moment(this.state.selectedDate).format('HH:mm'),
            end_time: moment(this.state.selectedDate).add(defaultMinute, 'minute').format('HH:mm'),
            status: actions.ScheduleStatus.OFFTIME,
            staff_id: this.state.selectedStaff.id,
            start: moment(this.state.selectedDate),
            end: moment(this.state.selectedDate).add(defaultMinute, 'minute'),
            title: 'off-time',
            resourceId: this.state.selectedStaff.id,
        }

        component.props.saveSchedule(scheduleObject).then((response) => {
            // off-time 저장 후 반환된 데이터 (올바르게 생성되었는지 확인해야 함)
            if (!response.createdSchedule.success)
                return;

            const createdSchedule = response.createdSchedule.data;
            const createdScheduleDom = $(`#ID_${createdSchedule.id}`);

            createdScheduleDom.addClass('new-event');
            $('.create-order-wrap.fixed').removeClass('hidden');
            component.props.guider('OFF TIME이 생성되었습니다!');

            // Todo: 함수 분리 필요
            // component.state.isAbleBindRemoveEvent 가 true일경우 ESC key등의 이벤트 발생시 삭제가 가능하도록 접근성 바인딩을 합니다
            $(document).bind('keydown', (e) => {
                if (e.which === 27 && !component.state.isModalConfirm) {
                    component.props.patchSchedule(createdSchedule).then((responses) => {
                        if (!responses.updatedSchedule.success)
                            return;
                        // 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                        $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                        $(Calendar).fullCalendar('removeEvents', [createdSchedule.id]);
                        component.props.guider('OFF TIME이 삭제되었습니다!');
                    });
                    $(document).unbind('keydown');
                }
            });

            // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
            $('body').one('click', () => {
                createdScheduleDom.removeClass('new-event');

                $(document).unbind('keydown');
            });
        });
    }

    // 예약 변경시 이벤트를 렌더링합니다 (실제 이벤트를 생성한 후 최종확인 버튼을통해 삭제할지 말지 결정합니다)
    fakeRenderEditEvent(editEvent, rerender) {
        let component = this;
        let {Calendar} = this.refs;
        console.log(editEvent);
        // rerendering 일 경우 이벤트를 다시 등록한다
        if (rerender)
            $(Calendar).fullCalendar('renderEvent', editEvent, true); // stick? = true
        var thisService = Functions.getService(editEvent.product, component.props.services);
        let realEventElem = $('#ID_' + editEvent.id).hide();
        let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editEvent.id + '_FAKE').show();
        $(fakeEventElem).addClass('new-event edit').appendTo($('.fc-time-grid-container td[data-date="' + moment(editEvent.start).format('YYYY-MM-DD') + '"]'));
        $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
        this.setState({
            newScheduleId: editEvent.id,
            newSchedule: $.extend(editEvent, {
                class: thisService ? thisService.color : ''
            }),
            newScheduleServiceTime: Functions.millisecondsToMinute(moment(editEvent.end).diff(moment(editEvent.start)))
        });
        // 이벤트 생성버튼 Click 바인딩
        $('.create-order-wrap.timeline button.create-event').ready(function() {
            $('.create-order-wrap.timeline button.create-event').bind('click', function() {
                // 렌더링 된 이벤트 삭제
                $(fakeEventElem).remove();
                fakeEventElem = null;
                $(Calendar).fullCalendar('removeEvents', [editEvent.id]);
                // 수정된 이벤트 객체 정보
                let getEventObj = component.refs.NewOrder.getEventObj();
                let editEventObj = component.props.returnEventObj(getEventObj);
                let editedStart = moment(component.state.selectedDate);
                let editedEnd = moment(component.state.selectedDate).add(component.state.newScheduleServiceTime, 'minutes');
                let insertEvent = $.extend(editEventObj, {
                    id: editEvent.id,
                    resourceId: component.state.selectedStaff.id,
                    start: editedStart,
                    end: editedEnd
                });
                // 수정된 이벤트 렌더링
                $(Calendar).fullCalendar('renderEvent', insertEvent, true); // stick? = true
                realEventElem = $('#ID_' + editEvent.id);
                fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editEvent.id + '_FAKE');
                $(fakeEventElem).addClass('new-event edit').appendTo($('.fc-time-grid-container td[data-date="' + editedStart.format('YYYY-MM-DD') + '"]'));
                $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
                component.setState({
                    isRenderConfirm: true,
                    editedDate: {
                        start: editedStart,
                        end: editedEnd
                    }
                }, () => {
                    // 수정된 이벤트 임시 렌더링 후의 취소버튼 바인딩
                    $('.render-confirm-inner').ready(function() {
                        $('.render-confirm-inner').find('.cancel').unbind('click'); // 중복 바인딩 방지
                        $('.render-confirm-inner').find('.cancel').bind('click', function() {
                            // fake 이벤트레이어 삭제
                            $('.fc-fake-event').remove();
                            $(fakeEventElem).remove();
                            // 수정된 이벤트를 임시 삭제
                            $(Calendar).fullCalendar('removeEvents', [editEvent.id]);
                            $('.render-confirm-inner').find('.cancel').unbind('click');
                            $('.render-confirm-inner').remove();
                            // reset states and remove dom elements and event
                            component.setState({isRenderConfirm: false});
                            // 수정전의 이벤트를 인수로 넘겨 함수를 재실행한다
                            component.fakeRenderEditEvent(editEventObj, true);
                        });
                    });
                });
                $(this).unbind('click');
            });
        });
    }

    isChangeDate(condition) {
        this.setState({isChangeDate: condition});
    }

    // 상단 datepicker 컨트롤러를 통해 타임라인 날짜를 변경할때
    changeDate(date) {
        let {Calendar} = this.refs;
        $(Calendar).fullCalendar('gotoDate', date);
        this.setState({ isChangeDate: false });
        this.props.changeDate(date);
    }

    // 예약정보수정
    editSchedule(schedule) {
        let {Calendar} = this.refs;
        let component = this;
        let type = schedule.service.status === actions.ScheduleStatus.OFFTIME
            ? 'off-time'
            : 'edit';
        // 예약카드 상세보기에서 예약수정을 클릭한경우
        if (this.state.isUserCard) {
            this.isUserCard(false);
        }
        // view change시, 선택된 이벤트의 expert를 기본 expert로 렌더링하도록 설정해준다
        this.setState({
            priorityStaff: Functions.getStaff(schedule.resourceId, this.props.staffs),
            lastStaff: Functions.getStaff(schedule.resourceId, this.props.staffs),
            selectedStaff: Functions.getStaff(schedule.resourceId, this.props.staffs),
            viewTypeOrder: 'agendaDay'
        }, () => {
            // view change시, 선택된 이벤트의 요일이 처음으로 오도록 설정해준다
            let fcOptions = {
                firstDay: moment(schedule.reservation_dt).day(),
                gotoDate: moment(schedule.reservation_dt).format('YYYY-MM-DD'),
                editable: false
            };
            $(Calendar).fullCalendar('option', fcOptions);
            this.changeView('agendaWeekly', function() {
                component.autoScrollTimeline($('#ID_' + schedule.id));
            });
            this.fakeRenderEditEvent(schedule);
        });
        this.setState({isEditSchedule: true});
    }

    // 신규예약 생성단계로 컴포넌트 마운팅
    newOrder(type) {
        let {Calendar} = this.refs;

        var selectedStaff;
        if (type === 'unknownStart') {
           selectedStaff = this.state.renderedStaff.length > 1 ?
             this.state.defaultStaff :
             this.state.renderedStaff[0];
        } else {
          selectedStaff = this.state.selectedStaff;
        }

        this.props.newOrder({
          type: type,
          staff: selectedStaff,
          start: this.state.selectedDate,
          schedule: null
        });
    }


    isRenderEventConfirm(bool) {
        this.setState({isModalConfirm: bool});
    }

    isUserCard(bool, options) {
        if (bool) {
            this.props.initUserCard(options);
        }
        this.setState({isUserCard: bool});
    }

    // init Epxert UserInterfact checking
    staffInputCheck () {
        let {Calendar} = this.refs;
        let {
            isCreateOfftime,
            isEditSchedule,
            lastStaff,
            defaultStaff,
            renderedStaff,
            priorityStaff
        } = this.state;

        if (priorityStaff) {
            $('.expert-each.checkbox[data-id="expert_' + priorityStaff.id + '"]')
              .attr('data-active', true)
              .find('input')
              .prop('checked', true);
            $(Calendar).fullCalendar('addResource', priorityStaff);
            for (let i = 0; i < renderedStaff.length; i++) {
                if (priorityStaff.id !== renderedStaff[i].id)
                    $(Calendar).fullCalendar('removeResource', renderedStaff[i].id);
            }
            // 1-1 : 2명이상의 Expert를 렌더링 했었을경우 > 1순위인 Default Expert로 렌더링
        } else {
            $('.expert-each.checkbox[data-id="expert_' + defaultStaff.id + '"]')
              .attr('data-active', true)
              .find('input')
              .prop('checked', true);
        }
    }


    changeView(type, callback) {
        this.props.changeView(type);
        if (callback)
            setTimeout(callback, 100);
    }

    // show and hide calendar each experts: only dailyTimeline
    renderStaff(staff, input, isRemoveSiblings) {
        //this.props.loading(true);
        let {Calendar} = this.refs;
        let component = this;
        let element = $(input);
        let Staffs = this.props.staffs;

        console.log(element.prop('checked'), staff)

        // 1. Expert Show
        if (element.prop('checked')) {
            // $('.fc-view-container').addClass('fade-loading');
            // 1-1 All of experts
            if (staff === 'all') {
                $('.expert-each.checkbox').attr('data-active', true).find('input').prop('checked', true);

                for (let i = 0; i < Staffs.length; i++) {
                    $(Calendar).fullCalendar('addResource', Staffs[i], true);// 1-2 Each Expert;
                }
            } else {
                $(Calendar).fullCalendar('addResource', staff);
                if (isRemoveSiblings) {
                    for (let i = 0; i < this.state.renderedStaff.length; i++) {
                        $(Calendar).fullCalendar('removeResource', this.state.renderedStaff[i].id);
                        $('.expert-each.checkbox').attr('data-active', false).find('input').prop('checked', false);
                        element.parent('.expert-each').attr('data-active', true);
                    }
                }
                element.parent('.expert-each').attr('data-active', true);
                // 모두선택이 될 경우
                if ($('.expert-each.checkbox').find('input:checked').length === $('.expert-each.checkbox').find('input').length - 1) {
                    $('input#expert_all').prop('checked', true);
                }
                this.setState({
                    prevStaff: this.state.lastStaff || this.state.defaultStaff,
                    prevStaffAll: this.state.renderedStaff,
                    lastStaff: staff
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
            if (staff === 'all') {
                // 1순위 defaultStaff를 제외한 Staffs의 Input값 해제
                $('.expert-each.checkbox input').each(function(i, elem) {
                    if (component.state.defaultStaff.id == $(elem).val()) {
                        $(elem).prop('checked', true);
                    } else {
                      console.info(3);
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
                if (this.state.renderedStaff.length <= 2) {
                    this.setState({
                        lastStaff: Functions.getStaff($('.expert-each.checkbox').find('input:checked').val(), component.props.staffs),
                        prevStaff: undefined
                    });
                } else {
                    this.setState({
                        lastStaff: this.state.prevStaff || this.state.defaultStaff,
                        prevStaff: undefined
                    });
                }
                element.parent('.expert-each').attr('data-active', false);
                $(Calendar).fullCalendar('removeResource', staff.id);
            }
            // $('.fc-view-container').addClass('fade-loading');
        }
    }

    componentDidMount() {
        const component = this;
        let {Calendar} = this.refs;
        let Staffs = this.props.staffs;
        var date = this.props.fcOptions.defaultDate;
        var time = date.get('hour');
        var day = date.get('date');
        var month = date.get('month');
        var firstDay = date.format('d');
        var defaultScrollTime = date.subtract(1, 'hour').format('HH:mm'); //현재시간으로부터 1시간 이전의 시간
        var staffsUiHeight = $('.expert-ui.expert-daily').height();
        this.setState({defaultStaff: _.isEmpty(Staffs) ? undefined : Staffs[0]});

        // 스케쥴러 init 실행
        $(Calendar).fullCalendar($.extend(component.props.fcOptions, {
            resources: [Staffs[0]],
            events: component.props.schedules, //스케쥴 이벤트*
            shopServices: component.props.services,
            defaultView: 'agendaDay', // init view type set
            header: {
                left: '',
                center: 'prev title next, changeDate',
                right: 'agendaViewSwitch'
            },
            titleFormat: 'YYYY. M. DD',
            firstDay: firstDay,
            scrollTime: defaultScrollTime, //초기 렌더링시 스크롤 될 시간을 표시합니다
            customButtons: {
                prev: {
                    text: '이전',
                    click: () => {
                        component.changeDate($(Calendar).fullCalendar('getDate').subtract(1, 'days'));
                    }
                },
                next: {
                    text: '이전',
                    click: () => {
                        component.changeDate($(Calendar).fullCalendar('getDate').add(1, 'days'));
                    }
                },
                changeDate: {
                    text: '날짜선택',
                    click: function(e) {
                        e.stopPropagation();
                        component.isChangeDate(true);
                    }
                },
                agendaViewSwitch: {
                    text: 'WEEKLY',
                    click: function () {
                        component.props.changeView('agendaWeekly');
                    }
                },
                todayTimeline: {
                    text: 'TODAY',
                    click: function() {
                        component.changeDate(moment(date));
                    }
                }
            },
            height: window.innerHeight - staffsUiHeight,

            // 예약마감
            reserveDeadline: function () {
                console.info('예약마감을 하시겠습니까?');
            },

            eventClick: function(schedule, jsEvent, view) {
                console.info(schedule)
                component.setState({
                    selectedSchedule: schedule
                });
                // 이벤트 슬롯 삭제 및 수정버튼 바인딩
                if (!component.state.isEditSchedule) {
                    // *** 1_수정 ***
                    if (jsEvent.target.className === 'fc-ui-edit') {
                        component.editSchedule(schedule);
                    // *** 2_삭제 ***
                    } else if (jsEvent.target.className === 'fc-ui-delete') {
                        component.props.isModalConfirm('removeEvent');
                        component.setState({
                          isModalConfirm: true
                        });
                    }
                }
            },
            eventDragStart: function(schedule, jsEvent, ui, view){
                component.setState({isDragging: true});

                // daily 이벤트 드래그관련 타임라인 스크롤
                $(document).bind('mousemove', function(e) {
                    component.autoFlowTimeline(e.pageX, e.pageY, jsEvent);
                });
            },
            eventDragStop: function(schedule, jsEvent, ui, view) {
                // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
                component.setState({isDragging: false});

                $(document).unbind('mousemove');
            },
            eventDrop: function(event, delta, revertFunc, jsEvent, ui, view ) {
                const start_time = moment(event.start).format('HH:mm');
                const end_time = moment(event.end).format('HH:mm');
                const staff_id = parseInt(event.resourceId);
                // console.info(staff_id);
                // prevent (Converting circular structure to JSON) error
                const scheduleData = {
                    ...event,
                    start_time,
                    end_time,
                    staff_id,
                    source: {}
                };

                component.props.patchSchedule(scheduleData).then((response) => {
                    if (!response.updatedSchedule.success)
                        revertFunc();
                });
            },
            // 변경된 시간이 다를경우 실행
            eventResize: function(schedule, delta, revertFunc, jsEvent, ui, view) {
                const { start, end } = schedule;
                const serviceTime = end.diff(start, 'minutes');
                const start_time = start.format('HH:mm');
                const end_time = end.format('HH:mm');

                // 20분 미만으로 이벤트 시간을 수정할 경우 수정을 되돌린다.
                if (serviceTime < 20) {
                    revertFunc();
                    alert('변경할 수 없습니다');

                    return;
                }

                // 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
                $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());

                // 30분 이하의 이벤트의 element에 클래스 추가
                if (serviceTime <= 30) {
                    // 20분 이하의 이벤트인경우
                    if (serviceTime <= 20)
                        $('.fc-event#ID_' + schedule.id).addClass('fc-short');
                    else
                        $('.fc-event#ID_' + schedule.id).addClass('fc-short no-expand');
                }

                if (schedule.id === component.state.newScheduleId) {
                    // off-time slot의 new evnet 클래스 시각적 제거
                    $('#ID_' + schedule.id).removeClass('new-event');
                }
            },
            eventResizeStart: function(schedule, jsEvent, ui, view) {
                component.setState({isDragging: true});
            },
            // 변경된 시간이 같더라도 항상 실행
            eventResizeStop: function(schedule, jsEvent, ui, view) {
                component.setState({isDragging: false});
            },
            windowResize: function(view) {
                $(Calendar).fullCalendar('option', 'height', window.innerHeight - staffsUiHeight);
                component.setCalendarColumn('resize');
            },
            resourceRender: function(resourceObj, labelTds, bodyTds) {
                // ...
            },
            eventRender: function(schedule, element, view) {

            },
            // 캘린더 이벤트 day 렌더링시
            dayRender: function(d, cell) {
                // 필요없는 node dom 삭제(all day slot 관련한 dom)
                $('.fc-day-grid.fc-unselectable').remove();
            },
            // 캘린더 이벤트 view 렌더링시
            viewRender: function(view, elem) {
                console.info('VIEW Render');
                let { Calendar } = component.refs;

                // [1] Daily 타임라인이 다시 렌더링 된 경우
                if (component.state.alreadyRendered) {
                    component.setCalendarColumn('again');
                }
                // [2] Daily 타임라인이 처음 렌더링 된 경우
                else {
                    component.staffInputCheck();
                    component.setCalendarColumn('init');
                    component.setState({
                      alreadyRendered: true
                    });
                }
                // [3] Daily 타임라인이 그려질 때 마다 실행
                component.bindTimelineAccess();
                component.bindTimelineScroller();
                component.setTodayButton(view.start);
                component.setCalendarStates();
                component.insertStaffInterface();

                // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
                $('.create-order-overlap').removeClass('create-order-overlap');
                // $('.fade-loading').removeClass('fade-loading');
                // loading bar hide
                // component.props.loading(false);

            }, //end viewRender
            viewDestroy: function(view, elem) {
                // Expert input element 제거되는것을 방지함
                component.setCalendarColumn('destroy');
            },
            // open customer card
            eventDoubleClick: function(calSchedule, jsEvent, view) {
                // 신규예약 생성중에는 더블클릭 이벤트 실행않함
                if (component.state.isNewOrder)
                    return false;
                // OFF TIME 인경우
                if (calSchedule.status === actions.ScheduleStatus.OFFTIME)
                    return false;

                // *****고객카드 슬라이더를 호출함******
                let selectedDate = moment(calSchedule.reservation_dt);
                // 더블클릭으로 선택된 이벤트객체를 가져옵니다
                let selectedCard = calSchedule;
                // 선택된 이벤트객체의 리소스ID에 맞는 expert id를 찾아 가져옵니다
                let selectedStaff  = $(Calendar).fullCalendar('getResourceById', selectedCard.resourceId);

                // userCard 컴포넌트의 초기값을 전달한다
                component.isUserCard(true, {
                    selectedDate: selectedDate,
                    selectedCard: selectedCard,
                    selectedStaff: selectedStaff
                });
                /*****************************/
            }
        }));

        this.props.wasMount();

    } //////// ComponentDidMount //END

    componentWillMount() {
        // show Loading bar
        // this.props.loading(true);
    }

    componentWillUnmount() {
        let {Calendar} = this.refs;

        // 예약생성 단계에서 un mount시 임시로 렌더링한 이벤트를 삭제.
        if (this.state.isRenderConfirm) {
            $(Calendar).fullCalendar('removeEvents', [this.state.newScheduleId]);
        }
        $(Calendar).fullCalendar('destroy');
    }

    componentWillReceiveProps(nextProps) {
        // 예약요청확인 이벤트 클릭시
        if (nextProps.requestReservation.condition) {
            // 함수 실행과 동시에 중복실행을 막기위해 store state 초기화
            this.props.finishRequestReservation();
            // 예약생성(예약요청확인)으로 넘어감
            this.goToRequestReservation(nextProps.requestReservation);
        }

        if(this.props.staffs !== nextProps.staffs)
            this.bindResourcesToTimeLine(nextProps.staffs);

        if(this.props.schedules !== nextProps.schedules)
            this.bindEventsToTimeLine(nextProps.schedules);
    }

    /**
     * refetchResources with given array
     * and set defaultStaff & renderedStaff
     *
     * @param {array} resources
     */
    bindResourcesToTimeLine(_resources) {
        let {Calendar} = this.refs;

        $(Calendar).fullCalendar('refetchResources', _resources);

        this.setState({
            defaultStaff: _resources ? _resources[0] : undefined,
            renderedStaff: _resources,
            selectedStaff: _resources ? _resources[0] : undefined,
        });
    }

    /**
     * remove previous events and add new events with given array
     *
     * @param {array} events
     */
    bindEventsToTimeLine(events) {
        let {Calendar} = this.refs;

        $(Calendar).fullCalendar('removeEventSources');
        $(Calendar).fullCalendar('addEventSource', events);
    }

    //예약요청확인
    goToRequestReservation(options) {
        const {Calendar} = this.refs;
        const {condition, requestEvent} = options;

        this.setState({
            isEditSchedule: true,
            isRequestReservation: true,
            selectedSchedule: requestEvent,
            lastStaff: Functions.getStaff(requestEvent.resourceId, this.props.staffs),
            selectedStaff: Functions.getStaff(requestEvent.resourceId, this.props.staffs)
          }, () => {
            this.setState({isNewOrder: true});
            // view change시, 선택된 이벤트의 요일이 처음으로 오도록 설정해준다
            let fcOptions = {
                firstDay: moment(requestEvent.start).day(),
                defaultDate: moment(requestEvent.start).format('YYYY-MM-DD')
            };
            $(Calendar).fullCalendar('option', fcOptions);
            this.changeView('agendaWeekly', function() {
                this.autoScrollTimeline($('#ID_' + requestEvent.id));
            });
            this.fakeRenderEditEvent(requestEvent);
        });
    }


    render() {
        let Staffs = this.props.staffs;
        let TimelineControlerComponent = (
          <div className="fc-resource-controler-wrap">
            {this.state.renderedStaff && this.state.renderedStaff.length >= 2 ? (
                <div>
                  <button className="fc-resource-controler prev" onClick={() => this.scrollTimeline('prev')}>이전</button>
                  <button className="fc-resource-controler next" onClick={() => this.scrollTimeline('next')}>다음</button>
                </div>
              )
              : ''
            }
          </div>
        );

        let StaffsInterfaceComponent = null;
        var StaffsInputAll = (
          <div className="expert-each checkbox all">
              <input disabled={this.state.isRenderConfirm}
                className="expert-input"
                type="checkbox"
                name="expert"
                id="expert_all"
                value="all"
                onChange={(input) => this.renderStaff('all', input.target)}
              />
              <label className="expert-label" htmlFor="expert_all"><span>ALL</span></label>
          </div>
        )

        var StaffsInputEach = !_.isEmpty(Staffs) ? Staffs.map((staff, i) => {
            return (
                <div
                  className="expert-each checkbox"
                  data-id={`expert_${staff.id}`}
                  data-active="false"
                  data-priority={staff.priority}
                  key={i}>
                    <input disabled={this.state.isRenderConfirm}
                      className="expert-input"
                      type="checkbox"
                      name="expert" id={`expert_${staff.id}`}
                      value={staff.id}
                      onChange={(input) => this.renderStaff(staff, input.target)}/>
                    <label
                      className="expert-label"
                      htmlFor={`expert_${staff.id}`}>
                        <span>{staff.nickname || staff.staff_name}</span>
                        <i className="today-count">{9}</i>
                    </label>
                </div>
            )
        }) : () => (<div></div>)

        StaffsInterfaceComponent = (
            <div className="expert-wrap">
                <div className="expert-ui expert-daily">
                    <div className="expert-inner">
                        {Staffs && Staffs.length >= 2 && StaffsInputAll}
                        <div className="expert-each-wrap">
                          {StaffsInputEach}
                        </div>
                    </div>
                </div>
            </div>
        );

        let viewview = (
            <dl className="viewview fc">
                <button onClick={() => {$('.viewview.fc').hide()}}>X</button>
                <dt>viewTypeOrder :</dt>
                <dd>{this.state.viewTypeOrder}</dd>
                <dt>isRenderConfirm :</dt>
                <dd>{this.state.isRenderConfirm
                        ? 'true'
                        : ""}</dd>
                <dt>isUserCard :</dt>
                <dd>{this.state.isUserCard
                        ? 'true'
                        : ""}</dd>
                <dt>isChangeDate :</dt>
                <dd>{this.state.isChangeDate
                        ? 'true'
                        : ""}</dd>
                <dt>isRequestReservation:
                </dt>
                <dd>{this.state.isRequestReservation
                        ? 'true'
                        : ""}</dd>
                <dt>isEditSchedule:
                </dt>
                <dd>{this.state.isEditSchedule
                        ? 'true'
                        : ""}</dd>
                <dt>isCreateOfftime:
                </dt>
                <dd>{this.state.isCreateOfftime
                        ? 'true'
                        : ""}</dd>
                <dt>isAbleBindRemoveEvent:
                </dt>
                <dd>{this.state.isAbleBindRemoveEvent
                        ? 'true'
                        : ""}</dd>
                <dt>isModalConfirm :</dt>
                <dd>{this.state.isModalConfirm
                        ? 'true'
                        : ""}</dd>
                <dt>isDragging:
                </dt>
                <dd>{this.state.isDragging && 'true'}</dd>
                <br/>
                <dt>modalConfirmOption :</dt>
                <dd>{this.props.modalConfirmOptionComponent
                        ? this.props.modalConfirmOptionComponent
                        : ""}</dd>
                <dt>editedDate:
                </dt>
                <dd>{this.state.editedDate
                        ? 'true'
                        : ""}</dd>
                <dt>timelineDate:
                </dt>
                <dd>{this.state.timelineDate}</dd>
                <dt>selectedDate:
                </dt>
                <dd>{this.state.selectedDate}</dd>
                <dt>selectedSchedule:
                </dt>
                <dd>{this.state.selectedSchedule
                        ? this.state.selectedSchedule.guest_name + ' ID:' + this.state.selectedSchedule.id
                        : ""}</dd>
                <br/>
                <dt>defaultStaff:
                </dt>
                <dd>{this.state.defaultStaff
                        ? this.state.defaultStaff.label
                        : ""}</dd>
                <dt>priorityStaff:
                </dt>
                <dd>{this.state.priorityStaff
                        ? this.state.priorityStaff.label
                        : ""}</dd>
                <dt>selectedStaff:
                </dt>
                <dd>{this.state.selectedStaff
                        ? this.state.selectedStaff.label
                        : ""}</dd>
                      <dt>prevStaff</dt>
                <dd>{this.state.prevStaff
                        ? this.state.prevStaff.label
                        : ""}</dd>
                      <dt>lastStaff</dt>
                <dd>{this.state.lastStaff
                        ? this.state.lastStaff.label
                        : ""}</dd>
                      <dt>renderedStaff:
                </dt>
                <dd>{this.state.renderedStaff
                        ? this.state.renderedStaff.map((staff, i) => {
                            return staff.nickname + ","
                        })
                        : ""}</dd>
                <br/>
                <dt>newScheduleId:
                </dt>
                <dd>{this.state.newScheduleId}</dd>
                <dt>newScheduleServiceTime:
                </dt>
                <dd>{this.state.newScheduleServiceTime}</dd>
            </dl>
        );

        const test = (
            <button style={{
                'position': 'fixed',
                'left': '180px',
                'top': '0px',
                'zIndex': '10',
                'background': '#eee'
            }} onClick={() => this.test()}>
                CLICK ME!
            </button>
        )

        return (
            <div ref="Calendar" id="daily">
                {TimelineControlerComponent}
                {StaffsInterfaceComponent}
                {this.props.getTodayTimelineButton(this)}
                {this.props.getCreateOrderButtonFixed(this)}
                {this.props.getCreateOrderButtonTimeline(this)}
                {this.props.getDatePickerComponent(this)}
                {this.props.getUserCardComponent(this)}
                {this.props.getModalConfirmComponent(this)}
                {this.props.getRenderConfirmComponent(this, 'agendaDay')}
                {/*viewview*/}
                {test}
            </div>
        );
    }
}


DailyCalendar.defaultProps = {
    requestReservation: {
        condition: false,
        requestEvent: {}
    }
}

DailyCalendar.propTypes = {
    staffs: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        staffs: PropTypes.object,
    }).isRequired,
    schedules: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        schedules: PropTypes.object,
    }).isRequired,
    services: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        services: PropTypes.object,
    }).isRequired,
    guests: PropTypes.shape({
        isFetching: PropTypes.bool,
        didInvalidate: PropTypes.bool,
        guests: PropTypes.object,
    }).isRequired,
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
            dispatch(actions.userCardSchedule(options.selectedCard));
            dispatch(actions.userCardStaff(options.selectedStaff));
            dispatch(actions.userCardDate(options.selectedDate));
        },
        isModalConfirm: (optionComponent) => {
            dispatch(actions.modalConfirm(optionComponent))
        },
        guider: (message) => dispatch(actions.guider({isGuider: true, message: message})),
        loading: (condition) => dispatch(actions.loading(condition)),
        finishRequestReservation: () => dispatch(actions.requestReservation({condition: false, requestEvent: undefined})),
        saveSchedule: scheduleData => dispatch(actions.saveSchedule(scheduleData)),
        patchSchedule: scheduleData => dispatch(actions.patchSchedule(scheduleData)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyCalendar);
