import React, { Component } from 'react';
import $ from 'jquery';
import * as actions from '../../actions';
import { connect } from 'react-redux';
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
      slideStaff: this.props.selectedStaff
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
    const componnent = this;
    var slides = this.props.schedules.filter(function(slide){
      // 필터[1]: 선택한 이벤트의 날짜와 다른 날짜의 이벤트를 제거한다
      var case1 = moment(slide.start).isSame(componnent.state.slideDate.format('YYYY-MM-DD'), 'day');

      // 필터[2]: OFF TIME 이벤트를 제거한다
      var case2 = slide.status !== actions.ScheduleStatus.OFFTIME;
      // 필터[3]: 다른 Staff의 이벤트를 제거한다
      var case3 = slide.resourceId == componnent.state.slideStaff.id // [3]
      return case1 && case2 && case3;
    })
    var initialSlideIndex;
    for (var i = 0; i < slides.length; i++ ) {
      if (slides[i].id === this.state.slideCard) {
        initialSlideIndex = i;
        break;
      }
    }
    // display max length of slides
    $('em.all').ready(function(){
      $('em.all').html(slides.length);
    });
    // this.setState({
    //   slideIndex: initialSlideIndex
    // });
    this.slides = slides;
    return slides;
  }

  setUserCards (type, option) {
    let _component = this;

    $('.slick-list').animate({'opacity': 0.1}, 200, function () {
      if    (type === 'staff') { _component.props.changeStaff(option); }
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
      slideStaff: nextProps.selectedStaff,
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
      accessibility: false,
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
                staffs={this.state.slideStaff}
                services={this.props.services}
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
        onChange={ (momentDate) => this.setUserCards('date', momentDate) }
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
        <dl className="viewview">
          <dt>slideIndex: </dt><dd>{this.state.slideIndex ? this.state.slideIndex : ''}</dd>
          <dt>slideDate: </dt><dd>{this.state.slideDate ? this.state.slideDate.format() : ''}</dd>
          <dt>slideCard: </dt><dd>{this.state.slideCard ? this.state.slideCard.guest_name : ''}</dd>
          <dt>slideStaff: </dt><dd>{this.state.slideStaff ? this.state.slideStaff.label : ''}</dd>
        </dl>
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
              value={this.state.slideStaff}
              type="user-card"
              selectType="selectable"
              name="epxerts"
              id="select-slide"
              className="select-expert"
              options={this.props.staffs}
              onChange={ (option) => this.setUserCards('staff', option)}
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
    selectedStaff: state.userCard.selectedStaff,
    selectedDate: state.userCard.selectedDate
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeStaff: (option) => {
      dispatch(actions.userCardStaff(option))
    },
    changeDate: (option) => {
      dispatch(actions.userCardDate(option))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);
