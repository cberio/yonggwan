import React, {Component} from 'react';
import $ from 'jquery';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import moment from 'moment';
import update from 'react-addons-update';
import Products from '../../../data/products.json';
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
            isNotAutoSelectTime: false,
            isAbleBindRemoveEvent: false,
            isDragging: false,
            // Expert states
            defaultExpert: undefined, // 관리자가 설정한 1순위 expert
            priorityExpert: undefined, // 타임라인 렌더링시 0순위로 기준이 되는 expert (일부 이벤트 등록시 해당된다)
            // prevExpert: this.props.defaultExpert,  // 이전에 렌더링 된 expert (현재 해당 state 는 사용하지않음)
            // prevExpertAll: undefined,              // 이전에 렌더링 된 experts (현재 해당 state 는 사용하지않음)
            renderedExpert: undefined, // 현재 타임라인에 렌더링 된 expert
            lastExpert: undefined, // 타임라인을 재 렌더링 할때 기준이되는 expert (해당 expert로 렌더링됨)
            // ... etc
            timelineDate: undefined,
            selectedDate: undefined,
            editedDate: undefined,
            selectedEvent: undefined,
            renderedEvent: undefined,
            newEvents: undefined,
            newEventId: undefined,
            newEventProductTime: undefined
        };
        // event binding
        this.newOrder = this.newOrder.bind(this);
        this.newOrderCancel = this.newOrderCancel.bind(this);
        this.step_render = this.step_render.bind(this);
        this.step_modal = this.step_modal.bind(this);
        this.step_confirm = this.step_confirm.bind(this);
        this.backToOrder = this.backToOrder.bind(this);
        this.modalConfirmHide = this.modalConfirmHide.bind(this);
        this.setCalendarHeight = this.setCalendarHeight.bind(this);
        this.changeDateBasic = this.changeDateBasic.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.isChangeDate = this.isChangeDate.bind(this);
        this.isUserCard = this.isUserCard.bind(this);
        this.changeExpert = this.changeExpert.bind(this);
        this.changeView = this.changeView.bind(this);
        this.createOfftime = this.createOfftime.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.removeConfirm = this.removeConfirm.bind(this);
        this.editEvent = this.editEvent.bind(this);
        this.initRender = this.initRender.bind(this);
        this.toggleCreateOrderUi = this.toggleCreateOrderUi.bind(this);
        this.checkRenderedDate = this.checkRenderedDate.bind(this);
        this.checkBindedStates = this.checkBindedStates.bind(this);
        this.goToRequestReservation = this.goToRequestReservation.bind(this);
        this.autoScrollTimeline = this.autoScrollTimeline.bind(this);
        this.autoFlowTimeline = this.autoFlowTimeline.bind(this);
        this.bindTimelineAccess = this.bindTimelineAccess.bind(this);
        this.bindTimelineScroller = this.bindTimelineScroller.bind(this);
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
                          ).add(component.state.newEventProductTime, 'minutes');
                        var color = '';

                        if (component.state.newEventProduct)
                            color = Functions.getProductColor(component.state.newEventProduct, Products);

                        // current slot time display
                        if (component.state.isNotAutoSelectTime) {
                            $(createButtonElem).find('.time').html(mouseenteredTime.format("a hh:mm") + ' - ' + addedProductTime.format("a hh:mm"));
                        } else {
                            $(createButtonElem).find('.time').html(mouseenteredTime.format("A hh:mm"));
                        }
                        // data set selectedDate
                        component.props.getSlotTime(true, selectedTime);

                        // insert create button
                        $(this).append($(createButtonElem).show());
                        if (component.state.newEventProductTime) {
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
            if (this.state.newEventId) {
                //$(Calendar).fullCalendar('removeEvents', [this.state.newEventId]);
            }
            // 임시로 이벤트를 렌더링 한 후 날짜 이동시, 다시 렌더링한다
            if (this.state.isRenderConfirm) {
                this.setState({isRenderConfirm: false}); // event slot highlight button binding
                let getEventObj = this.refs.NewOrder.getEventObj();
                let insertEvent = $.extend(this.props.returnEventObj(getEventObj), {id: this.state.newEventId});
                $('.create-order-wrap.timeline button.create-event').ready(function() {
                    $('.create-order-wrap.timeline button.create-event').unbind('click'); //렌더링 시 마다 중복 binding 방지
                    $('.create-order-wrap.timeline button.create-event').bind('click', function() {
                        component.fakeRenderNewEvent(insertEvent, component.state.newEventId, 'weekly');
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
        console.info(date, dayDates);
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
        let expertUiHeight = 38 - 17; // 17 = window scrollbar height
        let moduleHeight = 590;

        if (isDestroy) {
            $(Calendar).fullCalendar('option', 'height', window.innerHeight - expertUiHeight);
        } else {
            $(Calendar).fullCalendar('option', 'height', (window.innerHeight - moduleHeight) - expertUiHeight);
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
    removeConfirm(event) {
        this.props.isModalConfirm('removeEvent');
        this.setState({isModalConfirm: true, selectedEvent: event});
    }
    //예약카드 삭제 2단계 최종삭제

    removeEvent(event) {
        let component = this;
        let {Calendar} = this.refs;
        let eventId = event
            ? event.id
            : component.state.selectedEvent.id;
        $(Calendar).fullCalendar('removeEvents', [eventId]);
        this.modalConfirmHide();
        this.setState({selectedEvent: undefined});
        if (event) {
            this.props.guider(event.name + '님의 ' + event.product + ' 예약이 삭제되었습니다!');
        } else {
            this.props.guider(this.state.selectedEvent.name + '님의 ' + this.state.selectedEvent.product + ' 예약이 삭제되었습니다!');
        }
    }

    // 생성 A___예약시작시간을 미리 '선택하하지 않고' 예약생성할 경우__1 : 빈 예약타임의 슬롯을 활성화 시킨다
    createEvent(bool, newEvent) {
        let component = this;
        let {Calendar} = this.refs;
        // 취소일경우 초기화
        if (!bool) {
            this.resetOrder();
        } else {
          // 선택한 expert로 view를 rendering합니다
          $('.expert-each input#expert_w_' + newEvent.resourceId).prop('checked', true);
          this.changeExpert(newEvent.newOrderExpert, undefined, function() {
              component.expertInputCheck('direct');
              component.eventSlotHighlight(true, 'event', newEvent.newOrderProduct);
          });

          let newEventId = this.props.returnNewID();
          let insertEvent = $.extend(this.props.returnEventObj(newEvent), {id: newEventId});
          this.setState({isNotAutoSelectTime: true, newEventProductTime: newEvent.newOrderTime});
          // button ui hidden
          $('.create-order-wrap.fixed').addClass('hidden');

          // event slot highlight button binding
          $('.create-order-wrap.timeline button.create-event').ready(function() {
              $('.create-order-wrap.timeline button.create-event').unbind('click');
              $('.create-order-wrap.timeline button.create-event').bind('click', function() {
                  insertEvent = $.extend(insertEvent, {resourceId: component.state.renderedExpert.id});
                  component.fakeRenderNewEvent(insertEvent, newEventId, 'weekly');
                  $(this).unbind('click');
              });
            });
        }
    }

    // 생성 B___예약시작시간을 미리 선택하여 예약생성할 경우___1 : 이벤트를 임시로 렌더링한다
    step_confirm(bool, newEvent) {
        let component = this;
        let {Calendar} = this.refs;
        this.setState({isRenderConfirm: false});

        if (!bool)
            return; //취소하는 경우

        // '이벤트 수정' 중에 이벤트 다시 렌더링한 경우: 배경마스크 및 이벤트 초기화
        if (this.state.isEditEvent) {
            let id = this.state.newEventId || this.state.selectedEvent.id;
            //this.eventSlotHighlight(false, 'edit');
            $('.create-order-wrap.timeline').removeClass('edit');
            $('.create-order-wrap.timeline button.create-event').unbind('click');
            $('.fc-agendaWeekly-view .fc-content-skeleton').attr('style', '');
            // 수정전의 이벤트 레이어 시각적 숨김
            $('#render-confirm').hide();
            $('.modal-mask.mask-event').css('top', '376px');
            $('.fc-event#ID_' + this.state.selectedEvent.id).remove();
            $('.fc-event#ID_' + this.state.selectedEvent.id + '_FAKE').remove();
            $(Calendar).fullCalendar('removeEvents', [id]);
            $('.render-confirm-inner').find('.cancel').unbind('click');
        }

        let newEventId = this.props.returnNewID();
        let insertEvent = $.extend(this.props.returnEventObj(newEvent), {id: newEventId});

        this.setState({
            newEvents: $.extend(insertEvent, {
                class: Functions.getProductColor(insertEvent.product, Products)
            }),
            newEventId: newEventId
        }, () => {
            /// ↓↓↓↓↓↓↓↓↓ 예약생성을 할 이벤트의 Expert 타임라인을 렌더링한다  ↓↓↓↓↓↓↓↓///

            // 현재 렌더링된 expert가 아닌 다른 expert로 생성하는 경우: expert view change
            if ((this.state.lastExpert && this.state.lastExpert.id !== insertEvent.resourceId) || (this.state.renderedExpert.id !== insertEvent.resourceId)) {
                // 선택한 expert로 view를 rendering합니다
                $('.expert-each input#expert_w_' + insertEvent.resourceId).prop('checked', true);
                this.setState({
                    lastExpert: this.props.getExpert(insertEvent.resourceId)
                }, () => {
                    this.changeExpert(this.props.getExpert(insertEvent.resourceId));
                    setTimeout(function() {
                        component.fakeRenderNewEvent(insertEvent, newEventId, 'selectedStart');
                    }, 0);
                });
            } else {
              this.fakeRenderNewEvent(insertEvent, newEventId, 'selectedStart');
            }
        });
    }
    // 생성 A,B ___ 2 : 임시렌더링된 이벤트 등록을 할것인지 확인한다

    step_modal(bool, id) {
        let {Calendar} = this.refs;
        let type = this.state.isEditEvent
            ? 'editEvent'
            : 'newEvent';
        if (bool) {
            this.props.isModalConfirm(type);
            this.setState({isModalConfirm: true});
        } else {
            // 취소 1__ 시작시간을 지정하지 않고 예약하는 중에 취소
            if (this.state.isNotAutoSelectTime) {
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
            this.setState({newEventId: undefined});
        }
    }

    // 생성 A,B 최종 : 이벤트를 등록을 결정하고 종료한다.
    step_render(bool, id, isNotAutoSelectTime) {
        let {Calendar} = this.refs;
        let component = this;
        // 등록
        if (bool) {
            // 생성 B(시작시간 자동선택없이 예약생성)일 경우
            if (isNotAutoSelectTime) {
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
        if (this.state.newEventId) {
            let evt = $(Calendar).fullCalendar('clientEvents', this.state.newEventId)[0];
            evt.editable = true;
            setTimeout(function() {
                $(Calendar).fullCalendar('updateEvent', evt);
            }, 0);
        }

        // reset states
        this.setState({
            viewTypeOrder: undefined,
            newEvents: undefined,
            selectedDate: undefined,
            selectedEvent: undefined,
            renderedEvent: undefined,
            newEventId: undefined,
            newEventProductTime: undefined,
            isNotAutoSelectTime: false,
            isEditEvent: false,
            isRequestReservation: false,
            isModalConfirm: false,
            isNewOrder: false,
            isRenderConfirm: false
        });
    }

    backToOrder(id) {
        let {Calendar} = this.refs;
        let eventId = id || this.state.newEventId;

        if (eventId) {
            $(Calendar).fullCalendar('removeEvents', [eventId]);
        }
        //  reset styles and states
        $('.fc-scroller.fc-time-grid-container').scrollTop(0);
        $('.create-order-wrap.timeline button.create-event').unbind('click');
        $('.fc-fake-event').remove();
        this.eventSlotHighlight(false, 'event');
        this.setState({isRenderConfirm: false, newEventProductTime: undefined});
    }

    // offtime 생성 1/2
    createOfftime(order, type) {
        let {Calendar} = this.refs;
        let component = this;
        let defaultMinute = 20;
        let endTime = this.props.getSlotTime();
        endTime = moment(endTime).add(defaultMinute, 'minute');
        endTime = endTime.format("YYYY-MM-DDTHH:mm:ss");
        let newEventId = this.props.returnNewID();
        // event option
        let insertOfftime = {
            product: "OFF TIME",
            class: "off-time",
            id: newEventId
        };
        switch (order) {
            // 타임라인 테이블 안에서 시작시간을 지정하여 생성하는 경우
            case 'timeline':
                insertOfftime = $.extend(insertOfftime, {
                    resourceId: this.state.renderedExpert.id,
                    start: this.props.getSlotTime(),
                    end: endTime
                });
                /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
                $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                $('.timeline .create-order-ui-wrap').hide();
                this.renderEvent(insertOfftime);
                break;
            // '주 단위' 에서 시작시간을 지정하지 않고 생성하는 경우
            case 'weekly':
                this.setState({
                    isCreateOfftime: true,
                    newEventProductTime: 20
                }, () => {
                    offTime();
                    this.eventSlotHighlight(true, 'off-time');
                });
                //call back
                function offTime() {
                    // esc 바인딩
                    $(document).bind('keydown', function(e) {
                        if (e.which === 27 && component.state.isCreateOfftime) {
                            component.setState({isCreateOfftime: false, newEventProductTime: undefined, newEventId: undefined, isAbleBindRemoveEvent: false});
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
                    resourceId: this.state.renderedExpert.id,
                    start: this.props.getSlotTime(),
                    end: endTime
                });
                this.renderEvent(insertOfftime);
                break;
            default:
                break;
        }
        // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
        if ($('.create-order-overlap').length)
            $('.create-order-overlap').removeClass('create-order-overlap');
        }

    // offtime 생성 2/2
    renderEvent(insertOfftime) {
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
                newEventProductTime: undefined,
                newEventId: insertOfftime.id,
                isAbleBindRemoveEvent: true
            }, () => {
                // callback
                // ESC key 입력시 신규생성한 event 삭제
                $(document).bind('keydown', function(e) {
                    if (e.which === 27 && !component.state.isModalConfirm) {
                        if (component.state.isAbleBindRemoveEvent) {
                            /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                            $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                            $(Calendar).fullCalendar('removeEvents', [component.state.newEventId]);
                            component.setState({isAbleBindRemoveEvent: false, newEventId: undefined});
                            component.props.guider('OFF TIME이 삭제되었습니다!');
                        }
                        $(document).unbind('keydown');
                    }
                });
                // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
                $('body').one('click', function(e) {
                    if (insertOfftime.id === component.state.newEventId) {
                        $('#ID_' + insertOfftime.id).removeClass('new-event');
                        component.setState({isAbleBindRemoveEvent: false, newEventId: undefined});
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
                newEventId: insertOfftime.id,
                isAbleBindRemoveEvent: true
            }, () => {
                // callback
                // ESC key 입력시 신규생성한 event 삭제
                $(document).bind('keydown', function(e) {
                    if (e.which === 27 && !component.state.isModalConfirm) {
                        if (component.state.isAbleBindRemoveEvent) {
                            /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입 (event remove 시 버튼의 부모 dom이 다시 그려지면서 버튼 dom도 사라지기떄문)
                            $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
                            $(Calendar).fullCalendar('removeEvents', [component.state.newEventId]);
                            component.setState({isAbleBindRemoveEvent: false, newEventId: undefined});
                            component.props.guider('OFF TIME이 삭제되었습니다!');
                        }
                        $(document).unbind('keydown');
                    }
                });
                // 타 영역 클릭시, 신규생성한 off-time slot의 new evnet 클래스 시각적 제거 (접근성 바인딩)
                $('body').one('click', function(e) {
                    if (insertOfftime.id === component.state.newEventId) {
                        $('#ID_' + insertOfftime.id).removeClass('new-event');
                        component.setState({isAbleBindRemoveEvent: false, newEventId: undefined});
                    }
                });
            });
        }
    }

    // 신규예약 이벤트를 렌더링합니다 (실제 이벤트를 생성한 후 최종확인 버튼을통해 삭제할지 말지 결정합니다)
    fakeRenderNewEvent(insertEvent, newEventId, type) {
        let {Calendar} = this.refs;
        if (type === 'selectedStart') {
            $(Calendar).fullCalendar('renderEvent', insertEvent, true); // stick? = true
            // animate scroll after event rendered
            this.autoScrollTimeline($('#ID_' + newEventId), 0, function() {
                $('.fc-scroller.fc-time-grid-container').addClass('overflow-hidden');
            });
            $('#ID_' + newEventId).addClass('new-event').after($('.mask-event').show());
            // weekly
        } else {
            let startTime = this.props.getSlotTime();
            let endTime = moment(startTime).add(this.state.newEventProductTime, 'minute').format("YYYY-MM-DDTHH:mm:ss");
            let newInsertEvent = $.extend(insertEvent, {
                start: startTime,
                end: endTime
            });
            $(Calendar).fullCalendar('renderEvent', newInsertEvent, true); // stick? = true
            let realEventElem = $('#ID_' + newEventId);
            let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + newEventId + '_FAKE');
            $(fakeEventElem).addClass('new-event').appendTo($('.fc-time-grid-container td[data-date="' + moment(this.props.getSlotTime()).format('YYYY-MM-DD') + '"]'));
            $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
            this.setState({
                newEventId: newEventId,
                newEvents: $.extend(newInsertEvent, {
                    class: Functions.getProductColor(newInsertEvent.product, Products)
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
    fakeRenderEditEvent(editEvent, rerender) {
        let component = this;
        let {Calendar} = this.refs;
        console.log(editEvent);
        // rerendering 일 경우 이벤트를 다시 등록한다
        if (rerender)
            $(Calendar).fullCalendar('renderEvent', editEvent, true); // stick? = true

        let realEventElem = $('#ID_' + editEvent.id).hide();
        let fakeEventElem = $(realEventElem).clone().attr('id', 'ID_' + editEvent.id + '_FAKE').show();
        $(fakeEventElem).addClass('new-event edit').appendTo($('.fc-time-grid-container td[data-date="' + moment(editEvent.start).format('YYYY-MM-DD') + '"]'));
        $(fakeEventElem).wrap('<div class="fc-fake-event"></div>');
        this.setState({
            newEventId: editEvent.id,
            newEvents: $.extend(editEvent, {
                class: Functions.getProductColor(editEvent.product, Products)
            }),
            newEventProductTime: Functions.millisecondsToMinute(moment(editEvent.end).diff(moment(editEvent.start)))
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
                let editedStart = moment(component.props.getSlotTime());
                let editedEnd = moment(component.props.getSlotTime()).add(component.state.newEventProductTime, 'minutes');
                let insertEvent = $.extend(editEventObj, {
                    id: editEvent.id,
                    resourceId: component.state.renderedExpert.id,
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
    editEvent(event) {
        let {Calendar} = this.refs;
        let component = this;
        let type = event.product === 'OFF TIME'
            ? 'off-time'
            : 'edit';
        // 예약카드 상세보기에서 예약수정을 클릭한경우
        if (this.state.isUserCard) {
            this.isUserCard(false);
        }
        // view change시, 선택된 이벤트의 expert를 기본 expert로 렌더링하도록 설정해준다
        this.setState({
            priorityExpert: this.props.getExpert(event.resourceId),
            lastExpert: this.props.getExpert(event.resourceId),
            viewTypeOrder: 'agendaWeekly'
        }, () => {
            // view change시, 선택된 이벤트의 요일이 처음으로 오도록 설정해준다
            let fcOptions = {
                firstDay: moment(event.start).day(),
                gotoDate: moment(event.start).format('YYYY-MM-DD'),
                editable: false
            };
            $(Calendar).fullCalendar('option', fcOptions);
            this.changeView('agendaWeekly', function() {
                component.autoScrollTimeline($('#ID_' + event.id));
            });
            this.eventSlotHighlight(true, type, event.product);
            this.fakeRenderEditEvent(event);
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
      if (type === 'notAutoSelectTime') {
          this.setState({
            isNotAutoSelectTime: true,
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
    eventSlotHighlight(bool, type, product) {
        //console.log('실행', bool, type);
        let component = this;
        let bgCell = '<span class="bg-cell"></span>';
        //오늘 날짜(임시)의 .fc-day 레이어를 가져옵니다
        let daySlot = $('.fc-agendaWeekly-view .fc-bg .fc-day[data-date="' + moment(new Date()).format('YYYY-MM-DD') + '"]');
        let color = Functions.getProductColor(product, Products);
        this.setState({newEventProduct: product});
        // highlighting
        if (bool) {
            // background mask 삽입 및 스타일 지정
            $('.fc-content-skeleton').css('z-index', '2');
            $("#render-confirm").show().css('z-index', '2').addClass('mask-white mask-overview');
            $('.create-order-wrap.fixed').addClass('hidden');
            $('.create-order-wrap.timeline').removeClass('red blue yellow green purple');
            if (color)
                setTimeout(function() {
                    $('.create-order-wrap.timeline').addClass(color);
                }, 0);

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
    expertInputCheck(type) {
        let {Calendar} = this.refs;
        let {
            isCreateOfftime,
            isEditEvent,
            lastExpert,
            defaultExpert,
            renderedExpert,
            priorityExpert
        } = this.state;

        // 기본적인 view rendering and change rendering
        if (type !== 'init') {
            console.log('VIEW 전환');
            // 공통으로 초기 인풋 체크 해제
            $('.expert-each input:checked').prop('checked', false).parent('.expert-each').attr('data-active', false);

            // input checking (Expert별 이벤트 렌더링은 calendar 옵션중 eventRender 에서 필터링 처리함)
            if (priorityExpert) {
                $('.expert-weekly .expert-each input#expert_w_' + priorityExpert.id).prop('checked', true);
                console.log('1-1 priorityExpert');
                // 1-2
            } else if (renderedExpert) {
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
            // **** START// 초기 접근시 실행 ****
        } else if (type === 'init') {
            console.log('VIEW 예약 초기접근 Default Expert');
            $('.expert-each input#expert_w_' + defaultExpert.id).prop('checked', true);
        }
    }

    changeView(type, callback) {
        this.props.changeView(type);
        if (callback)
            setTimeout(callback, 100);
    }

    // change expert: only weekly timeline
    changeExpert(expert, input, callback) {
        // $('.fc-view-container .fc-body').addClass('fade-loading');
        let {Calendar} = this.refs;
        if (this.state.isNewOrder)
            this.refs.NewOrder.setNewOrderExpert(expert);
        this.setState({
            priorityExpert: expert,
            renderedExpert: expert,
            lastExpert: expert
        }, () => {
            $(Calendar).fullCalendar('rerenderEvents');
            if (callback)
                callback();
            }
        );
        console.log('Expert Change');
    }

    componentWillMount() {
        // show Loading bar
        // this.props.loading(true);
    }

    componentDidMount() {
        const component = this;
        let {Calendar} = this.refs;
        let Experts = this.props.experts;
        var date = this.props.fcOptions.defaultDate;
        var time = date.get('hour');
        var day = date.get('date');
        var month = date.get('month');
        var firstDay = date.format('d');
        var defaultScrollTime = date.subtract(1, 'hour').format('HH:mm'); //현재시간으로부터 1시간 이전의 시간
        var expertUiHeight = 38 - 17; //17 = window scrollbar height

        this.setState({defaultExpert: Experts[0]});

        // 스케쥴러 init 실행
        $(Calendar).fullCalendar($.extend(component.props.fcOptions, {
          resources: [Experts[0]],
          events: component.props.events, //스케쥴 이벤트*
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
          height: window.innerHeight - expertUiHeight,
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

          eventClick: function(event, jsEvent, view) {
          },
          eventDragStart: function(event, jsEvent, ui, view) {
              component.setState({isDragging: true});

              // daily 이벤트 드래그관련 타임라인 스크롤
              $(document).bind('mousemove', function(e) {
                  if (component.state.viewType === 'agendaDay') {
                      component.autoFlowTimeline(e.pageX, e.pageY, jsEvent);
                  }
              });
          },
          eventDragStop: function(event, jsEvent, ui, view) {
              // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
              component.setState({isDragging: false});
              if (component.state.isAbleBindRemoveEvent) {
                  component.setState({newEventId: undefined, isAbleBindRemoveEvent: false});
              }
              $(document).unbind('mousemove');
          },
          eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
              /// 생성버튼 캘린더 타임라인 노드에서 상위 노드로 삽입
              $('.full-calendar > .fc').append($('.create-order-wrap.timeline').hide());
              // 신규 생성한 이벤트가 esc keydown 삭제 바인딩 되있을경우
              if (component.state.isAbleBindRemoveEvent) {
                  component.setState({newEventId: undefined, isAbleBindRemoveEvent: false});
              }
              // 30분 이하의 이벤트의 element에 클래스 추가
              if (Functions.millisecondsToMinute(event.end.diff(event.start)) <= 30) {
                  setTimeout(function() {
                      // 20분 이하의 이벤트인경우
                      if (Functions.millisecondsToMinute(event.end.diff(event.start)) <= 20) {
                          $('.fc-event#ID_' + event.id).addClass('fc-short');
                      } else {
                          $('.fc-event#ID_' + event.id).addClass('fc-short no-expand');
                      }
                  }, 0);
              }
              // 20분 미만으로 이벤트 시간을 수정할 경우 수정을 되돌린다.
              if (Functions.millisecondsToMinute(event.end.diff(event.start)) < 20) {
                  revertFunc();
                  alert('변경할 수 없습니다');
              }
              if (event.id === component.state.newEventId) {
                  // off-time slot의 new evnet 클래스 시각적 제거
                  $('#ID_' + event.id).removeClass('new-event');
              }
          },
          eventResizeStart: function(event, jsEvent, ui, view) {
              component.setState({isDragging: true});
          },
          eventResizeStop: function(event, jsEvent, ui, view) {
              component.setState({isDragging: false});
          },
          windowResize: function(view) {
              $(Calendar).fullCalendar('option', 'height', window.innerHeight - expertUiHeight);
          },
          resourceRender: function(resourceObj, labelTds, bodyTds) {
              // ...
          },
          eventRender: function(event, element, view) {
              // 주단위 타임라인 에서 expert 별로 이벤트를 렌더링합니다. (filtering)
              let {
                priorityExpert,
                renderedExpert,
                lastExpert
              } = component.state;

              let currentExpert = priorityExpert || renderedExpert || lastExpert || Experts[0];

              if (event.resourceId !== currentExpert.id) {
                  return false;
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

              //시간이 지난 이벤트 건 스타일 클래스 적용 (minute을 기준으로 설정)
              if (moment(event.end.format('YYYY-MM-DD HH:mm:ss')).isBefore(date, 'minute')) {
                  // event.editable = false;
                  $(element).addClass('disabled');
              }

              // service time이 20분 이하인 슬롯은 class 추가하여 스타일 추가 적용
              if (Functions.millisecondsToMinute(event.end.diff(event.start)) <= 20) {
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
              let expert = component.state.priorityExpert || Experts[0];

              // state를 업데이트 후에 실행해야 하는 함수
              var runAfterStatesUpdate = function () {
                  // [1] Weekly 타임라인이 다시 렌더링 된 경우
                  if (component.state.alreadyRendered) {
                    component.bindTimelineScroller('again');
                    component.expertInputCheck('again');
                  }
                  // [2] Weekly 타임라인이 처음 렌더링 된 경우
                  else {
                    component.initRender();
                    component.bindTimelineScroller('init');
                    component.expertInputCheck('init');
                    component.setState({
                      alreadyRendered: true
                    });
                  }
                  // [3] Weekly 타임라인이 그려질 때 마다 실행
              };

              component.checkBindedStates();
              component.bindTimelineAccess();

              //** expert ui 의 레이어를 상단으로 이동 **
              $('.expert-weekly').insertBefore($('.fc-header-toolbar'));
              // 타임라인 내 신규예약생성 버튼 클릭시 추가되었던 클래스가 남아있으면 다시 제거
              $('.create-order-overlap').removeClass('create-order-overlap');
              // Insert Helper & Buttons
              $('.order-deadline-button').remove();
              // loading bar hide
              // $('.fade-loading').removeClass('fade-loading');
              component.props.loading(false);

              component.setState({
                timelineDate:   $(Calendar).fullCalendar('getDate').format(),
                priorityExpert: expert,
                renderedExpert: expert,
                lastExpert: expert
              }, () => runAfterStatesUpdate());


          }, //end viewRender

          viewDestroy: function(view, elem) {
            // destroy scrollbar
            component.bindTimelineScroller('destroy');
          },
          // open customer card
          eventDoubleClick: function(calEvent, jsEvent, view) {
              // 신규예약 생성중에는 더블클릭 이벤트 실행않함
              if (component.state.isNewOrder)
                  return false;
              if (calEvent.product === 'OFF TIME')
                  return false;

              let selectedDate = moment(calEvent.start);
              // 더블클릭으로 선택된 이벤트객체를 가져옵니다
              let selectedCard = calEvent;
              // 선택된 이벤트객체의 리소스ID에 맞는 expert id를 찾아 가져옵니다
              let selectedExpert = $(Calendar).fullCalendar('getResourceById', selectedCard.resourceId);

              // userCard 컴포넌트의 초기값을 전달한다
              component.isUserCard(true, {
                  selectedDate: selectedDate,
                  selectedCard: selectedCard,
                  selectedExpert: component.state.renderedExpert
              });
          }
      }));

      if (this.props.isBindedNewOrder) {
        var newOrderInfo = this.props.getNewOrderStates();
        this.setState({
          isNotAutoSelectTime: newOrderInfo.type,
          renderedExpert: newOrderInfo.expert,
          selectedDate: newOrderInfo.start,
          isNewOrder: true
        });
      }
      this.props.wasMount();

    } //////// ComponentDidMount //END

    componentWillUnmount() {
        let {Calendar} = this.refs;

        // 예약생성 단계에서 un mount시 임시로 렌더링한 이벤트를 삭제.
        if (this.state.isRenderConfirm) {
            $(Calendar).fullCalendar('removeEvents', [this.state.newEventId]);
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
            selectedEvent: requestEvent,
            lastExpert: this.props.getExpert(requestEvent.resourceId),
            renderedExpert: this.props.getExpert(requestEvent.resourceId)
        }, () => {
            this.setState({isNewOrder: true});
            this.changeDate(moment(requestEvent.start));
            this.autoScrollTimeline($('#ID_' + requestEvent.id));
            this.eventSlotHighlight(true, 'edit', requestEvent.product);
            this.fakeRenderEditEvent(requestEvent);
        });
    }

    render() {
        let Experts = this.props.experts;
        let ExpertsInterfaceComponent = null;
        let NewOrderComponent = null;

        ExpertsInterfaceComponent = (
            <div className="expert-wrap">
                <div className="expert-ui expert-weekly">
                    <div className="expert-inner">
                        {Experts.map((expert, i) => {
                            return (
                                <div className="expert-each" key={i}>
                                    <input disabled={this.state.isRenderConfirm} className="expert-input" type="radio" name="expert_w" id={`expert_w_${expert.id}`} value={expert.id} onChange={(input) => this.changeExpert(expert, input)}/>
                                    <label className="expert-label" htmlFor={`expert_w_${expert.id}`}>{expert.title}
                                        <i className="today-reservation">{expert.todayReservation}</i>
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
                step_confirm={(bool, newEvent) => this.step_confirm(bool, newEvent)}
                setCalendarHeight={(step) => this.setCalendarHeight(step)}
                newOrderCancel={this.newOrderCancel}
                changeView={(type) => this.changeView(type)}
                backToOrder={this.backToOrder}
                isNotAutoSelectTime={this.state.isNotAutoSelectTime}
                isEditEvent={this.state.isEditEvent}
                isRequestReservation={this.state.isRequestReservation}
                willEditEventObject={this.state.selectedEvent}
                isModalConfirm={this.state.isModalConfirm}
                isRenderConfirm={this.state.isRenderConfirm}
                createEvent={this.createEvent}
                selectedDate={this.state.selectedDate}
                selectedExpert={this.state.renderedExpert}
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
                <dt>isNotAutoSelectTime:
                </dt>
                <dd>{this.state.isNotAutoSelectTime
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
                <dt>selectedEvent:
                </dt>
                <dd>{this.state.selectedEvent
                        ? this.state.selectedEvent.name + ' ID:' + this.state.selectedEvent.id
                        : ""}</dd>
                <br/>
                <dt>defaultExpert:
                </dt>
                <dd>{this.state.defaultExpert
                        ? this.state.defaultExpert.title
                        : ""}</dd>
                <dt>priorityExpert:
                </dt>
                <dd>{this.state.priorityExpert
                        ? this.state.priorityExpert.title
                        : ""}</dd>
                {/*
                  <dt>prevExpert</dt>
                  <dd>{this.state.prevExpert
                          ? this.state.prevExpert.title
                          : ""}</dd>
                          */}
                {/*<dt>prevExpertAll</dt><dd>{this.state.prevExpertAll ? this.state.prevExpertAll.map((expert,i)=>{return expert.title+","}): ""}</dd>*/}
                <dt>lastExpert</dt>
                <dd>{this.state.lastExpert
                        ? this.state.lastExpert.title
                        : ""}</dd>
                <dt>renderedExpert:
                </dt>
                <dd>{this.state.renderedExpert
                        ? this.state.renderedExpert.title
                        : ""}</dd>
                <br/>
                <dt>newEventId:
                </dt>
                <dd>{this.state.newEventId}</dd>
                <dt>newEventProduct:
                </dt>
                <dd>{this.state.newEventProduct}</dd>
                <dt>newEventProductTime:
                </dt>
                <dd>{this.state.newEventProductTime}</dd>
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
                {ExpertsInterfaceComponent}
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
            dispatch(actions.userCardEvent(options.selectedCard));
            dispatch(actions.userCardExpert(options.selectedExpert));
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
