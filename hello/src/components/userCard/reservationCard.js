import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import update from 'immutability-helper';
import Slider from 'react-slick';
import { SelectableCustom, SearchService, CreatableCustom } from '../calendar/select';
import DatePicker from '../calendar/datePicker';
import Histories from '../../data/histories';
import ReservationCardHistoryList from './reservationCardHistoryList';
import Guests from '../../data/guests';
import * as actions from '../../actions';
import * as Functions from '../../js/common';
import * as Images from '../../require/images';

class ReservationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guest: {},
            isChangeDate: false,
            isChangeTime: false,
            isChangeService: false,
            isChangePrice: false,
            isEditStaffMemo: false,
            isEditGuestMemo: false,
            isRemoveGuestMemoHistory: false,
            isRemoveGuestMemo: false,
            isActiveHistory: true,
            isActiveHistoryDetail: false,
            historyActiveIndex: null,
            historySlideIndex: 0,
        };

        this.toggleDetails = this.toggleDetails.bind(this);
        this.toggleHistories = this.toggleHistories.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.changeService = this.changeService.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.changeGuestMemo = this.changeGuestMemo.bind(this);
        this.slideNext = this.slideNext.bind(this);
        this.slidePrev = this.slidePrev.bind(this);
        this.slideChange = this.slideChange.bind(this);
        this.slideAfter = this.slideAfter.bind(this);
        this.handleEditStaffMemo = this.handleEditStaffMemo.bind(this);
        this.handleEditGuestMemo = this.handleEditGuestMemo.bind(this);
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.guests) !== JSON.stringify(nextProps.guests))
            this.setState({
                guest: Functions.getGuest(this.props.users.guest_id, this.props.guests)
            });
    }
    changeGuestMemo(e) {
        this.setState({
            guest: update(
                this.state.guest, {
                    memo: {
                        $set: e.target.value
                    }
                }
            )
        });
    }
    changeDate(momentDate) {
        this.setState({
            isChangeDate: !this.state.isChangeDate
        });
        console.log(momentDate);
    }
    changeTime(condition, start, end, type) {
        this.setState({
            isChangeTime: !this.state.isChangeTime
        });
        if (condition) {
            console.info(type);
            console.info(start);
            console.info(end);
        }
    }
    changeService(service) {
        this.setState({
            isChangeService: !this.state.isChangeService
        });
        console.info(service);
    }
    changeAmount(amount, gubun) {
        this.setState({
            isChangePrice: !this.state.isChangePrice
        });
        if (gubun)
            console.info(gubun + amount);
    }
    toggleDetails(condition) {
        this.setState({ isActiveHistory: condition });
    }
    toggleHistories(i) {
        if (this.state.isEditStaffMemo)
            this.setState({
                isEditStaffMemo: false
            });

        if (i === this.state.historyActiveIndex)
            this.setState({
                historyActiveIndex: null,
                isActiveHistoryDetail: false,
            });

        else
            this.setState({
                historyActiveIndex: i,
                isActiveHistoryDetail: true
            }, () => {
              // this.inputDetail.focus();
            });
    }
    handleEditStaffMemo() {
        this.setState({
            isEditStaffMemo: !this.state.isEditStaffMemo
        });
    }
    handleEditGuestMemo() {
        this.setState({
            isEditGuestMemo: !this.state.isEditGuestMemo
        });
    }
    // <Slider /> 의 Value를 세팅하고 슬라이드를 이동함
    slideChange(e) {
        if (isNaN(e.target.value))
            e.target.value = '';
        this.slider.slickGoTo(e.target.value - 1);
    }
    // <Slider /> 가 슬라이딩 된후 Value를 세팅함
    slideAfter(idx) {
        this.setState({
            historySlideIndex: idx
        });
        this.slideValue.value = idx + 1; // set vlaue to input element
    }
    slidePrev() {
        this.slider.slickPrev();
    }
    slideNext() {
        this.slider.slickNext();
    }

    render() {
        const state = this.state;
        const props = this.props;
        const user = props.users;
        const user_guestInfo = Functions.getGuest(user.guest_id, Guests);
        const user_historyInfo = Functions.getHistory(user.guest_id, Histories);
        const lengthOfHistorySlide = 3;
        // 테스트용 데이터 1,2
        const DATA1 = [
            {
                start: '2017-03-27T10:00:00',
                end: '2017-03-27T11:00:00'
            }, {
                start: '2017-03-27T11:00:00',
                end: '2017-03-27T12:00:00'
            }, {
                start: '2017-03-27T12:00:00',
                end: '2017-03-27T13:00:00'
            }
        ];
        const DATA2 = [
            {
                start: '2017-03-27T10:00:00',
                end: '2017-03-27T11:00:00'
            }, {
                start: '2017-03-27T11:00:00',
                end: '2017-03-27T12:00:00'
            }, {
                start: '2017-03-27T12:00:00',
                end: '2017-03-27T13:00:00'
            }, {
                start: '2017-03-27T13:00:00',
                end: '2017-03-27T14:00:00'
            }, {
                start: '2017-03-27T14:00:00',
                end: '2017-03-27T15:00:00'
            }, {
                start: '2017-03-27T15:00:00',
                end: '2017-03-27T16:00:00'
            }, {
                start: '2017-03-27T16:00:00',
                end: '2017-03-27T17:00:00'
            }, {
                start: '2017-03-27T17:00:00',
                end: '2017-03-27T18:00:00'
            }, {
                start: '2017-03-27T18:00:00',
                end: '2017-03-27T19:00:00'
            }
        ];

        const mapToHistory = (user, histories) => {
            // guest history를 3개씩 그룹지어 매핑 (3개씩 하나의 슬라이드)
            const chunkHistories = _.chunk(histories, lengthOfHistorySlide);
            if (!histories.length)
                return <p className="no-history">시술내역이 없습니다.</p>;

            return chunkHistories.map((chunkHistory, j) => (
              <div className="history-container" key={j} >
                {chunkHistory.map((history, i) => (
                  <ReservationCardHistoryList
                    services={this.props.services}
                    user={user}
                    history={history}
                    index={parseInt(`${j}${i}`)}
                    key={parseInt(`${j}${i}`)}
                    historyActiveIndex={state.historyActiveIndex}
                    isEditStaffMemo={state.isEditStaffMemo}
                    toggleHistories={i => this.toggleHistories(i)}
                  />
                        ))
                    }
              </div>
              ));
        };

        const DatePickerComponent = (
          <DatePicker
            height={420}
            selectedDate={''}
            onChange={momentDate => this.changeDate(momentDate)}
            onClose={this.changeDate}
            className="user-card-event-datepicker"
          />
        );

        const SelectableComponent = (
          <div className="time-change-wrap arrow-border-dark selectable-double-wrap">
            <SelectableCustom
              title="추천 예약시간"
              type="RecommendedReservationTime"
              themeClass="selectable-double-top light-gray"
              width={210}
              options={DATA1}
              onChange={(start, end, type) => this.changeTime(true, start, end, type)}
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
              onChange={(start, end, type) => this.changeTime(true, start, end, type)}
              onDestroy={() => this.changeTime(false)}
              value={undefined}
            />
          </div>
        );

        const SearchableComponent = (
          <SearchService
            selectType="searchable"
            autoDropdown
            customFilterComponent
            name="products"
            id="change-product"
            className="change-product arrow-border-dark"
            placeholder="검색어를 입력하세요"
            noResultsText="결과가 없습니다"
            options={this.props.services}
            value={null}
            onChange={service => this.changeService(service)}
          />
        );

        const CreatableComponent = (
          <CreatableCustom
            type="changePayment"
            onDestroy={this.changeAmount}
            handleIncrement={amount => this.changeAmount(amount, '+')}
            handleDecrement={amount => this.changeAmount(amount, '-')}
          />
        );

        // 클래스 관련
        const containerElemClass = ['customer-detail'];

        if (user.shop_service_id)
            containerElemClass.push(
            Functions.getService(user.shop_service_id, this.props.services).color
          );


        if (user.status)
            switch (user.status) {
                case actions.ScheduleStatus.DONE :
                    containerElemClass.push('done');
                case actions.ScheduleStatus.REQUESTED :
                    containerElemClass.push('request');
                default:
                    break;
            }

        // E// 클래스관련

        return (
          <div className={containerElemClass.join(' ')}>
            <div className="product">
              <div className="info">
                <div className="res-info">
                  <span className="tit">예약시간</span>
                  <span className="time time-date edit-ui">
                    <button onClick={this.changeDate}>
                      {moment(user.start).format('YYYY. MM. DD')}<em>({moment(user.start).locale('ko').format('ddd')})</em>
                    </button>
                  </span>
                  <span className="time time-hour edit-ui">
                    <button onClick={() => this.changeTime(!this.state.isChangeTime)}>
                      {`${`${moment(user.start).format('HH:mm')} - ${moment(user.end).format('HH:mm')}`}`}
                    </button>
                  </span>
                </div>
                <div className="type">
                  <span className="tit">상품명</span>
                  <span className="service-name edit-ui">
                    <button onClick={this.changeService} className="service-name-button">
                      <span className="service-text">{Functions.getService(user.shop_service_id, this.props.services).name}</span>
                      <span className="service-time">{Functions.minuteToTime(moment(user.end).diff(moment(user.start), 'minute', true))}</span>
                    </button>
                  </span>
                  {!_.isEmpty(user.payments) ?
                      user.payments[0].payment_type === '선결제테스트' ? (
                          /* 선결제인경우*/
                          <span className="price edit-ui">
                            <button onClick={this.changeAmount} className="">선결제 :&nbsp;
                              {Functions.numberWithCommas(Functions.getService(user.shop_service_id, this.props.services).amount)} &#xFFE6;
                            </button>
                            <button onClick={this.changeAmount} className="price-change">금액변경</button>
                          </span>
                        )
                        : user.payments[0].payment_type === '횟수차감' ? (
                          <span className="price">
                            <span className="count">
                              [<strong>7</strong>/10]
                            </span>
                            <span>
                              {Functions.numberWithCommas(Functions.getService(user.shop_service_id, this.props.services).amount)} &#xFFE6;
                            </span>
                          </span>
                        )
                        : ''
                   : (
                     /* 기본 */
                     <span className="price">
                       <span>
                         {Functions.numberWithCommas(Functions.getService(user.shop_service_id, this.props.services).amount)} &#xFFE6;
                       </span>
                     </span>)
                   }
                </div>
              </div>
              <div className="ui">
                <span className="ui-each ui-edit">
                  <button onClick={this.props.onEditEvent} />
                  <span className="title">예약재검토</span>
                </span>
                <span className="ui-each ui-delete">
                  <button onClick={this.props.onRemoveEvent} />
                  <span className="title">삭제</span>
                </span>
              </div>
              <div className="conditional-elements">
                {this.state.isChangeDate && DatePickerComponent}
                {this.state.isChangeTime && SelectableComponent}
                {this.state.isChangeService && SearchableComponent}
                {this.state.isChangePrice && CreatableComponent}
              </div>
            </div>
            <div className="user-card-basic clearfix">
              <div className="info">
                <span className="picture">
                  {user_guestInfo && user_guestInfo.picture
                                ? <span className="thumbnail"><img src={user_guestInfo.picture} alt={user.guest_name} /></span>
                                : <span className="thumbnail" />}
                </span>
                <span className="user">
                  <span className="name">{user.guest_name}</span>
                  <span className={user.guest_class ? `${user.guest_class.toLowerCase()} rating` : 'rating'}>{user.guest_class}</span>
                  <span className="phone">{user.guest_mobile ? Functions.getPhoneStr(user.guest_mobile) : '연락처 없음'}</span>
                </span>
              </div>
              <div className="util">
                <div className="ui">
                  <button className="btn-edit" onClick="">편집하기</button>
                </div>
                <div className="sns">
                  <a href="#" target="_blank"><img src={Images.IMG_mms} alt="MMS" title="MMS" /></a>
                  {user_guestInfo && user_guestInfo.kakao
                                ? <a href={user_guestInfo.kakao} target="_blank"><img src={Images.IMG_kakao} alt="Kakao talk" title="카카오톡" /></a>
                                : ''}
                  {user_guestInfo && user_guestInfo.line
                                ? <a href={user_guestInfo.line} target="_blank"><img src={Images.IMG_line} alt="Line" title="라인" /></a>
                                : ''}
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="tabmenu">
                <button
                  className={this.state.isActiveHistory
                            ? 'active'
                            : ''}
                  onClick={() => this.toggleDetails(true)}
                >
                            시술내역 {!_.isEmpty(user_historyInfo) ? `(${user_historyInfo.length})` : ''}
                </button>
                <button
                  className={!this.state.isActiveHistory
                            ? 'active'
                            : ''}
                  onClick={() => this.toggleDetails(false)}
                >
                            고객메모
                        </button>
              </div>
              {this.state.isActiveHistory
                      ? (
                        <div className="history">
                          <Slider
                            ref={(c) => { this.slider = c; }}
                            initialSlide={this.state.historySlideIndex}
                            arrows={false}
                            draggable={false}
                            infinite={false}
                            accessibility={false}
                            speed={250}
                            dots={false}
                            slidesToShow={1}
                            slidesToScroll={1}
                            afterChange={newIndex => this.slideAfter(newIndex)}
                          >
                            { mapToHistory(user, user_historyInfo) }
                          </Slider>
                          {this.state.isActiveHistoryDetail ? (
                              this.state.isEditStaffMemo ? (
                                <div className="ui history-ui">
                                  <button onClick={this.handleEditStaffMemo} className="cancel">취소</button>
                                  <button onClick={this.handleEditStaffMemo} className="complet right">완료</button>
                                </div>
                                ) : (
                                  <div className="ui history-ui">
                                    <button onClick={this.handleEditStaffMemo} className="remove text-hidden">삭제</button>
                                    <button onClick={this.handleEditStaffMemo} className="edit right">수정</button>
                                  </div>
                                )
                            )
                            : (
                              <div className="indicator">
                                {user_historyInfo.length > lengthOfHistorySlide && (this.state.historySlideIndex + 1) > 1
                                      ? <button className="prev" onClick={this.slidePrev}>이전</button>
                                      : ''
                                  }
                                {user_historyInfo.length > lengthOfHistorySlide
                                      ? <div>
                                        <input
                                          type="text"
                                          ref={(c) => { this.slideValue = c; }}
                                          defaultValue={this.state.historySlideIndex + 1}
                                          maxLength={2}
                                          onChange={this.slideChange}
                                        /> /<span>{Math.ceil(user_historyInfo.length / lengthOfHistorySlide)}</span>
                                      </div>
                                      : <div>
                                        <input
                                          type="text"
                                          defaultValue={1}
                                          disabled
                                        /> /<span>{1}</span>
                                      </div>
                                  }
                                {user_historyInfo.length > lengthOfHistorySlide && (this.state.historySlideIndex + 1) < Math.ceil(user_historyInfo.length / lengthOfHistorySlide)
                                      ? <button className="next" onClick={this.slideNext}>다음</button>
                                      : ''
                                  }
                              </div>
                            )
                          }
                        </div>
                      )
                      : !_.isEmpty(user_guestInfo) ? (
                        <div className={`comments${user_guestInfo.memo ? '' : ' no-comment'}`}>
                          <textarea
                            className="textarea"
                            disabled={!this.state.isEditGuestMemo}
                            onChange={this.changeGuestMemo}
                            value={this.state.guest.memo}
                            placeholder={this.state.guest.memo ? '' : '메모를 입력하세요'}
                          />
                          {this.state.isEditGuestMemo ? (
                            <div className="ui">
                              <button onClick={this.handleEditGuestMemo} className="cancel">취소</button>
                              <button onClick={this.handleEditGuestMemo} className="complet right">완료</button>
                            </div>
                                ) : (
                                  <div className="ui">
                                    <button onClick={this.handleEditGuestMemo} className="remove text-hidden">삭제</button>
                                    <button onClick={this.handleEditGuestMemo} className="edit right">수정</button>
                                  </div>
                                )
                              }
                        </div>
                      ) : (
                        <div className="comments no-comment">
                            고객정보를 가져올 수 없습니다.
                          </div>
                      )
                    }
            </div>
            {user.status == actions.ScheduleStatus.REQUESTED ? (
              <div className="request-approve">
                <button onClick={null}>예약요청 바로승인</button>
              </div>
                  ) : ''
                }
          </div>
        );
    }
}

ReservationCard.defaultProps = {
    users: {
    }
};

export default ReservationCard;
