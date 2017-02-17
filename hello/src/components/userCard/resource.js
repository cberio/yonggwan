import React, { Component } from 'react';
import moment from 'moment';
import Products from '../../data/products.json';
import * as Functions from '../../js/common';
import * as Images from '../../require/images';

class Resource extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleDetails: 'history',
      historyActiveIndex : -1
    };
    this.toggleDetails = this.toggleDetails.bind(this);
    this.toggleHistorys = this.toggleHistorys.bind(this);
  }

  toggleDetails (type) {
    this.setState({
      visibleDetails: type
    });
  }

  toggleHistorys (i) {
    if (i === this.state.historyActiveIndex){
      this.setState({
        historyActiveIndex : -1
      });
    } else {
      this.setState({
        historyActiveIndex : i
      });
    }
  }


  render () {
    const mapToHistoryList = (history) => {
      //history.sort();
      let displayLength = 3;
      return (
        history.map((history, i) => {
          if ( i > displayLength +1 ) {
            return false;
          } else {
            /* [1. 메모가 없는경우] */
            if (history.comment === undefined ) {
              return (
                <li key={i} className={this.state.historyActiveIndex === i ? "active" : undefined}>
                  <div className="content">
                    <div className="lt">
                      { history.date === moment().format('YYYY-MM-DD') ? <span className="date today">당일예약</span> : <span className="date">{history.date}</span> }
                      <span className="product-name">{history.product ? history.product : '서비스 정보 없음'}</span>
                    </div>
                    <p className="no-comment">메모없음</p>
                  </div>
                </li>
              )
            } else {
              /* [2. 메모가 있는경우] */
                return (
                <li key={i} className={this.state.historyActiveIndex === i ? "active" : undefined}>
                  <button onClick={ () => this.toggleHistorys(i) }>
                    <div className="content">
                      <div className="lt">
                        { history.date === moment().format('YYYY-MM-DD') ? <span className="date today">당일예약</span> : <span className="date">{history.date}</span> }
                        <span className="product-name">{history.product ? history.product : '서비스 정보 없음'}</span>
                      </div>
                      <p className="comment">{history.comment}</p>
                    </div>
                  </button>
                </li>
              )
            }
          }
        })
      )
    }
    const mapToHistory = (data) => {
      if(!data) {
        return (
          <div className="history">
            <p className="no-history">시술내역이 없습니다.</p>
          </div>
        )
      } else {
        return (
          <div className="history">
            <ul>
                { mapToHistoryList(data) }
            </ul>
          </div>
        )
      }
    }


    const state = this.state;
    const props = this.props;
    const user = props.users;

    return (
        <div className={`customer-detail ${Functions.getProductColor(user.product, Products)}`}>
      		<div className="head">
      			<span className="name">{props.expert.title}</span>&nbsp;
      			<span className="nav">[{props.slideIndex +1}/{props.slideLength}]</span>
      			<button className="btn-close ir" onClick={ () => props.isUserCard(false) }>닫기</button>
      		</div>
      		<div className="product">
      			<div className="res-info">
      				<span className="tit">예약정보</span>
      				<span className="time">{`${moment(user.start).format('hh:mm')} - ${moment(user.end).format('hh:mm')}`}</span>
      			</div>
      			<div className="type">
      				<span className="tit">상품명</span>
      				<span className="service-name">{user.product}
      					<span className="service-time">{Functions.minuteToTime(moment(user.end).diff(moment(user.start),'minute', true))}</span>
      				</span>
      				<span className="price">30,000
      					<span className="won">&#xFFE6;</span>
      				</span>
      			</div>
      			<div className="ui">
      				<button className="btn-delete" onClick={this.props.onRemoveEvent}>삭제</button>
      				<button className="btn-edit" onClick={this.props.onEditEvent}>수정</button>
      			</div>
      		</div>
      		<div className="user-card-basic clearfix">
      			<div className="info">
      				<span className="picture">
                { user.picture ? <span className="thumbnail"><img src={user.picture} alt={user.name} /></span> : <span className="thumbnail"></span> }
      				</span>
      				<span className="name">{user.name}</span>
      				<span className="phone">{
                  typeof(user.phone) !== 'undefined' ? (
                     user.phone[0] +'-'+ user.phone[1] +'-'+ user.phone[2]
                  ): user.phone
                }</span>
      			</div>
      			<div className="util">
      				<div className="ui">
      					<button className="btn-edit" onClick="">수정</button>
      				</div>
      				<div className="sns">
                <a href="#" target="_blank"><img src={Images.IMG_mms} alt="MMS" title="MMS"/></a>
                {user.kakao ? <a href={user.kakao} target="_blank"><img src={Images.IMG_kakao} alt="Kakao talk" title="카카오톡"/></a> : undefined }
      					{user.line ? <a href={user.line} target="_blank"><img src={Images.IMG_line} alt="Line" title="라인"/></a> : undefined }
      				</div>
      			</div>
      		</div>
      		<div className="bottom">
      			<div className="tabmenu">
      				<button className={this.state.visibleDetails === 'history' ?  'active' : ''} onClick={ () => this.toggleDetails('history') }>시술내역</button>
      				<button className={this.state.visibleDetails === 'comments' ? 'active' : ''} onClick={ () => this.toggleDetails('comments') }>고객메모</button>
      			</div>
      			{this.state.visibleDetails === 'history' ? mapToHistory(user.history) : user.comment_admin ? (
                <div className="comments">
                  <p className="comment">{user.comment_admin}</p>
                </div>
              ) : (
                <div className="comments">
                  <p className="no-comment">메모가 없습니다.</p>
                </div>
              )
            }
      		</div>
      		<div className="indicator">
      			<button className="prev" onClick={""}>이전</button>
      			<input type="text" value="" disabled maxLength={2}/> / <span>99</span>
      			<button className="next" onClick={""}>다음</button>
      		</div>
      	</div>
    );
  }
}

Resource.defaultProps = {
  users: {
    id: undefined,
    rating: undefined,
    colorClass: "",
    product: "서비스 미설정",
    name: "이름없음",
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
  }
}

export default Resource;
