import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as actions from '../../actions';
import * as Functions from '../../js/common';

class ReservationCardHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          staffMemo: this.props.history.staff_memo
        }
        this.changeStaffMemo = this.changeStaffMemo.bind(this);
    }

    changeStaffMemo(e) {
      this.setState({
        staffMemo: e.target.value
      })
    }

    render() {
        const { user,
                history,
                index,
                historyActiveIndex,
                isEditStaffMemo,
                services
              } = this.props;

        const historyDetail = (user, history, isEdit) => {
          return (
            <div className="history-detail">
                <div className="history-detail-info">
                  <button ref="inputDetail" onClick={() => this.props.toggleHistories(historyActiveIndex)}>
                      <div>
                        <span className="product-name">
                          {history.shop_service_id
                              ? Functions.getService(history.shop_service_id, services).name
                              : '서비스 정보 없음'
                            }
                        </span>
                        <span className="info-etc">
                          {history.status == actions.ScheduleStatus.REQUESTED && !_.isEmpty(history.payments)
                              ? '예약요청 | 선결제'
                              : history.status == actions.ScheduleStatus.REQUESTED
                                  ? '예약요청'
                                  : !_.isEmpty(history.payments)
                                      ? '선결제'
                                      : ''
                            }
                        </span>
                      </div>
                      <div>
                        <span className="product-amount">
                          {history.shop_service_id
                              ? Functions.numberWithCommas(Functions.getService(history.shop_service_id, services).amount)
                              : 0
                          } &#xFFE6;{/* WON 특수문자*/}
                        </span>
                        <span className="prepayment-amount">
                          {Functions.numberWithCommas(370000.00)}
                           &#xFFE6;{/* WON 특수문자*/}(잔액)
                        </span>
                      </div>
                  </button>
                  {moment(history.reservation_dt).isSame(moment(new Date()), 'day')
                      ? <span className="date today">오늘</span>
                      : <span className="date">{`${history.reservation_dt}(${moment(history.reservation_dt).locale('ko').format('ddd')})`}</span>
                  }
                </div>
                {isEdit ? (
                  <div className="history-comment">
                    <textarea
                      value={this.state.staffMemo}
                      placeholder={this.state.staffMemo ? '' : "메모를 입력하세요"}
                      onChange={this.changeStaffMemo}
                    />
                  </div>
                ) : (
                  <div className="history-comment">
                      <dl className={`comment${history.guest_memo ? '' : ' no-comment'}`}>
                        <dt className="caption">[고객]</dt>
                        <dd className="memo">
                          {history.guest_memo ? history.guest_memo : '메모가 없습니다.'}
                        </dd>
                      </dl>
                      <dl className={`comment${this.state.staffMemo ? '' : ' no-comment'}`}>
                        <dt className="caption">[시술자]</dt>
                        <dd className="memo">
                          {this.state.staffMemo ? this.state.staffMemo : '메모가 없습니다.'}
                        </dd>
                      </dl>
                  </div>
                )}
            </div>
          );
        };

        if (historyActiveIndex == null && historyActiveIndex == index) {
            return ''
        }

        return (
          <div className={`history-list ${history.shop_service_id
              ? Functions.getService(history.shop_service_id, services).color
              : ''}${historyActiveIndex === index
                  ? " active"
                  : ''}`}>
              <button className="history-list-button" onClick={() => this.props.toggleHistories(index)}>
                  <div className="content">
                      <div className="info">
                          <span className="product-name">{history.shop_service_id
                                  ? Functions.getService(history.shop_service_id, services).name
                                  : '서비스 정보 없음'}</span>
                          <span className="info-etc">
                              {history.status == actions.ScheduleStatus.REQUESTED && !_.isEmpty(history.payments)
                                  ? '예약요청 | 선결제'
                                  : history.status == actions.ScheduleStatus.REQUESTED
                                      ? '예약요청'
                                      : !_.isEmpty(history.payments)
                                          ? '선결제'
                                          : ''
                                }
                          </span>
                          {moment(history.reservation_dt).isSame(moment(new Date()), 'day')
                              ? <span className="date today">오늘</span>
                              : <span className="date">
                                {`
                                  ${moment(history.reservation_dt).format('YYYY. MM. DD')}
                                  (${moment(history.reservation_dt).locale('ko').format('ddd')})
                                `}
                              </span>
                          }
                      </div>
                      {history.guest_memo
                          ? (
                              <p className="comment">[고객] {history.guest_memo}</p>
                          )
                          : (
                              <p className="comment no-comment">메모없음</p>
                          )
                      }
                  </div>
              </button>
              {historyActiveIndex === index && historyDetail(user, history, isEditStaffMemo)}
          </div>
        )
    }
}

ReservationCardHistoryList.defaultProps = {
}

export default ReservationCardHistoryList;
