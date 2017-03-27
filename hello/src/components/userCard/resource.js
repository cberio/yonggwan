import React, { Component } from 'react';
import moment from 'moment';
import Products from '../../data/products.json';
import DatePicker from '../calendar/datePicker';
import * as Functions from '../../js/common';
import * as Images from '../../require/images';

class Resource extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isChangeDate: false,
      isChangeExpert: false,
      visibleDetails: 'history',
      historyActiveIndex : -1
    };
    this.toggleDetails = this.toggleDetails.bind(this);
    this.toggleHistorys = this.toggleHistorys.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  changeDate (date) {
    if (moment.isMoment(date)) {
      alert();
    }
    this.setState({ isChangeDate: !this.state.isChangeDate });
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
    const mapToHistoryList = (user) => {
      let { history } = user;
      let displayLength = 3;

      return (
        history.map((history, i) => {
          if ( i > displayLength +1 ) return false;
          return (
            <div key={i} className={`history-list ${history.product? Functions.getProductColor(history.product, Products) : ''}${this.state.historyActiveIndex === i ? " active" : ''}`}>
              <button onClick={ () => this.toggleHistorys(i) }>
                <div className="content">
                  <div className="info">
                    <span className="product-name">{history.product ? history.product : '서비스 정보 없음'}</span>
                    <span className="info-etc">
                      {user.type === 'request' && user.prepayment ? '예약요청 | 선결제' :
                       user.type === 'request' ? '예약요청' :
                       user.prepayment ? '선결제' : ''
                      }
                    </span>
                    { moment(history.date).isSame(moment(new Date()), 'day') ?
                      <span className="date today">당일예약</span> :
                      <span className="date">{`${history.date}(${moment(history.date).locale('ko').format('ddd')})`}</span>
                    }
                  </div>
                  {history.comment ? (
                    <p className="comment">{history.comment}</p>
                  ) : (
                    <p className="comment no-comment">메모없음</p>
                  )}
                </div>
              </button>
            </div>
          )
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
            <div className="history-container">
                { mapToHistoryList(data) }
            </div>
          </div>
        )
      }
    }

    const datePicker = (
      <DatePicker
        height={420}
        selectedDate={""}
        onChange={""}
        onClose={this.changeDate}
        className="user-card-event-datepicker"
      />
    );

    const state = this.state;
    const props = this.props;
    const user = props.users;


    return (
        <div className={`customer-detail ${Functions.getProductColor(user.product, Products)}`}>
      		<div className="product">
      			<div className="res-info">
      				<span className="tit">예약시간</span>
      				<span className="time time-date edit-ui">
                <button onClick={this.changeDate}>
                  {moment(user.start).format('YYYY. MM. DD')}<em>({moment(user.start).locale('ko').format('ddd')})</em>
                  {this.state.isChangeDate ? datePicker : ''}
                </button>
              </span>
              <span className="time time-hour edit-ui">
                <button>
                      {`${moment(user.start).format('HH:mm') + ' - ' + moment(user.end).format('HH:mm')}`}
                </button>
              </span>
      			</div>
      			<div className="type">
      				<span className="tit">상품명</span>
              <span className="service-name edit-ui">
                <button>
                  {user.product}
        					<span className="service-time">{Functions.minuteToTime(moment(user.end).diff(moment(user.start),'minute', true))}</span>
        				</button>
              </span>
      				<span className="price">
                <span>
                  선결제 :&nbsp;{Functions.getProductPrice(user.product, Products)}&#xFFE6;
                </span>
                <button className="price-change">금액변경</button>
      				</span>
      			</div>
      			<div className="ui">
      				<span className="ui-each ui-edit">
                <button onClick={this.props.onEditEvent}></button>
                <span className="title">예약재검토</span>
              </span>
              <span className="ui-each ui-delete">
                <button onClick={this.props.onRemoveEvent}></button>
                <span className="title">삭제</span>
              </span>
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
      					<button className="btn-edit" onClick="">편집하기</button>
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
      			{this.state.visibleDetails === 'history' ? mapToHistory(user) : user.comment_admin ? (
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
            {user.history.length > 3 ? <button className="prev" onClick={""}>이전</button> :'' }
            {user.history.length > 3 ?
              <div><input type="text" defaultValue="1" maxLength="2" /> / <span>{user.history.length}</span></div> :
              <div><input type="text" defaultValue="1" disabled /> / <span>{user.history.length}</span></div>
            }
      			{user.history.length > 3 ? <button className="next" onClick={""}>다음</button> :'' }
      		</div>
          {
            user.type === 'request' ? (
              <div className="request-approve">
                <button>예약요청 바로승인</button>
              </div>
            ) : ''
          }
      	</div>
    );
  }
}

Resource.defaultProps = {
  users: {
    id: undefined,
    type: undefined,
    prepayment: false,
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
