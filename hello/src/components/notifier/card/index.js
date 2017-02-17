import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Experts from '../../../data/experts';
import Products from '../../../data/products';
import * as Functions from '../../../js/common';
import * as actions from '../../../actions';
import { connect } from 'react-redux';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.requestReservation = this.requestReservation.bind(this);
  }
  getExpertName (resourceId) {
    for (let i=0; i < Experts.length; i++) {
      if (resourceId === Experts[i].id) return Experts[i].title;
    }
  }
  requestReservation (event) {
    // 현재 페이지가 예약 페이지가 아닌경우 예약페이지로 이동에 대한 방안이 필요함
    if (location.pathname.indexOf('reservation') < 0) location.pathname = '/reservation/overview'; //임시
    // 예약 페이지로 전환 후, 렌더링시 바로 예약요청카드가 보여지도록 세팅함
    this.props.showRequestReservation(event);
  }
  render () {
    const { id, resourceId, rating, className, product, name,
            phone, start, end, picture, comment, comment_admin,
            kakao, line, history
          } = this.props.event;
    const content = (
      <div className="card-content">
        <div className="service clearfix">
          <div className="lt">
            <span className={`product ${Functions.getProductColor(product, Products)}`}>{product}</span>
            {this.props.CardType === '변경' ? <span className="time last">00.00(목)00:00~00:00</span> : null}
            <span className="time">
              <span>{moment(start).locale('ko').format('MM.DD(ddd)hh:mm') +"~"+ moment(end).format('hh:mm')}</span>
              <span className="expert">{this.getExpertName(resourceId)}</span>
            </span>
          </div>
          <div className="rt">
            <span className="posted">00:00</span>
          </div>
        </div>
        <div className="customer">
          <div className="user">
            <div className="thumbnail">
              <div className="picture">
                {picture && <img src={picture} alt={name} width="32" height="32" />}
              </div>
              {rating && rating.toUpperCase() !=='NORMAL' && <i className={`rating-bullet ${rating.toUpperCase()}`}>{rating}</i>}
            </div>
            <span className="name">{name}</span>
            {rating && rating.toUpperCase() !=='NORMAL' && <span className={`rating ${rating.toUpperCase()}`}>{rating}</span>}
          </div>
          <p className="comment">
            {comment}
          </p>
        </div>
      </div>
    )
    return (
      this.props.CardType === '요청' ? (
        <button onClick={ () => this.requestReservation(this.props.event) } className="link">{content}</button>
      ): content
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    showRequestReservation: (event) => dispatch(actions.requestReservation({
      condition: true,
      requestEvent: event
    }))
  }
}
export default connect(null, mapDispatchToProps)(Card);
