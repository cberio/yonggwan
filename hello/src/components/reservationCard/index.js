import React, { Component, defaultProps } from 'react';
import $ from 'jquery';
import { Resource }  from './resource';
import Slider from 'react-slick';
import '../../css/reservationCard.css';

export default class ReservationCard extends Component {
  constructor (props) {
    super (props);
    this.state = {
      slideIndex : 0
    };
  }
  setSlideIndex (e) {
  }
  componentDidMount () {
    let _this = this;
    $(document).one('keydown', function(e){
      if(e.which === 27 ){
        _this.props.isReservationCard();
      }
    });
  }
  render () {
    let _this = this;
    var slideSettings = {
      infinite: false,
      speed: 500,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: function ( newIndex ) {
        _this.setState({
          slideIndex : newIndex
        });
      }
      //initialSlide: str
    };
    const mapToSlide = (cards) => {
      return cards.map((users, i) => {
        return (
          <div>
            <Resource
              key={i}
              users={users}
              slideIndex={this.state.slideIndex}
              isReservationCard={ () => this.props.isReservationCard() }/>
          </div>
        )
      })
    }
    return (
      <div className="customer-detail-wrap modal-mask">
        <div className="modal-layer slider">
          <Slider {...slideSettings} ref="slider">
            { mapToSlide(this.props.cards) }
          </Slider>
        </div>
      </div>
    );
  }
}

ReservationCard.defaultProps = {
  id: undefined,
  rating: "NORMAL",
  colorClass: "",
  product: undefined,
  name: "알수없음",
  phone: "연락처가 없습니다",
  start: undefined,
  end: undefined,
  picture: undefined,
  comment: undefined,
  comment_admin: undefined,
  kakao: undefined,
  line: undefined,
  history:[
    {
      date: undefined,
      time: undefined,
      product: undefined,
      comment: undefined,
      picture: []
    }
  ]
};
