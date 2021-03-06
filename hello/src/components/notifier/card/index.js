import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import * as Functions from '../../../js/common';
import * as actions from '../../../actions';
import { connect } from 'react-redux';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.requestReservation = this.requestReservation.bind(this);
    }

    requestReservation(schedule) {
    // 현재 페이지가 예약 페이지가 아닌경우 예약페이지로 이동에 대한 방안이 필요함
        if (location.pathname.indexOf('reservation') < 0) location.pathname = '/reservation/weekly'; // 임시
    // 예약 페이지로 전환 후, 렌더링시 바로 예약요청카드가 보여지도록 세팅함
        this.props.showRequestReservation(schedule);
    }

    render() {
        const { id,
            staff_id,
            guest_class,
            shop_service_id,
            guest_name,
            guest_mobile,
            start,
            end,
            picture,
            guest_memo,
            staff_memo,
            kakao,
            line
          } = this.props.schedule;
        const content = (
            <div className="card-content">
                <div className="service clearfix">
                    <div className="lt">
                        <span className={`product ${Functions.getService(shop_service_id, this.props.services).color}`}>{Functions.getService(shop_service_id, this.props.services).name}</span>
                        {this.props.cardType === '변경' ? <span className="time last">00.00(목)00:00~00:00</span> : null}
                        <span className="time">
                            <span>{`${moment(start).locale('ko').format('MM.DD(ddd)hh:mm')}~${moment(end).format('hh:mm')}`}</span>
                            <span className="expert">{Functions.getStaff(staff_id, this.props.staffs).staff_name}</span>
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
                            {guest_class && <i className={`rating-bullet ${guest_class.toUpperCase()}`}>{guest_class.toUpperCase()}</i>}
                        </div>
                        <span className="name">{name}</span>
                        {guest_class && <span className={`rating ${guest_class.toUpperCase()}`}>{guest_class.toUpperCase()}</span>}
                    </div>
                    <p className="comment">
                        {guest_memo}
                    </p>
                </div>
            </div>
        );

        return (
            this.props.cardType === '요청' ? (
                <button onClick={() => this.requestReservation(this.props.schedule)} className="link">{content}</button>
            ) : content
        );
    }
}

const mapDispatchToProps = dispatch => ({
    showRequestReservation: schedule => dispatch(actions.requestReservation({
        condition: true,
        requestEvent: schedule
    }))
});

export default connect(null, mapDispatchToProps)(Card);
