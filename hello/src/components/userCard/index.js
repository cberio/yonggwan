import React, { Component, defaultProps } from 'react';
import $ from 'jquery';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import Experts from '../../data/experts.json';
import moment from 'moment';
import Resource  from './resource';
import { Selectable } from '../calendar/select';
import DatePicker from '../calendar/datePicker';
import Slider from 'react-slick';
import '../../css/userCard.css';
import '../../css/customerCard.css';

class UserCard extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isChangeDate: false,
      currentSlide : {
        isBefore: false
      },
      slideIndex: 0,
      slideDate: this.props.selectedDate,
      slideCard: this.props.selectedCard,
      slideExpert: this.props.selectedExpert
    };
    this.initUserCards = this.initUserCards.bind(this);
    this.setUserCards = this.setUserCards.bind(this);
    this.setSlideInfo = this.setSlideInfo.bind(this);
    this.isChangeDate = this.isChangeDate.bind(this);
    this.test = this.test.bind(this);
    this.slides = null;
  }

  test () {
    // this.setState({
    //   slideDate: moment(new Date())
    // });
  }

  initUserCards () {
    // 모든 예약 카드들을 모두 가져와 복제한다
    var eventsAll = this.props.cards;
    var eventsFiltered = [];
    var initialSlideIndex;

    for (var i = 0; i < eventsAll.length; i++) {
      // 필터[1]: 선택한 이벤트의 날짜와 다른 날짜의 이벤트를 제거한다
      // 필터[2]: OFF TIME 이벤트를 제거한다
      // 필터[3]: 다른 Expert의 이벤트를 제거한다

      if (
        moment(eventsAll[i].start).isSame(this.state.slideDate.format('YYYY-MM-DD'), 'day') && // [1]
        eventsAll[i].product !== 'OFF TIME' && // [2]
        eventsAll[i].resourceId === this.state.slideExpert.id // [3]
      ) eventsFiltered.push(eventsAll[i]);
    }

    for (var j = 0; j < eventsFiltered.length; j++) {
      if (eventsFiltered[j].id === this.state.slideCard.id) {
        initialSlideIndex = j;
        break;
      }
    }

    // display max length of slides
    $('em.all').ready(function(){
      $('em.all').html(eventsFiltered.length);
    });

    //if (!this.state.slideIndex) this.setState({ slideIndex: initialSlideIndex });무한루프 (?)

    this.slides = eventsFiltered;
    return eventsFiltered;
  }

  setUserCards (type, option) {
    let _component = this;

    $('.slick-list').animate({'opacity': 0.1}, 200, function () {
      if    (type === 'expert') { _component.props.changeExpert(option); }
      else if (type === 'date') { _component.props.changeDate(option); }
      $('.slick-list').css('opacity', 1);
    });
  }

  setSlideInfo (idx) {
    let { slides } = this;
    if (moment(slides[idx].end, 'YYYY-MM-DD HH:mm:ss').isBefore(moment(new Date()), 'minute')) {
      this.setState({
        currentSlide: {
          isBefore: true
        }
      });
    } else {
      this.setState({
        currentSlide: {
          isBefore: false
        }
      });
    }
  }

  isChangeDate (condition) {
    this.setState({
      isChangeDate: condition
    });
  }

  componentWillReceiveProps (nextProps) {
    // props가 변경되어 받아오는 값을 state로 강제로 업데이트함
    this.setState({
      slideCard: nextProps.selectedCard,
      slideExpert: nextProps.selectedExpert,
      slideDate: nextProps.selectedDate
    });
  }

  componentDidMount () {
    let _component = this;

    $(document).one('keydown', function(e) {
      if(e.which === 27 ){
        _component.props.isUserCard(false);
      }
    });
    $(this.refs.mask).bind('click', function (e) {
      if (e.target.className.indexOf('modal-mask') !== -1) {
        e.stopPropagation();
        _component.props.isUserCard(false);
        $(this).unbind('click');
      }
    });
  }
  render () {
    let _component = this;
    var slideSettings = {
      draggable: false,
      infinite: false,
      speed: 500,
      dots: false,
      initialSlide: this.state.slideIndex,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: function ( newIndex ) {
        _component.setState({ slideIndex : newIndex });
        _component.setSlideInfo(newIndex);
      }
    };

    const mapToSlide = (cards) => {
      if (cards.length < 1) {
          return <div style={{'background':'#AAA','textAlign':'left', 'fontSize':'30px', 'padding':'250px 15px'}}>예약카드가 없습니다</div>
        } else {
        return cards.map((users, i) => {
          return (
            <div key={i}>
              <Resource
                users={users}
                expert={this.state.slideExpert}
                slideIndex={this.state.slideIndex}
                slideLength={cards.length}
                isUserCard={ (bool) => this.props.isUserCard(bool) }
                onRemoveEvent={ () => this.props.onRemoveEvent(users) }
                onEditEvent={ () => this.props.onEditEvent(users) }
              />
            </div>
          )
        })
      }
    }

    const datePicker = (
      <DatePicker
        height={520}
        selectedDate={this.state.slideDate}
        onChange={ (date) => this.setUserCards('date', date) }
        onClose={ () => this.isChangeDate(false)}
        className="user-card-slide-datepicker"
      />
    );

    const test = (
      <button style={{'position': 'fixed', 'left': '100px', 'top': '0px', 'zIndex': 10, 'background': 'rgb(0, 238, 238)'}} onClick={this.test}>테스트클릭</button>
    )

    return (
      <div className="customer-detail-wrap modal-mask mask-full" ref="mask">
        {test}
        <div className="viewview">
          {this.state.slideDate ? this.state.slideDate.format() : ''}
        </div>
        <div className="slider">
          <div className="slider-date">
            <button onClick={ () => this.isChangeDate(!this.state.isChangeDate) }>
              {`
                ${this.state.slideDate ? this.state.slideDate.format('YYYY.MM.DD') +
                '(' + this.state.slideDate.locale('ko').format('ddd') +')' : '날짜선택'}
              `}
              { this.state.isChangeDate ? datePicker: ''}
            </button>
          </div>
          <div className="customer-head">
            <Selectable
              value={this.state.slideExpert}
              type="user-card"
              selectType="selectable"
              name="epxerts"
              id="select-slide"
              className="select-expert"
              options={Experts}
              onChange={ (option) => this.setUserCards('expert', option)}
              clearable={false}
              searchable={false}
            />
            <span className="nav">
              (<em className="current">{this.state.slideIndex +1}</em>/
              <em className="all">{this.slides ? this.slides.length : 1}</em>)
            </span>
            {this.state.currentSlide.isBefore ? <span className="state">완료</span> : ''}
            <button className="btn-close ir" onClick={ () => this.props.isUserCard(false) }>닫기</button>
          </div>
          <Slider {...slideSettings} ref="slider">
            { mapToSlide(this.initUserCards()) }
          </Slider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCard: state.userCard.selectedCard,
    selectedExpert: state.userCard.selectedExpert,
    selectedDate: state.userCard.selectedDate
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeExpert: (option) => {
      dispatch(actions.userCardExpert(option))
    },
    changeDate: (option) => {
      dispatch(actions.userCardDate(option))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);
