import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import moment from 'moment';
import update from 'react-addons-update';
import NewOrder from '../newOrder';
import 'jquery.nicescroll';
import 'fullcalendar-scheduler';

class WeeklyCalendar extends Component {
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
            isEditEvent: false,
            isCreateOfftime: false,
            isRequestReservation: false,
            unknownStart: false,
            isAbleBindRemoveEvent: false,
            isDragging: false,
            // Staff states
            defaultStaff: undefined, // 관리자가 설정한 1순위 expert
            priorityStaff: undefined, // 타임라인 렌더링시 0순위로 기준이 되는 expert (일부 이벤트 등록시 해당된다)
            // prevStaff: this.props.defaultStaff,  // 이전에 렌더링 된 expert (현재 해당 state 는 사용하지않음)
            // prevStaffAll: undefined,              // 이전에 렌더링 된 experts (현재 해당 state 는 사용하지않음)
            renderedStaff: undefined, // 현재 타임라인에 렌더링 된 expert
            lastStaff: undefined, // 타임라인을 재 렌더링 할때 기준이되는 expert (해당 expert로 렌더링됨)
            // ... etc
            timelineDate: undefined,
            selectedDate: undefined,
            editedDate: undefined,
            selectedSchedule: undefined,
            renderedEvent: undefined,
            newSchedule: undefined,
            newScheduleID: undefined
        };

        /*__________________ 함수 바인딩 __________________*/
        /* 예약 생성 관련 */
        this.newOrder = this.newOrder.bind(this);
        this.newOrderCancel = this.newOrderCancel.bind(this);
        this.backToOrder = this.backToOrder.bind(this);
        this.bindTimelineAccess = this.bindTimelineAccess.bind(this);
        this.renderNewSchedule = this.renderNewSchedule.bind(this);
        this.renderNewScheduleUnknownStart = this.renderNewScheduleUnknownStart.bind(this);
        this.beforeFinalConfirmRenderNewSchedule = this.beforeFinalConfirmRenderNewSchedule.bind(this);
        this.beforeInitConfirmRenderNewSchedule = this.beforeInitConfirmRenderNewSchedule.bind(this);
        this.modalConfirmHide = this.modalConfirmHide.bind(this);
        this.checkBindedStates = this.checkBindedStates.bind(this);
        /* OFFT TIME 관련 */
        this.bindNewOfftime = this.bindNewOfftime.bind(this);
        this.renderNewOfftime = this.renderNewOfftime.bind(this);
        /* 예약 수정/삭제/요청 관련 */
        this.editSchedule = this.editSchedule.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.removeConfirm = this.removeConfirm.bind(this);
        this.goToRequestReservation = this.goToRequestReservation.bind(this);
        /* 캘린더 DOM 관련 */
        this.changeView = this.changeView.bind(this);
        this.bindTimelineScroller = this.bindTimelineScroller.bind(this);
        this.toggleCreateOrderUi = this.toggleCreateOrderUi.bind(this);
        this.setCalendarHeight = this.setCalendarHeight.bind(this);
        this.changeDateBasic = this.changeDateBasic.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.isChangeDate = this.isChangeDate.bind(this);
        this.checkRenderedDate = this.checkRenderedDate.bind(this);
        this.autoScrollTimeline = this.autoScrollTimeline.bind(this);
        this.autoFlowTimeline = this.autoFlowTimeline.bind(this);
        /* 예약카드 슬라이더 관련 */
        this.isUserCard = this.isUserCard.bind(this);
        /* STAFF 관련 */
        this.changeStaff = this.changeStaff.bind(this);
        /* 기타 */
        this.initRender = this.initRender.bind(this);
        this.controler = undefined; // overview timeline 상단 날자 스크롤러(컨트롤러 obj)
        this.test = this.test.bind(this);
    }

    test (e) {
        let {Calendar} = this.refs;
        let component = this;

        console.log($(Calendar).fullCalendar('getView').end.format('YYYY-MM-DD HH:mm:ss'));
        console.log($(Calendar).fullCalendar('getView').intervalEnd.format());
    }

    initRender () {
        let {Calendar} = this.refs;
    }

    /// 타임라인 빈 슬롯에 마우스오버시 신규생성 버튼 활성화 관련 바인딩 ///
    bindTimelineAccess() {
        let { Calendar } = this.refs;
        let component = this;

        // get today and variabling
        var getDate,
            d,
            // slot / button variabling
            createButtonElem = $('.create-order-wrap.timeline'),
            createHelperSlot = $('.fc-agendaWeekly-view .fc-time-grid .fc-bg .fc-day .fc-create-helper tr');

        // **** ↓ 마우스 오버시 해당 슬롯에 -> 1.'예약생성버튼 삽입' 2. '슬롯 하이라이트 버튼 삽입' - [공통] ↓ **** //
        // ( mouseenter 바인딩 부분에 해당 slot에 예약카드가 있는지 체크하는 추가 개발이 필요합니다 )
        $(createHelperSlot).each(function(parentIndex, parentElem) {
            $(parentElem).find('.fc-slot').each(function() {
                $(this).on({
                    mouseenter: function(e) {
                        var case1 = component.state.isDragging;
                        var case2 = component.state.isRenderConfirm;
                        var case3 = component.state.isNewOrder;
                        var case4 = component.refs.NewOrder ? component.refs.NewOrder.state.newOrderStep !== 3 : false;

                        if (case1 || case2 || (case3 && case4))
                          return false;
                        // init hidden ui buttons
                        $('.create-order-wrap.timeline .create-order-ui-wrap').hide();
                        // get current slot's date and variabling
                        d = $(this).parents('td.fc-day').data('date'); // it will be return ( YYYY-MM-DD )

                        // current time setting
                        var slotTime = 'T' + $(parentElem).data('time');
                        var selectedTime = d + slotTime;
                        var mouseenteredTime = moment($(parentElem).data('time'), "HH:mm:ss");
                        var addedProductTime = moment(
                            JSON.parse(JSON.stringify(mouseenteredTime))
                          ).add(component.state.newScheduleServiceTime, 'minutes');
                        var color = '';

                        if (component.state.newScheduleService)
                            color = Functions.getService(component.state.newScheduleService.id, component.props.services).color;

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
                            let className = (component.state.isEditEvent
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

    // 타임라인 에서의 상단 controler 스크롤러 바인딩
    bindTimelineScroller(type) {
        let {Calendar} = this.refs;
        let component = this;

        if (type === 'destroy') {
          $(this.controler).getNiceScroll().remove();
          this.controler = undefined;
          return;
        }

        var controlerElem,
            timeline,

            isScrollingControler = false,
            isScrollingTimeline = false,

            scrollDayFormat,
            initPositionLeft;

        timeline = $('.fc-scroller.fc-time-grid-container');
        controlerElem = $('.fc-head-container .fc-row.fc-widget-header');
        scrollDayFormat = $(Calendar).fullCalendar('getDate').format('YYYY-MM-DD');
        console.log(scrollDayFormat);
        initPositionLeft = $('.fc-agendaWeekly-view .fc-bg td[data-date="' + scrollDayFormat + '"]').position().left;

        this.controler = $(controlerElem);

        // init timeline
        var lastX = $(timeline).scrollLeft(),
            lastY = $(timeline).scrollTop(),
            direction;

        $(timeline).scroll(function() {
            if (isScrollingControler)
                return false;
            isScrollingTimeline = true;

            var thisX = $(this).scrollLeft();
            var thisY = $(this).scrollTop();

            if (lastX < thisX) {
                direction = 'right';
            } else if (lastX > thisX) {
                direction = 'left';
            } else if (lastY < thisY) {
                direction = 'bottom';
            } else if (lastY > thisY) {
                direction = 'top';
            }

            if (direction === 'left' || direction === 'right') {
                $(controlerElem).stop().scrollLeft(thisX);
                $('.fc-slats-clone, .fc-content-skeleton-clone').css('left', thisX);
                console.log('scrolling');
            }

            lastX = thisX;
            lastY = thisY;

            isScrollingTimeline = false;
        });

        $(controlerElem).niceScroll({
            background: '#d2d2d2',
            railpadding: {
                top: -4
            },
            cursorcolor: '#9da1a5',
            cursorborder: false,
            cursorwidth: '4px',
            autohidemode: false,
            touchbehavior: true,
            cursordragontouch: true,
            enablekeyboard: false
        });
        $('.fc-head-container.fc-widget-header').append($('.nicescroll-rails.nicescroll-rails-hr'));

        // init controler
        $(controlerElem).scroll(function() {
            if (isScrollingTimeline)
                return false;
            isScrollingControler = true;

            var thisLeft = $(this).scrollLeft();

            $(timeline).scrollLeft(thisLeft);
            $('.fc-slats-clone, .fc-content-skeleton-clone').css('left', thisLeft);

            isScrollingControler = false;
        });
    }

    // state 를 체크하여 이벤트를 함수를 실행합니다
    checkBindedStates() {
        let component = this;
        if (this.state.isCreateOfftime) {
            // 시간을 지정하지 않고 예약생성 혹은 offtime생성을 하는 단계에서 도중에 날짜이동을 한 경우 bg highlight 이벤트를 재실행
            this.eventSlotHighlight(true, 'off-time');
        } else if (this.state.isNewOrder) {
            //this.eventSlotHighlight(true, 'event');
            //$('#render-confirm').show();
            if (this.state.newScheduleID) {
                //$(Calendar).fullCalendar('removeEvents', [this.state.newScheduleID]);
            }
            // 임시로 이벤트를 렌더링 한 후 날짜 이동시, 다시 렌더링한다
            if (this.state.isRenderConfirm) {
                this.setState({isRenderConfirm: false}); // event slot highlight button binding
                let getEventObj = this.refs.NewOrder.getScheduleObj();
                let insertSchedule = $.extend(this.props.returnScheduleObj(getEventObj), {id: this.state.newScheduleID});
                $('.create-order-wrap.timeline button.create-event').ready(function() {
                    $('.create-order-wrap.timeline button.create-event').unbind('click'); //렌더링 시 마다 중복 binding 방지
                    $('.create-order-wrap.timeline button.create-event').bind('click', function() {
                        component.fakeRenderNewEvent(insertSchedule, component.state.newScheduleID, 'weekly');
                        component.setState({isRenderConfirm: true});
                        $(this).unbind('click');
                    });
                });
            }
            $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').css('z-index', '4');
        }
    }

    checkRenderedDate(date) {
        let {Calendar} = this.refs;
        var dayDates = $(Calendar).fullCalendar('getView').dayGrid.dayDates;

        var renderedDates = dayDates.map(function(elem, i) {
            return elem.format();
        });

        if (renderedDates.indexOf(date.format('YYYY-MM-DD')) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    // 이벤트 element를 타임라인 바깥영역으로 드래그 시 타임라인 스크롤링 이벤트
    autoFlowTimeline(x, y, jsEvent) {
        var timeline = $('.fc-view-container'),
            offset = timeline.offset();
        var max = {
            left: offset.left,
            right: offset.left + timeline.width()
        };
        var thisLeft = $(timeline).scrollLeft();
        if (x <= max.left + 1) {
            $(timeline).scrollLeft(thisLeft - 5);
            console.log('trigger left');
        } else if (x >= max.right - 1) {
            $(timeline).scrollLeft(thisLeft + 5);
            console.log('trigger right');
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
        console.info(selector); // << not found

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

    // 예약생성모듈 활성화시 Calendar Height 사이즈를 조절합니다
    setCalendarHeight(isDestroy) {
        let {Calendar} = this.refs;
        let staffsUiHeight = 38 - 17; // 17 = window scrollbar height
        let moduleHeight = 590;

        if (isDestroy) {
            $(Calendar).fullCalendar('option', 'height', window.innerHeight - staffsUiHeight);
        } else {
            $(Calendar).fullCalendar('option', 'height', (window.innerHeight - moduleHeight) - staffsUiHeight);
        }
    }

    // 타임라인 내 예약생성 (+) 버튼 클릭시 ui toggling
    toggleCreateOrderUi() {
        // Ui 버튼 toggle
        $('.timeline .create-order-ui-wrap').toggle();
        // 타임라인 내 신규예약생성 버튼 클릭시 z index 스타일 클래스 추가
        $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').addClass('create-order-overlap');
    }

    //예약카드 삭제 1단계
    removeConfirm(schedule) {
        this.props.isModalConfirm('removeEvent');
        this.setState({
          isModalConfirm: true,
          selectedSchedule: schedule
        });
    }
    //예약카드 삭제 2단계 최종삭제

    removeEvent(schedule) {
        let component = this;
        let {Calendar} = this.refs;
        let scheduleID = schedule
            ? schedule.id
            : component.state.selectedSchedule.id;
        $(Calendar).fullCalendar('removeEvents', [scheduleID]);
        this.modalConfirmHide();
        this.setState({
          selectedSchedule: undefined
        });
        if (schedule) {
            this.props.guider(schedule.name + '님의 ' + schedule.service + ' 예약이 삭제되었습니다!');
        } else {
            this.props.guider(this.state.selectedSchedule.guest_name + '님의 ' + this.state.selectedSchedule.service + ' 예약이 삭제되었습니다!');
        }
    }

    // 생성 A___예약시작시간을 미리 '선택하지 않고' 예약생성할 경우__1 : 빈 예약타임의 슬롯을 활성화 시킨다
    renderNewScheduleUnknownStart(bool, newSchedule) {
      console.log(newSchedule)
        let component = this;
        let {Calendar} = this.refs;
        // 취소일경우 초기화
        if (!bool) {
            this.resetOrder();
        } else {
          // 선택한 expert로 view를 rendering합니다
          $('.expert-each input#expert_w_' + newSchedule.resourceId).prop('checked', true);
          this.changeStaff(newSchedule.newOrderStaff, undefined, function() {
              component.staffInputCheck('direct');
              component.eventSlotHighlight(true, 'event', newSchedule.newOrderService);
          });

          let newScheduleID = this.props.returnNewID();
          let insertSchedule = $.extend(this.props.returnScheduleObj(newSchedule), {id: newScheduleID});
          this.setState({
            unknownStart: true,
            newScheduleServiceTime: newSchedule.newOrderService.time
          });
          // button ui hidden
          $('.create-order-wrap.fixed').addClass('hidden');

          // event slot highlight button binding
          $('.create-order-wrap.timeline button.create-event').ready(function() {
              $('.create-order-wrap.timeline button.create-event').unbind('click');
              $('.create-order-wrap.timeline button.create-event').bind('click', function() {
                  insertSchedule = $.extend(insertSchedule, {resourceId: component.state.renderedStaff.id});
                  component.fakeRenderNewEvent(insertSchedule, newScheduleID, 'weekly');
                  $(this).unbind('click');
              });
            });
        }
    }

    // 생성 B___예약시작시간을 미리 선택하여 예약생성할 경우___1 : 이벤트를 임시로 렌더링한다
    beforeInitConfirmRenderNewSchedule(bool, newSchedule) {
        let component = this;
        let {Calendar} = this.refs;
        this.setState({isRenderConfirm: false});

        if (!bool)
            return; //취소하는 경우

        // '이벤트 수정' 중에 이벤트 다시 렌더링한 경우: 배경마스크 및 이벤트 초기화
        if (this.state.isEditEvent) {
            let id = this.state.newScheduleID || this.state.selectedSchedule.id;
            //this.eventSlotHighlight(false, 'edit');
            $('.create-order-wrap.timeline').removeClass('edit');
            $('.create-order-wrap.timeline button.create-event').unbind('click');
            $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
            // 수정전의 이벤트 레이어 시각적 숨김
            $('#render-confirm').hide();
            $('.modal-mask.mask-event').css('top', '376px');
            $('.fc-event#ID_' + this.state.selectedSchedule.id).remove();
            $('.fc-event#ID_' + this.state.selectedSchedule.id + '_FAKE').remove();
            $(Calendar).fullCalendar('removeEvents', [id]);
            $('.render-confirm-inner').find('.cancel').unbind('click');
        }

        let newScheduleID = this.props.returnNewID();
        let insertSchedule = $.extend(this.props.returnScheduleObj(newSchedule), {
          id: newScheduleID
        });

        this.setState({
            newSchedule: insertSchedule,
            newScheduleID: newScheduleID
        }, () => {
            /// ↓↓↓↓↓↓↓↓↓ 예약생성을 할 이벤트의 Staff 타임라인을 렌더링한다  ↓↓↓↓↓↓↓↓///

            console.log(insertSchedule);
            // 현재 렌더링된 staff가 아닌 다른 staff로 생성하는 경우: expert view change
            if ((this.state.lastStaff && this.state.lastStaff.id !== insertSchedule.resourceId) || (this.state.renderedStaff.id !== insertSchedule.resourceId)) {
                // 선택한 Staff로 view를 rendering합니다
                $('.expert-each input#expert_w_' + insertSchedule.resourceId).prop('checked', true);
                this.setState({
                    lastStaff: insertSchedule.resourceId
                }, () => {
                    this.changeStaff(Functions.getStaff(insertSchedule.resourceId, this.props.staffs));
                    setTimeout(function() {
                        component.fakeRenderNewEvent(insertSchedule, newScheduleID, 'selectedStart');
                    }, 0);
                });
            } else {
              this.fakeRenderNewEvent(insertSchedule, newScheduleID, 'selectedStart');
            }
        });
    }
    // 생성 A,B ___ 2 : 임시렌더링된 이벤트 등록을 할것인지 확인한다

    beforeFinalConfirmRenderNewSchedule(bool, id) {
        let {Calendar} = this.refs;
        let type = this.state.isEditEvent
            ? 'editSchedule'
            : 'newSchedule';
        if (bool) {
            this.props.isModalConfirm(type);
            this.setState({isModalConfirm: true});
        } else {
            // 취소 1__ 시작시간을 지정하지 않고 예약하는 중에 취소
            if (this.state.unknownStart) {
                this.backToOrder(id);
                this.refs.NewOrder.backToStep(2);
                $(Calendar).fullCalendar('removeEvents', [id]);
                // 취소 2__ 예약변경 중에 취소
            } else if (this.state.isEditEvent) {
                // 예약 변경중에 취소는 이 함수에서는 실행하지않습니다.  함수 fakeRenderEditEvent() 에서 바인딩으로 실행합니다
            } else {
                this.refs.NewOrder.backToStep(2);
                this.backToOrder(id);
            }
            // 임시로 렌더링한 이벤트를 제거
            $(Calendar).fullCalendar('removeEvents', [id]);
            this.setState({newScheduleID: undefined});
        }
    }

    // 생성 A,B 최종 : 이벤트를 등록을 결정하고 종료한다.
    renderNewSchedule(bool, id, unknownStart) {
        let {Calendar} = this.refs;
        let component = this;
        // 등록
        if (bool) {
            // 생성 B(시작시간 자동선택없이 예약생성)일 경우
            if (unknownStart) {
                if (this.state.viewTypeOrder === 'agendaDay') {
                    // 생성한 이벤트의 날자로 캘린더 타임라인을 변경
                    $(Calendar).fullCalendar('gotoDate', moment(this.props.getSlotTime()).format('YYYY-MM-DD'));
                    this.changeView('agendaDay', function() {
                        // render event
                        this.autoScrollTimeline($('#ID_' + id));
                        //$('.fc-scroller.fc-time-grid-container').animate({scrollTop: $('#ID_'+ id).css('top') }, 300);
                    });
                } else {
                    // 생성된 슬롯에 자동 스크롤
                    this.autoScrollTimeline($('#ID_' + id));
                }
            }
            // 취소
        } else {
            $(Calendar).fullCalendar('removeEvents', [id]);
        }
        // 공통
        this.eventSlotHighlight(false);
        this.resetOrder();
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
        if (this.state.newScheduleID) {
            let evt = $(Calendar).fullCalendar('clientEvents', this.state.newScheduleID)[0];
            evt.editable = true;
            setTimeout(function() {
                $(Calendar).fullCalendar('updateEvent', evt);
            }, 0);
        }

        // reset states
        this.setState({
            viewTypeOrder: undefined,
            newSchedule: undefined,
            selectedDate: undefined,
            selectedSchedule: undefined,
            renderedEvent: undefined,
            newScheduleID: undefined,
            newScheduleServiceTime: undefined,
            unknownStart: false,
            isEditEvent: false,
            isRequestReservation: false,
            isModalConfirm: false,
            isNewOrder: false,
            isRenderConfirm: false
        });
    }

    backToOrder(id) {
        let {Calendar} = this.refs;
        let scheduleID = id || this.state.newScheduleID;

        if (scheduleID) {
            $(Calendar).fullCalendar('removeEvents', [scheduleID]);
        }
        //  reset styles and states
        $('.fc-scroller.fc-time-grid-container').scrollTop(0);
        $('.create-order-wrap.timeline button.create-event').unbind('click');
        $('.fc-fake-event').remove();
        this.eventSlotHighlight(false, 'event');
        this.setState({isRenderConfirm: false, newScheduleServiceTime: undefined});
    }

    // Offtime 스케쥴 생성 1/2 (바인딩단계)
    bindNewOfftime(order, type) {
        let {Calendar} = this.refs;
        let component = this;
        let defaultMinute = 20;
        let endTime = this.props.getSlotTime();
            endTime = moment(endTime).add(defaultMinute, 'minute');
            endTime = endTime.format("YYYY-MM-DDTHH:mm:ss");
        let newScheduleID = this.props.returnNewID();
        // event option
        let insertOfftime = {
            status: actions.ScheduleStatus.OFFTIME,
            id: newScheduleID
        };
        switch (order) {
            // 타임라인 테이블 안에서 시작시간을 지정하여 생성하는 경우
            case 'timeline':
                insertOfftime = $.extend(insertOfftime, {
                    resourceId: this.state.renderedStaff.id,
                    start: this.props.getSlotTime(),
                    end: endTime
                });
                /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
                $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                $('.timeline .create-order-ui-wrap').hide();
                this.renderNewOfftime(insertOfftime);
                break;
            // '주 단위' 에서 시작시간을 지정하지 않고 생성하는 경우
            case 'weekly':
                this.setState({
                    isCreateOfftime: true,
                    newScheduleServiceTime: 20
                }, () => {
                    offTime();
                    this.eventSlotHighlight(true, 'off-time');
                });
                //call back
                function offTime() {
                    // esc 바인딩
                    $(document).bind('keydown', function(e) {
                        if (e.which === 27 && component.state.isCreateOfftime) {
                            component.setState({
                              isCreateOfftime: false,
                              newScheduleServiceTime: undefined,
                              newScheduleID: undefined,
                              isAbleBindRemoveEvent: false
                            });
                            component.eventSlotHighlight(false);
                            $('#render-confirm').hide();
                            // show create order ui
                            $('.create-order-wrap.fixed').removeClass('hidden');
                            $(document).unbind('keydown');
                        }
                    });
                }

                break;
            // '주 단위' 에서 빈 슬롯에 생성할 경우
            case 'render':
                insertOfftime = $.extend(insertOfftime, {
                    resourceId: this.state.renderedStaff.id,
                    start: this.props.getSlotTime(),
                    end: endTime
                });
                this.renderNewOfftime(insertOfftime);
                break;
            default:
                break;
        }
        // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
        if ($('.create-order-overlap').length)
            $('.create-order-overlap').removeClass('create-order-overlap');
        }

    // offtime 생성 2/2
    renderNewOfftime(insertOfftime) {
        let component = this;
        let {Calendar} = this.refs;

        // A _ 상시 예약생성 버튼을 통해 offtime을 생성한 경우
        if (component.state.isCreateOfftime) {
            this.eventSlotHighlight(false);

            $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
            // 타임라인 예약생성 버튼 상위로 노드로 삽입
            $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());

            if (this.state.viewTypeOrder === 'agendaDay') {
                // daily 로 view를 변경한 후 오프타임 렌더링
                $(Calendar).fullCalendar('gotoDate', moment(insertOfftime.start).format('YYYY-MM-DD'));
                this.changeView('agendaDay', function() {
                    // render event
                    $(Calendar).fullCalendar('renderEvent', insertOfftime, true); //stick?  true
                    component.autoScrollTimeline($('#ID_' + insertOfftime.id));
                    //$('.fc-scroller.fc-time-grid-container').animate({scrollTop: $('#ID_'+ insertOfftime.id).css('top') }, 300);
                });
            } else {
                $(Calendar).fullCalendar('renderEvent', insertOfftime, true); //stick?  true
            }
            $('#ID_' + insertOfftime.id).addClass('new-event');
            $('.create-order-wrap.fixed').removeClass('hidden');
            component.props.guider('OFF TIME이 생성되었습니다!');
            // component.state.isAbleBindRemoveEvent 가 true일경우 ESC key등의 이벤트 발생시 삭제가 가능하도록 접근성 바인딩을 합니다
            component.setState({
                viewTypeOrder: undefined,
                isCreateOfftime: false,
                newScheduleServiceTime: undefined,
                newScheduleID: insertOfftime.id,
                isAbleBindRemoveEvent: true
            }, () => {
                // callback
                // ESC key 입력시 신규생성한 event 삭제
                $(document).bind('keydown', function(e) {
                    if (e.which === 27 && !component.state.isModalConfirm) {
                        if (component.state.isAbleBindRemoveEvent) {
                            /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                            $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                            $(Calendar).fullCalendar('removeEvents', [component.state.newScheduleID]);
                            component.setState({isAbleBindRemoveEvent: false, newScheduleID: undefined});
                            component.props.guider('OFF TIME이 삭제되었습니다!');
                        }
                        $(document).unbind('keydown');
                    }
                });
                // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
                $('body').one('click', function(e) {
                    if (insertOfftime.id === component.state.newScheduleID) {
                        $('#ID_' + insertOfftime.id).removeClass('new-event');
                        component.setState({isAbleBindRemoveEvent: false, newScheduleID: undefined});
                    }
                });
            });

            // B _ 타임라인 내에서 오프타임을 생성한 경우
        } else {
            //$(Calendar).fullCalendar('gotoDate', moment(insertOfftime.start).format('YYYY-MM-DD'));
            // render event
            $(Calendar).fullCalendar('renderEvent', insertOfftime, true); //stick?  true
            $('#ID_' + insertOfftime.id).addClass('new-event');
            $('.create-order-wrap.fixed').removeClass('hidden');
            component.props.guider('OFF TIME이 생성되었습니다!');

            // component.state.isAbleBindRemoveEvent 가 true일경우 ESC key등의 이벤트 발생시 삭제가 가능하도록 접근성 바인딩을 합니다
            component.setState({
                newScheduleID: insertOfftime.id,
                isAbleBindRemoveEvent: true
            }, () => {
                // callback
                // ESC key 입력시 신규생성한 event 삭제
                $(document).bind('keydown', function(e) {
                    if (e.which === 27 && !component.state.isModalConfirm) {
                        if (component.state.isAbleBindRemoveEvent) {
                            /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                            $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                            $(Calendar).fullCalendar('removeEvents', [component.state.newScheduleID]);
                            component.setState({isAbleBindRemoveEvent: false, newScheduleID: undefined});
                            component.props.guider('OFF TIME이 삭제되었습니다!');
                        }
                        $(document).unbind('keydown');
                    }
                });
                // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
                $('body').one('click', function(e) {
                    if (insertOfftime.id === component.state.newScheduleID) {
                        $('#ID_' + insertOfftime.id).removeClass('new-event');
                        component.setState({isAbleBindRemoveEvent: false, newScheduleID: undefined});
                    }
                });
            });
        }
    }

    // 신규예약 이벤트를 렌더링합니다 (실제 이벤트를 생성한 후 최종확인 버튼을통해 삭제할지 말지 결정합니다)
    fakeRenderNewEvent(insertSchedule, newScheduleID, type) {
        let {Calendar} = this.refs;
        let component = this;
        if (type === 'selectedStart') {
            insertSchedule.end = moment(insertSchedule.end).format('YYYY-MM-DDTHH:mm:ss');
            console.log('@'+ insertSchedule);
            $(Calendar).fullCalendar('renderEvent', insertSchedule, true); // stick? = true
            // animate scroll after event rendered
            this.autoScrollTimeline($('#ID_' + newScheduleID), 0, function() {
                $('.fc-scroller.fc-time-grid-container').addClass('overflow-hidden');
            });
            $('#ID_' + newScheduleID).addClass('new-event').after($('.mask-event').show());
        } else {
            let startTime = this.props.getSlotTime();
            let endTime = moment(startTime)
                            .add(this.state.newScheduleServiceTime, 'minute')
                            .format("YYYY-MM-DDTHH:mm:ss");
            let newInsertSchedule = $.extend(insertSchedule, {
                start: startTime,
                end: endTime
            });
            $(Calendar).fullCalendar('renderEvent', newInsertSchedule, true); // stick? = true
            let realEventElem = $('#ID_' + newScheduleID);
            let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + newScheduleID + '_FAKE');
            $(fakeEventElem).addClass('new-event').appendTo($('.fc-time-grid-container td[data-date="' + moment(this.props.getSlotTime()).format('YYYY-MM-DD') + '"]'));
            $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
            this.setState({
                newScheduleID: newScheduleID,
                newSchedule: $.extend(newInsertSchedule, {
                    class: Functions.getService(newInsertSchedule.service_id, component.props.services).color
                })
            });
        }
        // button ui hidden
        $('.create-order-wrap.fixed').addClass('hidden');
        this.setState({
            isRenderConfirm: false
        }, () => {
            this.setState({isRenderConfirm: true});
        });
    }

    // 예약 변경시 이벤트를 렌더링합니다 (실제 이벤트를 생성한 후 최종확인 버튼을통해 삭제할지 말지 결정합니다)
    fakeRenderEditEvent(editSchedule, rerender) {
        let component = this;
        let {Calendar} = this.refs;
        // rerendering 일 경우 이벤트를 다시 등록한다
        if (rerender)
            $(Calendar).fullCalendar('renderEvent', editSchedule, true); // stick? = true

        let realEventElem = $('#ID_' + editSchedule.id).hide();
        let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editSchedule.id + '_FAKE').show();
        $(fakeEventElem).addClass('new-event edit').appendTo($('.fc-time-grid-container td[data-date="' + moment(editSchedule.start).format('YYYY-MM-DD') + '"]'));
        $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
        this.setState({
            newScheduleID: editSchedule.id,
            newSchedule: $.extend(editSchedule, {
              class: Functions.getService(editSchedule.service_id, component.props.services).color
            }),
            newScheduleServiceTime: Functions.millisecondsToMinute(moment(editSchedule.end).diff(moment(editSchedule.start)))
        });
        // 이벤트 생성버튼 Click 바인딩
        $('.create-order-wrap.timeline button.create-event').ready(function() {
            $('.create-order-wrap.timeline button.create-event').bind('click', function() {
                // 렌더링 된 이벤트 삭제
                $(fakeEventElem).remove();
                fakeEventElem = null;
                $(Calendar).fullCalendar('removeEvents', [editSchedule.id]);
                // 수정된 이벤트 객체 정보
                let getEventObj = component.refs.NewOrder.getScheduleObj();
                let editEventObj = component.props.returnScheduleObj(getEventObj);
                let editedStart = moment(component.props.getSlotTime());
                let editedEnd = moment(component.props.getSlotTime()).add(component.state.newScheduleServiceTime, 'minutes');
                let insertSchedule = $.extend(editEventObj, {
                    id: editSchedule.id,
                    resourceId: component.state.renderedStaff.id,
                    start: editedStart,
                    end: editedEnd
                });
                // 수정된 이벤트 렌더링
                $(Calendar).fullCalendar('renderEvent', insertSchedule, true); // stick? = true
                realEventElem = $('#ID_' + editSchedule.id);
                fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editSchedule.id + '_FAKE');
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
                            $(Calendar).fullCalendar('removeEvents', [editSchedule.id]);
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

    // 상단 컨트롤러를 통해 일반적으로 타임라인을 변경할때
    changeDateBasic(dir, view) {
        let {Calendar} = this.refs;
        if (dir === 'prev') {
            $(Calendar).fullCalendar('incrementDate', {week: -4});
        } else {
            $(Calendar).fullCalendar('incrementDate', {week: 4});
        }
    }

    isChangeDate(condition) {
        this.setState({isChangeDate: condition});
    }

    // 상단 datepicker 컨트롤러를 통해 타임라인 날짜를 변경할때
    changeDate(date) {
        let {Calendar} = this.refs;

        // 해당 날짜가 이미 타임라인에 렌더링 되어있는 경우
        if (this.checkRenderedDate(date)) {
            var scrollX = $(this.controler).scrollLeft();
            var positionX = $('th.fc-day-header.fc-widget-header[data-date="' + date.format('YYYY-MM-DD') + '"]').position().left;
            $(this.controler).getNiceScroll(0).doScrollLeft(scrollX + positionX, 200);
        } else {
            $(Calendar).fullCalendar('gotoDate', date.format());
        }

        this.setState({isChangeDate: false});
    }

    // 예약정보수정
    editSchedule(schedule) {
        let {Calendar} = this.refs;
        let component = this;
        let type = schedule.status === '05'
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
            viewTypeOrder: 'agendaWeekly'
        }, () => {
            // view change시, 선택된 이벤트의 요일이 처음으로 오도록 설정해준다
            let fcOptions = {
                firstDay: moment(schedule.start).day(),
                gotoDate: moment(schedule.start).format('YYYY-MM-DD'),
                editable: false
            };
            $(Calendar).fullCalendar('option', fcOptions);
            this.changeView('agendaWeekly', function() {
                component.autoScrollTimeline($('#ID_' + schedule.id));
            });
            this.eventSlotHighlight(true, type, schedule.service);
            this.fakeRenderEditEvent(schedule);
        });
        this.setState({isEditEvent: true, isNewOrder: true});
    }

    newOrder(type) {
      let {Calendar} = this.refs;

      $('.create-order-wrap.fixed').addClass('hidden');
      /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
      $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
      $('.timeline .create-order-ui-wrap').hide();
      // $(Calendar).fullCalendar('option', 'editable', false);

      // 우측하단 상시 예약생성 버튼을 통한 생성일 경우
      if (type === 'unknownStart') {
          this.setState({
            unknownStart: true,
            isNewOrder: true
          });
      } else {
          this.setState({
            selectedDate : this.props.getSlotTime(),
            isNewOrder: true
          });
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
          let evt = $(Calendar).fullCalendar('clientEvents', this.state.newScheduleID);
          evt.editable = true;
          $(Calendar).fullCalendar('updateEvent', evt);
          // $(Calendar).fullCalendar('option', 'editable', true);
      }
      $('.create-order-wrap.fixed').removeClass('hidden');
      $('#render-confirm').hide();
      this.setState({isNewOrder: false});
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

    // overview timeline 에서 선택가능한 slot을 활성화 or 활성화 해제 시킨다
    eventSlotHighlight(bool, type, service) {
        //console.log('실행', bool, type);
        let component = this;
        let bgCell = '<span class="bg-cell"></span>';
        let color = '';
        //오늘 날짜(임시)의 .fc-day 레이어를 가져옵니다
        let daySlot = $('.fc-agendaWeekly-view .fc-bg .fc-day[data-date="' + moment(new Date()).format('YYYY-MM-DD') + '"]');
        this.setState({newScheduleService: service});
        // highlighting
        if (bool) {
            if (service) color = service.color;
            // background mask 삽입 및 스타일 지정
            $('.fc-content-skeleton').css('z-index', '2');
            $("#render-confirm").show().css('z-index', '2').addClass('mask-white mask-overview');
            $('.create-order-wrap.fixed').addClass('hidden');
            $('.create-order-wrap.timeline').removeClass('red blue yellow green purple');
            if (color) {
              setTimeout(function() {
                  $('.create-order-wrap.timeline').addClass(color);
              }, 0);
            }

        /*[공통]  활성화 가능한 타임 블록의 tr에 class="slot-highlight"를      적용해주어야 합니다
        [공통]  활성화 가능한 타임 블록의 첫번째 tr에 class="start"를  추가로 적용해주어야 합니다
        [공통]  활성화 가능한 타임 블록의 마지막 tr에 class="end"를    추가로 적용해주어야 합니다
        [예약수정]  활성화 가능한 타임 블록의 tr에 class="edit"을 추가로 적용해주어야 합니다
        [off time]  활성화 가능한 타임 블록의 tr에 class="off-time"을 추가로 적용해주어야 합니다 */
            switch (type) {
                case 'off-time':
                    $(daySlot).find('tr[data-time="15:00:00"]').addClass('slot-highlight off-time start').find('td').append(bgCell);
                    $(daySlot).find('tr[data-time="15:00:00"]').nextUntil('tr[data-time="16:00:00"]').addClass('slot-highlight off-time').find('td').append(bgCell);
                    $(daySlot).find('tr[data-time="16:00:00"]').prev('tr').addClass('slot-highlight off-time end');
                    break;
                case 'edit':
                    $(daySlot).find('tr[data-time="15:00:00"]').addClass(`slot-highlight edit start ${color}`).find('td').append(bgCell);
                    $(daySlot).find('tr[data-time="15:00:00"]').nextUntil('tr[data-time="16:00:00"]').addClass(`slot-highlight edit ${color}`).find('td').append(bgCell);
                    $(daySlot).find('tr[data-time="16:00:00"]').prev('tr').addClass(`slot-highlight edit end ${color}`);
                    break;
                default:
                    $(daySlot).find('tr[data-time="15:00:00"]').addClass(`slot-highlight start ${color}`).find('td').append(bgCell);
                    $(daySlot).find('tr[data-time="15:00:00"]').nextUntil('tr[data-time="16:00:00"]').addClass(`slot-highlight ${color}`).find('td').append(bgCell);
                    $(daySlot).find('tr[data-time="16:00:00"]').prev('tr').addClass(`slot-highlight end ${color}`);
                    break;
            }
            // reset highlighted
        } else {
            setTimeout(function() {
                $('.fc-agendaWeekly-view .fc-bg .fc-day tr').removeClass('slot-highlight off-time start end red blue yellow green purple').find('.bg-cell').remove();
                $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
                $('.fc-agendaWeekly-view .fc-time-grid > .fc-bg').attr('style', '');
                $('#render-confirm').hide();
                $('.create-order-wrap.timeline').removeClass('green red purple blue yellow');
            }, 0);
        }
    }

    // Epxert UserInterfact checking
    staffInputCheck(type) {
        let {Calendar} = this.refs;
        let {
            isCreateOfftime,
            isEditEvent,
            lastStaff,
            defaultStaff,
            renderedStaff,
            priorityStaff
        } = this.state;

        // 기본적인 view rendering and change rendering
        if (type !== 'init') {
            console.log('VIEW 전환');
            // 공통으로 초기 인풋 체크 해제
            $('.expert-each input:checked').prop('checked', false).parent('.expert-each').attr('data-active', false);

            // input checking (Staff별 이벤트 렌더링은 calendar 옵션중 eventRender 에서 필터링 처리함)
            if (priorityStaff) {
                $('.expert-weekly .expert-each input#expert_w_' + priorityStaff.id).prop('checked', true);
                console.log('1-1 priorityStaff');
                // 1-2
            } else if (renderedStaff) {
                $('.expert-weekly .expert-each input#expert_w_' + defaultStaff.id).prop('checked', true);
                console.log('1-2 Default Staff');
                // 1-3 :
            } else if (lastStaff) {
                console.log('1-3 Last Staff');
                $('.expert-weekly .expert-each input#expert_w_' + lastStaff.id).prop('checked', true);
                // 1-4 :
            } else {
                console.log('1-4 Default Staff');
                $('.expert-weekly .expert-each input#expert_w_' + defaultStaff.id).prop('checked', true);
            }
            // **** START// 초기 접근시 실행 ****
        } else if (type === 'init') {
            console.log('VIEW 예약 초기접근 Default Staff');
            $('.expert-each input#expert_w_' + defaultStaff.id).prop('checked', true);
        }
    }

    changeView(type, callback) {
        this.props.changeView(type);
        if (callback)
            setTimeout(callback, 100);
    }

    // change expert: only weekly timeline
    changeStaff(staff, input, callback) {
        // $('.fc-view-container .fc-body').addClass('fade-loading');
        let {Calendar} = this.refs;
        if (this.state.isNewOrder)
            this.refs.NewOrder.setNewOrderStaff(staff);
        this.setState({
            priorityStaff: staff,
            renderedStaff: staff,
            lastStaff: staff
        }, () => {
            $(Calendar).fullCalendar('rerenderEvents');
            if (callback)
                callback();
            }
        );
        console.log('Staff Change');
    }

    componentWillMount() {
        // show Loading bar
        // this.props.loading(true);
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
        var staffsUiHeight = 38 - 17; //17 = window scrollbar height

        this.setState({defaultStaff: Staffs[0]});

        // 스케쥴러 init 실행
        $(Calendar).fullCalendar($.extend(component.props.fcOptions, {
          resources: [Staffs[0]],
          events: component.props.schedules, //스케쥴 이벤트*
          shopServices: component.props.services,
          defaultView: 'agendaWeekly', // init view type set
          header: {
              left: 'todayTimeline agendaDay',
              center: 'prevTimeline title nextTimeline, changeDate',
              right: 'agendaDayCustom agendaWeeklyCustom'
          },
          firstDay: firstDay,
          scrollTime: defaultScrollTime, //초기 렌더링시 스크롤 될 시간을 표시합니다
          navLinks: true, //(캘린더 상단 날자 활성화) can click day/week names to navigate views
          customButtons: {
              changeDate: {
                  text: '날짜선택',
                  click: function(e) {
                      e.stopPropagation();
                      component.isChangeDate(true);
                  }
              },
              agendaDayCustom: {
                  text: 'DAILY',
                  click: function () {
                      component.props.changeView('agendaDay');
                  }
              },
              agendaWeeklyCustom: {
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
              },
              prevTimeline: {
                  text: '이전',
                  click: function() {
                      component.changeDateBasic('prev');
                  }
              },
              nextTimeline: {
                  text: '다음',
                  click: function() {
                      component.changeDateBasic('next');
                  }
              }
          },
          height: window.innerHeight - staffsUiHeight,
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

          eventClick: function(schedule, jsEvent, view) {
          },
          eventDragStart: function(schedule, jsEvent, ui, view) {
              component.setState({isDragging: true});

              // daily 이벤트 드래그관련 타임라인 스크롤
              $(document).bind('mousemove', function(e) {
                  if (component.state.viewType === 'agendaDay') {
                      component.autoFlowTimeline(e.pageX, e.pageY, jsEvent);
                  }
              });
          },
          eventDragStop: function(schedule, jsEvent, ui, view) {
              // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
              component.setState({isDragging: false});
              if (component.state.isAbleBindRemoveEvent) {
                  component.setState({newScheduleID: undefined, isAbleBindRemoveEvent: false});
              }
              $(document).unbind('mousemove');
          },
          eventResize: function(schedule, delta, revertFunc, jsEvent, ui, view) {
              /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
              $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
              // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
              if (component.state.isAbleBindRemoveEvent) {
                  component.setState({newScheduleID: undefined, isAbleBindRemoveEvent: false});
              }
              // 30분 이하의 이벤트의 element에 클래스 추가
              if (Functions.millisecondsToMinute(schedule.end.diff(schedule.start)) <= 30) {
                  setTimeout(function() {
                      // 20분 이하의 이벤트인경우
                      if (Functions.millisecondsToMinute(schedule.end.diff(schedule.start)) <= 20) {
                          $('.fc-event#ID_' + schedule.id).addClass('fc-short');
                      } else {
                          $('.fc-event#ID_' + schedule.id).addClass('fc-short no-expand');
                      }
                  }, 0);
              }
              // 20분 미만으로 이벤트 시간을 수정할 경우 수정을 되돌린다.
              if (Functions.millisecondsToMinute(schedule.end.diff(schedule.start)) < 20) {
                  revertFunc();
                  alert('변경할 수 없습니다');
              }
              if (schedule.id === component.state.newScheduleID) {
                  // off-time slot의 new evnet 클래스 시각적 제거
                  $('#ID_' + schedule.id).removeClass('new-event');
              }
          },
          eventResizeStart: function(schedule, jsEvent, ui, view) {
              component.setState({isDragging: true});
          },
          eventResizeStop: function(schedule, jsEvent, ui, view) {
              component.setState({isDragging: false});
          },
          windowResize: function(view) {
              $(Calendar).fullCalendar('option', 'height', window.innerHeight - staffsUiHeight);
          },
          resourceRender: function(resourceObj, labelTds, bodyTds) {
              // ...
          },
          eventRender: function(schedule, element, view) {
              // 주단위 타임라인 에서 expert 별로 이벤트를 렌더링합니다. (filtering)
              let {
                priorityStaff,
                renderedStaff,
                lastStaff
              } = component.state;

              let currentStaff = priorityStaff || renderedStaff || lastStaff || Staffs[0];

              if (schedule.resourceId !== currentStaff.id) {
                  return false;
              }

              // Event Card 의 상품별로 Class를 삽입합니다
              if (schedule.service_code === '05') {
                  $(element).addClass('off-time');
              } else {
                  for (let i = 0; i < Staffs.length; i++) {
                      if (schedule.service === Staffs[i].service) {
                          $(element).addClass(Staffs[i].itemColor);
                          break;
                      }
                  }
              }

              //시간이 지난 이벤트 건 스타일 클래스 적용 (minute을 기준으로 설정)
              if (moment(schedule.end.format('YYYY-MM-DD HH:mm:ss')).isBefore(date, 'minute')) {
                  // event.editable = false;
                  $(element).addClass('disabled');
              }

              // service time이 20분 이하인 슬롯은 class 추가하여 스타일 추가 적용
              if (Functions.millisecondsToMinute(schedule.end.diff(schedule.start)) <= 20) {
                  $(element).addClass('fc-short');
              } else {
                  $(element).removeClass('fc-short');
              }

          },

          eventAfterAllRender: function(view) {
              // $('.fade-loading').removeClass('fade-loading');
          },

          // 캘린더 이벤트 day 렌더링시
          dayRender: function(d, cell) {
              // 필요없는 node dom 삭제(all day slot 관련한 dom)
              $('.fc-day-grid.fc-unselectable').remove();

              // 오늘 날짜의 타임라인에서 예약마감버튼 바인딩
              if (d.isSame(date, 'day')) {
                  $('.order-deadline-button').unbind('click').bind('click', function() {
                      //....
                  });
              }
          },
          // 캘린더 이벤트 view 렌더링시
          viewRender: function(view, elem) {
              console.info('VIEW Render');
              let { Calendar } = component.refs;
              let staff = component.state.priorityStaff || Staffs[0];

              // state를 업데이트 후에 실행해야 하는 함수
              var runAfterStatesUpdate = function () {
                  // [1] Weekly 타임라인이 다시 렌더링 된 경우
                  if (component.state.alreadyRendered) {
                    component.bindTimelineScroller('again');
                    component.staffInputCheck('again');
                  }
                  // [2] Weekly 타임라인이 처음 렌더링 된 경우
                  else {
                    component.initRender();
                    component.bindTimelineScroller('init');
                    component.staffInputCheck('init');
                    component.setState({
                      alreadyRendered: true
                    });
                  }
                  // [3] Weekly 타임라인이 그려질 때 마다 실행
              };

              component.checkBindedStates();
              component.bindTimelineAccess();

              //** expert ui 의 레이어를 상단으로 이동 **
              $('.expert-weekly').insertAfter($('.fc-toolbar.fc-header-toolbar'));
              // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
              $('.create-order-overlap').removeClass('create-order-overlap');
              // Insert Helper & Buttons
              $('.order-deadline-button').remove();
              // loading bar hide
              // $('.fade-loading').removeClass('fade-loading');
              component.props.loading(false);

              component.setState({
                timelineDate: $(Calendar).fullCalendar('getDate').format(),
                priorityStaff: staff,
                renderedStaff: staff,
                lastStaff: staff
              }, () => runAfterStatesUpdate());


          }, //end viewRender

          viewDestroy: function(view, elem) {
            // destroy scrollbar
            component.bindTimelineScroller('destroy');
          },
          // open customer card
          eventDoubleClick: function(calSchedule, jsEvent, view) {
            console.log(calSchedule)
              // 신규예약 생성중에는 더블클릭 이벤트 실행안함
              if (component.state.isNewOrder)
                  return false;
              // OFF TIME 인경우
              if (calSchedule.status === actions.ScheduleStatus.OFFTIME)
                  return false;

              // *****고객카드 슬라이더를 호출함******
              let selectedDate = moment(calSchedule.start);
              // 더블클릭으로 선택된 이벤트객체를 가져옵니다
              let selectedCard = calSchedule;
              // 선택된 이벤트객체의 리소스ID에 맞는 expert id를 찾아 가져옵니다
              let selectedStaff = $(Calendar).fullCalendar('getResourceById', selectedCard.resourceId);

              // userCard 컴포넌트의 초기값을 전달한다
              component.isUserCard(true, {
                  selectedDate: selectedDate,
                  selectedCard: selectedCard,
                  selectedStaff: selectedStaff
              });
              /*******************************/
          }
      }));

      if (this.props.isBindedNewOrder) {
        var newOrderInfo = this.props.getNewOrderStates();
        this.setState({
          unknownStart: newOrderInfo.type,
          renderedStaff: newOrderInfo.staff,
          selectedDate: newOrderInfo.start,
          isNewOrder: true
        });
        console.info(newOrderInfo.staff);
        console.info(newOrderInfo.staff);
      }
      this.props.wasMount();

    } //////// ComponentDidMount //END

    componentWillUnmount() {
        let {Calendar} = this.refs;

        // 예약생성 단계에서 un mount시 임시로 렌더링한 이벤트를 삭제.
        if (this.state.isRenderConfirm) {
            $(Calendar).fullCalendar('removeEvents', [this.state.newScheduleID]);
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
    }

    //예약요청확인
    goToRequestReservation(options) {
        const component = this;
        const {Calendar} = this.refs;
        const {condition, requestEvent} = options;

        this.setState({
            isEditEvent: true,
            isRequestReservation: true,
            selectedSchedule: requestEvent,
            lastStaff: Functions.getStaff(requestEvent.resourceId, this.props.staffs),
            renderedStaff: Functions.getStaff(requestEvent.resourceId, this.props.staffs)
        }, () => {
            this.setState({isNewOrder: true});
            this.changeDate(moment(requestEvent.start));
            this.autoScrollTimeline($('#ID_' + requestEvent.id));
            this.eventSlotHighlight(true, 'edit', requestEvent.service);
            this.fakeRenderEditEvent(requestEvent);
        });
    }

    render() {
        let Staffs = this.props.staffs;
        let StaffsInterfaceComponent = null;
        let NewOrderComponent = null;

        StaffsInterfaceComponent = (
            <div className="expert-wrap">
                <div className="expert-ui expert-weekly">
                    <div className="expert-inner">
                        {Staffs.map((staff, i) => {
                            return (
                                <div className="expert-each" key={i}>
                                    <input
                                      disabled={this.state.isRenderConfirm}
                                      className="expert-input"
                                      type="radio"
                                      name="expert_w"
                                      id={`expert_w_${staff.id}`}
                                      value={staff.id}
                                      onChange={(input) => this.changeStaff(staff, input)}
                                      />
                                    <label className="expert-label" htmlFor={`expert_w_${staff.id}`}>{staff.nickname || staff.staff_name}
                                        <i className="today-reservation">{9}</i>
                                    </label>
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
                beforeInitConfirmRenderNewSchedule={(bool, newSchedule) => this.beforeInitConfirmRenderNewSchedule(bool, newSchedule)}
                setCalendarHeight={(step) => this.setCalendarHeight(step)}
                newOrderCancel={this.newOrderCancel}
                changeView={(type) => this.changeView(type)}
                backToOrder={this.backToOrder}
                unknownStart={this.state.unknownStart}
                isEditEvent={this.state.isEditEvent}
                isRequestReservation={this.state.isRequestReservation}
                willEditEventObject={this.state.selectedSchedule}
                isModalConfirm={this.state.isModalConfirm}
                isRenderConfirm={this.state.isRenderConfirm}
                renderNewScheduleUnknownStart={this.renderNewScheduleUnknownStart}
                selectedDate={this.state.selectedDate}
                selectedStaff={this.state.renderedStaff}
                />
            )
        }


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
                <dt>isNewOrder :</dt>
                <dd>{this.state.isNewOrder
                        ? 'true'
                        : ""}</dd>
                <dt>isRequestReservation:
                </dt>
                <dd>{this.state.isRequestReservation
                        ? 'true'
                        : ""}</dd>
                <dt>isEditEvent:
                </dt>
                <dd>{this.state.isEditEvent
                        ? 'true'
                        : ""}</dd>
                <dt>isCreateOfftime:
                </dt>
                <dd>{this.state.isCreateOfftime
                        ? 'true'
                        : ""}</dd>
                <dt>unknownStart:
                </dt>
                <dd>{this.state.unknownStart
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
                {/*
                  <dt>prevStaff</dt>
                  <dd>{this.state.prevStaff
                          ? this.state.prevStaff.label
                          : ""}</dd>
                          */}
                {/*<dt>prevStaffAll</dt><dd>{this.state.prevStaffAll ? this.state.prevStaffAll.map((expert,i)=>{return expert.title+","}): ""}</dd>*/}
                <dt>lastStaff</dt>
                <dd>{this.state.lastStaff
                        ? this.state.lastStaff.label
                        : ""}</dd>
                      <dt>renderedStaff:
                </dt>
                <dd>{this.state.renderedStaff
                        ? this.state.renderedStaff.label
                        : ""}</dd>
                <br/>
                <dt>newScheduleID:
                </dt>
                <dd>{this.state.newScheduleID}</dd>
                <dt>newScheduleService:
                </dt>
                <dd>{this.state.newScheduleService}</dd>
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
                CLICK ME
            </button>
        )

        return (
            <div ref="Calendar" id="weekly">
                {NewOrderComponent}
                {StaffsInterfaceComponent}
                {this.props.getCreateOrderButtonFixed(this)}
                {this.props.getCreateOrderButtonTimeline(this)}
                {this.props.getDatePickerComponent(this)}
                {this.props.getUserCardComponent(this)}
                {this.props.getModalConfirmComponent(this)}
                {this.props.getRenderConfirmComponent(this, 'agendaWeekly')}
                {viewview}
                {test}
            </div>
        );
    }
}


WeeklyCalendar.defaultProps = {
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
            dispatch(actions.userCardSchedule(options.selectedCard));
            dispatch(actions.userCardStaff(options.selectedStaff));
            dispatch(actions.userCardDate(options.selectedDate));
        },
        isModalConfirm: (optionComponent) => {
            dispatch(actions.modalConfirm(optionComponent))
        },
        guider: (message) => dispatch(actions.guider({isGuider: true, message: message})),
        loading: (condition) => dispatch(actions.loading(condition)),
        finishRequestReservation: () => dispatch(actions.requestReservation({condition: false, requestEvent: undefined}))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyCalendar);
