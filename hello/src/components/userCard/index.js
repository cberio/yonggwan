import React, { Component, defaultProps } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import Resource  from './resource';
import Slider from 'react-slick';
import '../../css/userCard.css';
import '../../css/customerCard.css';

class UserCard extends Component {
  constructor (props) {
    super (props);
    this.state = {
      slideIndex: 0 // props 로 초기값을 받아와야합니다
    }
  }

  componentDidMount () {
    let _this = this;
    $(document).one('keydown', function(e) {
      if(e.which === 27 ){
        _this.props.isUserCard(false);
      }
    });
    $(this.refs.mask).bind('click', function (e) {
      if (e.target.className.indexOf('modal-mask') !== -1) {
        _this.props.isUserCard(false);
        $(this).unbind('click');
      }
    });
  }
  render () {
    let _this = this;
    var slideSettings = {
      draggable: false,
      infinite: false,
      speed: 500,
      dots: false,
      initialSlide: this.state.slideIndex,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: function ( newIndex ) {
        _this.setState({
          slideIndex : newIndex
        });
      }
    };
    const mapToSlide = (cards) => {
      return cards.map((users, i) => {
        return (
          <div key={i}>
            <Resource
              expert={this.props.expert}
              users={users}
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
    return (
      <div className="customer-detail-wrap modal-mask mask-full" ref="mask">
        <div className="modal-layer slider">
          <Slider {...slideSettings} ref="slider">
            { mapToSlide(this.props.userCards) }
          </Slider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultSlide: state.userCard.defaultSlide,
    expert: state.userCard.expert,
    userCards: state.userCard.userCards
  }
}

export default connect(mapStateToProps)(UserCard);
