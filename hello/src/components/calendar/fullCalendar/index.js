import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import update from 'react-addons-update';
import Controler from '../controler';
import DatePicker from '../datePicker';
import NewOrder from '../newOrder';
import ReservationCard from '../../reservationCard';
import 'fullcalendar-scheduler';
import 'fullcalendar-scheduler/node_modules/fullcalendar/dist/fullcalendar.min.css';
import '../../../css/fullcalendar-scheduler-customizing.css';

export default class FullCalendar extends Component {
  constructor (props) {
    super (props);
    this.state = {
      events: this.props.events,
      viewType : undefined,
      selectedDate: undefined,
      isConfirm : false,
      isReservationCard : false,
      isSelectDate : false,
      isNewOrder : false,
    };
    // event binding
    this.scroll = this.scroll.bind(this);
    this.renderOrder = this.renderOrder.bind(this);
    this.isNewOrder = this.isNewOrder.bind(this);
    this.isConfirmSet = this.isConfirmSet.bind(this);
    this.isReservationCard = this.isReservationCard.bind(this);
    this.selectDate = this.selectDate.bind(this);
  }

  isNewOrderWeekly () {
    let { Calendar } = this.refs;
    $(Calendar).fullCalendar('changeView','agendaWeekly');
    /* 네비버튼 시각적 활성화 */
    $('.nav-overview a').addClass('active');
    $('.nav-daily a').removeClass('active');
  }

  init () {
    if (this.state.viewType === 'agendaDay') {

      // 일단위 타임라인 빈 슬롯에 마우스오버시 신규생성 버튼 활성화
      var createSlot = "<a href='javascript:void(0)' class='create-order-button-current'><span>+</span></button>";
      var createSlotDetach = $(createSlot).detach();
      $(createSlotDetach).attr('onMouseover', 'console.log(this.getAttribute("data-time"))');

      let { Calendar } = this.refs;

      $(Calendar).find('.fc-agendaDay-view .fc-slats tr').each(function (parentIndex, parentElem) {
        $(parentElem).find('td').not('.fc-time').mouseenter(function (e) {
          var slotTime = $(parentElem).data('time');
          $(createSlotDetach).attr('data-time', slotTime);
          $(this).append(createSlotDetach);
        });
      });
    }
  }

