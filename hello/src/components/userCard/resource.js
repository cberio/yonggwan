import React, {Component} from 'react';
import moment from 'moment';
import Services from '../../data/services';
import {SelectableCustom, SearchProduct, CreatableCustom} from '../calendar/select';
import DatePicker from '../calendar/datePicker';
import Slider from 'react-slick';
import * as Functions from '../../js/common';
import * as Images from '../../require/images';

class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChangeDate: false,
            isChangeTime: false,
            isChangeProduct: false,
            isChangePrice: false,
            visibleDetails: 'history',
            historyActiveIndex: -1
        };
        this.toggleDetails = this.toggleDetails.bind(this);
        this.toggleHistorys = this.toggleHistorys.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.changeProduct = this.changeProduct.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (e) {
      console.log(e.target.innerHTML);
    }

    changeDate(date) {
        if (moment.isMoment(date))
            alert();
        this.setState({
            isChangeDate: !this.state.isChangeDate
        });
    }
    changeTime(condition, start, end) {
        this.setState({
            isChangeTime: !this.state.isChangeTime
        });
        if (!condition) {
            return false;
        }
        else {
            console.log(moment(start).format());
            console.log(moment(end).format());
        }
    }
    changeProduct(condition, product) {
      this.setState({
        isChangeProduct: !this.state.isChangeProduct
      });
    }
    changeAmount(condition) {
      this.setState({
        isChangePrice: !this.state.isChangePrice
      });
    }
    toggleDetails(type) {
        this.setState({visibleDetails: type});
    }
    toggleHistorys(i) {
        if (i === this.state.historyActiveIndex) {
          this.setState({historyActiveIndex: -1});
        }
        else {
            this.setState({historyActiveIndex: i}, () => {
              this.refs.inputDetail.focus();
            });
        }
    }

    render() {
        console.info('Render UserCard Resourcs');

        const mapToHistoryList = (user, history, i) => {
          return (
            <div key={i} className={`history-list ${history.product
                ? Functions.getProductColor(history.service, Services)
                : ''}${this.state.historyActiveIndex === i
                    ? " active"
                    : ''}`}>
                <button className="history-list-button" onClick={() => this.toggleHistorys(i)}>
                    <div className="content">
                        <div className="info">
                            <span className="product-name">{history.product
                                    ? history.product
                                    : '서비스 정보 없음'}</span>
                            <span className="info-etc">
                                {user.type === 'request' && user.prepayment
                                    ? '예약요청 | 선결제'
                                    : user.type === 'request'
                                        ? '예약요청'
                                        : user.prepayment
                                            ? '선결제'
                                            : ''
                                  }
                            </span>
                            {moment(history.date).isSame(moment(new Date()), 'day')
                                ? <span className="date today">당일예약</span>
                                : <span className="date">{`${history.date}(${moment(history.date).locale('ko').format('ddd')})`}</span>
                            }
                        </div>
                        {history.comment
                            ? (
                                <p className="comment">{history.comment}</p>
                            )
                            : (
                                <p className="comment no-comment">메모없음</p>
                            )
                        }
                    </div>
                </button>
                {this.state.historyActiveIndex === i ? historyDetail(user, history): ''
              }
            </div>
          )
        }

        const mapToHistory = (user) => {

            if (!user.history) {
                return <p className="no-history">시술내역이 없습니다.</p>
            }

            var { history } = user;
            var listLength = history.length;

            return (
              <div className="history-container">
                  {
                     history.map((history, i) => {
                      return mapToHistoryList(user, history, i)
                    })
                  }
              </div>
            )

        }

        const historyDetail = (user, history) => {
          return (
            <div className="history-detail">
                <div className="history-detail-info">
                  <button ref="inputDetail" onClick={() => this.toggleHistorys(this.state.historyActiveIndex)}>
                      <span className="product-name">{history.product
                              ? history.product
                              : '서비스 정보 없음'}
                      </span>
                      <span className="info-etc">{user.type === 'request' && user.prepayment
                              ? '예약요청 | 선결제'
                              : user.type === 'request'
                                  ? '예약요청'
                                  : user.prepayment
                                      ? '선결제'
                                      : ''
                            }
                      </span>
                  </button>
                  {moment(history.date).isSame(moment(new Date()), 'day')
                      ? <span className="date today">당일예약</span>
                      : <span className="date">{`${history.date}(${moment(history.date).locale('ko').format('ddd')})`}</span>
                  }
                </div>
                <div className="history-comment">
                  {history.comment
                      ? (
                          <p className="comment" contentEditable>
                            <div className="comment-inner">
                              {history.comment}
                            </div>
                          </p>
                      )
                      : (
                          <p className="comment no-comment" contentEditable>
                            <div className="comment-inner">
                              {history.comment}
                            </div>
                          </p>
                      )
                  }
                </div>
                <div className="history-ui">
                    <button className="ui-delete">삭제</button>
                    <button className="ui-edit">수정</button>
                </div>
            </div>
          );
        };


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

        // 테스트용 데이터 1,2
        const DATA1 = [
            {
                "start": "2017-03-27T10:00:00",
                "end": "2017-03-27T11:00:00"
            }, {
                "start": "2017-03-27T11:00:00",
                "end": "2017-03-27T12:00:00"
            }, {
                "start": "2017-03-27T12:00:00",
                "end": "2017-03-27T13:00:00"
            }
        ];
        const DATA2 = [
            {
                "start": "2017-03-27T10:00:00",
                "end": "2017-03-27T11:00:00"
            }, {
                "start": "2017-03-27T11:00:00",
                "end": "2017-03-27T12:00:00"
            }, {
                "start": "2017-03-27T12:00:00",
                "end": "2017-03-27T13:00:00"
            }, {
                "start": "2017-03-27T13:00:00",
                "end": "2017-03-27T14:00:00"
            }, {
                "start": "2017-03-27T14:00:00",
                "end": "2017-03-27T15:00:00"
            }, {
                "start": "2017-03-27T15:00:00",
                "end": "2017-03-27T16:00:00"
            }, {
                "start": "2017-03-27T16:00:00",
                "end": "2017-03-27T17:00:00"
            }, {
                "start": "2017-03-27T17:00:00",
                "end": "2017-03-27T18:00:00"
            }, {
                "start": "2017-03-27T18:00:00",
                "end": "2017-03-27T19:00:00"
            }
        ];

        return (
            <div className={`customer-detail ${Functions.getProductColor(user.service, Services)}`}>
                <div className="product">
                    <div className="res-info">
                        <span className="tit">예약시간</span>
                        <span className="time time-date edit-ui">
                            <button onClick={this.changeDate}>
                                {moment(user.start).format('YYYY. MM. DD')}<em>({moment(user.start).locale('ko').format('ddd')})</em>
                            </button>
                            {this.state.isChangeDate
                                ? datePicker
                                : ''}
                        </span>
                        <span className="time time-hour edit-ui">
                          <button onClick={this.changeTime}>
                            {`${moment(user.start).format('HH:mm') + ' - ' + moment(user.end).format('HH:mm')}`}
                          </button>
                          {this.state.isChangeTime
                              ? (
                                  <div className="time-change-wrap arrow-border-dark selectable-double-wrap">
                                      <SelectableCustom
                                        title="추천 예약시간"
                                        type="RecommendedReservationTime"
                                        themeClass="selectable-double-top light-gray"
                                        width={210}
                                        options={DATA1}
                                        onChange={(start, end) => this.changeTime(true, start, end)}
                                        onDestroy={() => this.changeTime(false)}
                                        value={undefined}
                                      />
                                      <SelectableCustom
                                        title="예약 가능시간"
                                        type="ReservationTime"
                                        themeClass="selectable-double-bottom"
                                        width={210}
                                        height={320}
                                        options={DATA2}
                                        onChange={(start, end) => this.changeTime(true, start, end)}
                                        onDestroy={() => this.changeTime(false)}
                                        value={undefined}
                                      />
                                  </div>
                              )
                              : ''
                            }
                        </span>
                    </div>
                    <div className="type">
                        <span className="tit">상품명</span>
                        <span className="service-name edit-ui">
                            <button onClick={() => this.changeProduct(true)} className="service-name-button">
                                <span className="service-text">{user.product}</span>
                                <span className="service-time">{Functions.minuteToTime(moment(user.end).diff(moment(user.start), 'minute', true))}</span>
                            </button>
                            {this.state.isChangeProduct
                              ? <SearchProduct
                                  selectType="searchable"
                                  autoDropdown={true}
                                  customFilterComponent={true}
                                  name="products"
                                  id="change-product"
                                  className="change-product arrow-border-dark"
                                  placeholder="검색어를 입력하세요"
                                  noResultsText="결과가 없습니다"
                                  options={Services}
                                  value={null}
                                  onChange={this.inputChangeProduct}
                                />
                              : ''}
                        </span>
                        {user.prepayment
                          ? (
                            /* 선결제인경우*/
                            <span className="price edit-ui">
                              <button onClick={this.changeAmount} className="">선결제 :&nbsp;{Functions.getService(user.service_code, Services).amount}&#xFFE6;</button>
                              <button onClick={this.changeAmount} className="price-change">금액변경</button>
                              {this.state.isChangePrice
                                ? <CreatableCustom
                                    type="changePayment"
                                    onDestroy={this.changeAmount}
                                    handleIncrement={null}
                                    handleDecrement={null}
                                  />
                                : ''
                              }
                            </span>)
                          : (
                            /* 선결제가 아닌 경우 */
                            <span className="price">
                              <span>{Functions.getService(user.service_code, Services).amount}&#xFFE6;</span>
                            </span>)
                        }
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
                            {user.picture
                                ? <span className="thumbnail"><img src={user.picture} alt={user.name}/></span>
                                : <span className="thumbnail"></span>}
                        </span>
                        <span className="user">
                          <span className="name">{user.name}</span>
                          <span className={user.rating ? user.rating.toLowerCase() + ' rating' : 'rating'}>{user.rating}</span>
                          <span className="phone">{typeof(user.phone) !== 'undefined'
                                  ? (user.phone[0] + '-' + user.phone[1] + '-' + user.phone[2])
                                  : user.phone}</span>
                        </span>
                    </div>
                    <div className="util">
                        <div className="ui">
                            <button className="btn-edit" onClick="">편집하기</button>
                        </div>
                        <div className="sns">
                            <a href="#" target="_blank"><img src={Images.IMG_mms} alt="MMS" title="MMS"/></a>
                            {user.kakao
                                ? <a href={user.kakao} target="_blank"><img src={Images.IMG_kakao} alt="Kakao talk" title="카카오톡"/></a>
                                : undefined}
                            {user.line
                                ? <a href={user.line} target="_blank"><img src={Images.IMG_line} alt="Line" title="라인"/></a>
                                : undefined}
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="tabmenu">
                        <button
                          className={this.state.visibleDetails === 'history'
                            ? 'active'
                            : ''}
                          onClick={() => this.toggleDetails('history')}>
                            시술내역
                        </button>
                        <button
                          className={this.state.visibleDetails === 'comments'
                            ? 'active'
                            : ''}
                          onClick={() => this.toggleDetails('comments')}>
                            고객메모
                        </button>
                    </div>
                    {this.state.visibleDetails === 'history'
                      ? (
                        <div className="history">
                          {mapToHistory(user)}
                          <div className="indicator">
                              {user.history.length > 3
                                  ? <button className="prev" onClick={""}>이전</button>
                                  : ''
                              }
                              {user.history.length > 3
                                  ? <div><input type="text" defaultValue="1" maxLength="2"/>
                                          /
                                          <span>{user.history.length}</span>
                                      </div>
                                  : <div><input type="text" defaultValue="1" disabled/>
                                      /
                                      <span>{user.history.length}</span>
                                  </div>
                              }
                              {user.history.length > 3
                                  ? <button className="next" onClick={""}>다음</button>
                                  : ''}
                          </div>
                        </div>
                      )
                      : user.comment_admin
                          ? (
                              <div className="comments">
                                  <div className="comment-inner">
                                    <span className="caption">[관리자]</span>
                                    <p className="comment" contentEditable={true} onKeyDown={this.handleChange}>{user.comment_admin}</p>
                                  </div>
                              </div>
                          )
                          : (
                              <div className="comments">
                                <div className="comment-inner">
                                  <p className="no-comment" contentEditable={true} onKeyDown={this.handleChange}>메모가 없습니다.</p>
                                </div>
                              </div>
                          )
                    }
                </div>
                {user.type === 'request'
                    ? (
                        <div className="request-approve">
                            <button>예약요청 바로승인</button>
                        </div>
                    )
                    : ''
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
        history: [
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