  // 예약 생성
  renderOrder(bool, newEvent) {
    if (!bool) {
      // 취소시
      this.setState({ isConfirm : false });
    } else {
      // 확인시
      let { Calendar } = this.refs;
      let insertEvent = {
        product: newEvent.newOrderProduct,
        name: newEvent.newOrderName,
        start: newEvent.newOrderStart,
        end: newEvent.newOrderEnd,
        comment: newEvent.newOrderComment
      };
      this.setState({
        events : update(this.state.events, {
          $push: [insertEvent]
        }),
        newOrder : false
      });
      console.log(this.state.events);
      $(Calendar).fullCalendar('unselect');
      $(Calendar).fullCalendar('renderEvent', insertEvent, true); // stick? = true
      this.setState({
        isNewOrder : false,
        isConfirm : false
      });
    }
  }
  isConfirmSet (bool) {
    this.setState({
      isConfirm : bool
    });
  }
  // 주단위 훑어보기 스크롤/스와이프 시 애니메이션 및 리 로드
  scroll () {
      if (this.state.viewType !== 'agendaWeekly') return false;
      let { Calendar } = this.refs;
      let duration = '0.2s';
      // animation start
      $('.fc-agendaWeekly-view').css({
        'transition': `${duration} all cubic-bezier(0.42, 0.9, 0.76, 1)`,
      	'transform': 'translateX(-90%)',
        'opacity': '0'
      });
      $('.fc-scroller.fc-time-grid-container').css({
        'overflow': 'hidden'
      });

      // animated callback
      $('.fc-agendaWeekly-view').bind('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
        $('.fc-agendaWeekly-view')
          .unbind()
          .css({
            'transition': 'none',
            'transform': 'translateX(0)',
            'opacity': '1'
          });
          //$(Calendar).fullCalendar('option', 'firstDay', 0);
          $(Calendar).fullCalendar('gotoDate', '3010-01-01');
          $('.fc-scroller.fc-time-grid-container').css({
            'overflow-x': 'hidden',
            'overflow-y': 'scroll'
          });
      });
  }

  selectDate (date) {
    let day = date.format();
    let { Calendar } = this.refs;
    $(Calendar).fullCalendar('gotoDate', day);
    this.setState({
      isSelectDate: false
    });
  }
  isNewOrder(bool) {
    this.setState({
      isNewOrder : bool
    });
  }
  isConfirm (bool) {
    this.setState({
      isConfirm : bool
    });
   }
  isReservationCard () {
    this.setState({
      isReservationCard : false
    });
  }

  // 현재시간을 분단위로 계산하여 타임라인 표시선의 position top 값을 리턴하는 함수
  getCurrentTime () {
    return 1500; // 여러 조건하에 px로 입력될 값을 리턴해야함
  }
  componentDidMount() {
    let { Calendar } = this.refs;
    const _this = this;
    var date  = new Date();
    var time  = date.getTime();
    var day   = date.getDate();
    var month = date.getMonth();
    var year  = date.getFullYear();
    var defaultScrollTime = (moment(time).hour() -1 ) + ':' + (moment(time).minute()); //현재시간으로부터 1시간 이전의 시간

    // 스케쥴러 init 실행
    $(Calendar).fullCalendar({
        //schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source', // 라이센스 코드 경고문구 임시로 hidden
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives', //시험판 라이센스 코드
        events: this.state.events,  //스케쥴 이벤트*
        locale : 'ko',              //언어선택
        defaultView : this.props.defaultView,  // init view type set
        firstDay: 1,
        header: {
          left: 'agendaDay agendaWeekly',
  				center: 'prev title next, selectDate',
  				right: ''
  			},
        eventOverlap : false, //중복되는 시간의 이벤트 수정불가능
        selectOverlap : false,//중복되는 시간의 이벤트 생성불가능
        //lazyFetching: true, //event 데이터들을 가져올 순간을 선언합니다
  			defaultDate: new Date(year, month, day),   //기본 날짜
        scrollTime: defaultScrollTime , //초기 렌더링시 스크롤 될 시간을 표시합니다
        snapDuration: '00:10:00',
        navLinks: false,            //can click day/week names to navigate views
        customButtons: {
          selectDate: {
            text: '날짜선택',
            click: function() {
              _this.setState({
                isSelectDate: true
              });
            }
          }
        },
        //firstHour : 23,
        //slotMinutes : 30,        //슬롯 생성 분단위 범위 설정 default :30
        //minTime: '09:00',        //예약가능한 최소 시작시간 지정 (출근시간)
        //maxTime: '18:00',        //예약마감시간 지정
        height: window.innerHeight,
        nowIndicator: true,
        dragOpacity: 1,
        allDaySlot: false,         //풀타임 슬롯 사용여부
        editable: true,            //수정가능한지 여부
  			selectable: false,         //드래그로 날짜를 선택하여 추가기능 활성화
  			selectHelper: true,        //드래그시 배경색상 효과
        windowResizeDelay : 0,     //윈도우 리사이즈시 캘린더 리사이징 딜레이
        handleWindowResize: true,  //캘린더 resizable 여부
        slotEventOverlap: false,   //중복시간의 슬롯을 오버랩킬지 여부
        views: {
          agendaWeekly: {
  					type: 'agenda',
            buttonText: '훑어보기',
  					duration: {
              days: 7
            }
  				}
        },
        windowResize: function (view) {
          $(Calendar).fullCalendar('option', 'height', window.innerHeight );
        },
        // 캘린더 이벤트 렌더링시
        viewRender: function (view, elem) {
          _this.props.setRenderedViewType(view.type);
          _this.setState({
            viewType: view.type
          });
        },
        dayClick: function(date, jsEvent, view) {
          _this.setState({
            selectedDate :  date.format()
          });
          _this.isNewOrder(true);
        },
        eventDoubleClick: function(calEvent, jsEvent, view) {
          if (view.type ==='agendaDay') {
            _this.setState({ isReservationCard: true });
          }
        },
        eventDrop: function(event, delta, revertFunc) {
          alert(event.title + " was dropped on " + event.start.format());
          if (!confirm("Are you sure about this change?")) {
              revertFunc();
          }
        },
      });

      // ESC key 입력시 닫기
      $(document).bind('keydown', function(e){
          if (e.which === 27) {
              if (_this.state.isNewOrder) {
                  if (_this.state.isConfirm) {
                    _this.setState({ isConfirm: false });
                  } else {
                    _this.setState({ isNewOrder: false });
                  }
              }
          }
      });
  }

  componentWillUnmount() {
    let { Calendar } = this.refs;
    $(Calendar).fullCalendar('destroy');
  }

  render() {
    //let  { Calendar } = this.refs;
    this.init();
    const CreateOrderButton = <button className="create-order-button" onClick={ () => this.isNewOrderWeekly() }>+</button>
    const OrderDeadlineButton = <button className="order-deadline-button" onClick={ () => this.closeReservation() }>예약마감</button>
    return (
      <div ref="Calendar">
        <Controler overviewDays={this.props.overviewDays} onClick={this.scroll}/>
        {CreateOrderButton}
        {this.state.viewType === 'agendaDay' ? OrderDeadlineButton : undefined }
        {this.state.isNewOrder ? (
          <NewOrder
            renderOrder={ (bool, newEvent) => this.renderOrder(bool, newEvent) }
            isConfirmSet={ (bool) => this.isConfirmSet(bool) }
            isConfirm={this.state.isConfirm}
            selectedDate={this.state.selectedDate}
            />
          )
          : undefined
        }
        {this.state.isSelectDate ? <DatePicker onClick={this.selectDate}/> : undefined}
        {this.state.isReservationCard ? <ReservationCard cards={this.state.events} isReservationCard={ () => this.isReservationCard() }/> : undefined}
      </div>
    );
  }
}
