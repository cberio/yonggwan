import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';

// 공통 사용되는 버튼
const Ui = props => (
    <div className="confirm-ui">
        <button onClick={props.handleClickConfirm}>확인</button>
        <button onClick={props.handleClickCancel}>취소</button>
    </div>
);

// 1.신규예약 생성시 모달 컨텐츠
const CreateSchedule = (props) => {
    const { schedule } = props;
    return (
        <div className="modal-layer layer-center order-confirm">
            <div className="confirm-content">
                <p>
                  <span className="date">
                      {moment(schedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
                      {moment(schedule.end).locale('ko').format('A HH:mm')}
                  </span>
                </p>
                <p>
                  {schedule.guest_name ? <span className="name">{schedule.guest_name}</span> : <span className="name">고객명 미입력</span>}
                  {schedule.guest_class ? <span className={`rating ${schedule.guest_class}`}>{schedule.guest_class}</span> : undefined} 님의
                </p>
                <p>
                  <span className={`product ${schedule.class}`}>{schedule.shop_service_id}</span>
                  예약을 생성하시겠습니까?
                </p>
            </div>
            <Ui handleClickConfirm={props.confirm} handleClickCancel={props.cancel} />
        </div>
    );
};

// 2.예약변경시 모달 컨텐츠
const EditSchedule = (props) => {
    const { schedule } = props;
    return (
        <div className="modal-layer layer-center order-confirm">
            <div className="confirm-content">
                <p>
                    <span className="date">
                      {moment(schedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
                      {moment(schedule.end).locale('ko').format('A HH:mm')}
                    </span>
                </p>
                <p>
                  {schedule.guest_name ? <span className="name">{schedule.guest_name}</span> : <span className="name">이름없음</span>}
                  {schedule.guest_class ? <span className={`rating ${schedule.guest_class}`}>{schedule.guest_class}</span> : undefined} 님의
                </p>
                <p><span className={`product ${schedule.class}`}>{schedule.shop_service_id}</span> 예약을</p>
                <p className="change-date">
                    {props.editedDate ? (
                        <span className="date">
                            {moment(props.editedDate.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
                            {moment(props.editedDate.end).locale('ko').format('A HH:mm')}
                        </span>
                      ) : ''
                    }
                </p>
                <p>으로 변경하시겠습니까?</p>
            </div>
            <Ui handleClickConfirm={props.confirm} handleClickCancel={props.cancel} />
        </div>
    );
};

// 3.예약삭제시 모달 컨텐츠
const RemoveSchedule = (props) => {
    const { schedule } = props;
    return (
        <div className={props.className}>
            <div className="modal-layer layer-center order-confirm">
                <div className="confirm-content">
                    <p>
                        <span className="date">
                          {moment(schedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
                          {moment(schedule.end).locale('ko').format('A HH:mm')}</span>
                    </p>
                    <p>
                        {schedule.guest_name ? <span className="name">{schedule.guest_name}</span> : <span className="name">고객명 미입력</span>}
                        {schedule.guest_class ? <span className={`rating ${schedule.guest_class}`}>{schedule.guest_class}</span> : undefined}
                        님의
                    </p>
                    <p><span className={`product ${schedule.class}`}>{schedule.shop_service_id}</span> 예약을 삭제하시겠습니까?</p>
                </div>
                <Ui handleClickConfirm={props.confirm} handleClickCancel={props.cancel} />
            </div>
        </div>
    );
};

class Modal extends Component {
    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        const component = this;
        // 접근성 - focusing
        $('.confirm-ui button:first').focus();

        // 접근성 - close
        $(document).bind('keydown', (e) => {
            if (e.which === 27) {
                component.props.options.cancel();
                $(document).unbind('keydown');
            }
        });
    }

    confirm() {
        this.props.options.confirm();
    }

    cancel() {
        this.props.options.cancel();
    }


    render() {
        const { type, schedule } = this.props.options;
        const commonProps = {
            className: 'modal-mask mask-full',
            confirm: this.confirm,
            cancel: this.cancel
        };
        switch (type) {
            case 'removeSchedule' :
                return <RemoveSchedule {...commonProps} schedule={schedule} />;
            case 'editSchedule' :
                return <EditSchedule {...commonProps} schedule={schedule} />;
            case 'createSchedule' :
                return <CreateSchedule {...commonProps} schedule={schedule} />;
            default :
                return (
                    <div className="modal-mask mask-full">
                        <div className="modal-layer layer-center order-confirm">
                            <div className="confirm-content">
                                <p>@@ error!! 빼애애액!</p>
                                <Ui cancel={this.cancel} confirm={this.confirm} />
                            </div>
                        </div>
                    </div>
                );
        }
    }
}

Modal.propTypes = {
    condition: PropTypes.bool.isRequired,
    options: PropTypes.shape({
        type: PropTypes.string.isRequired,
        confirm: PropTypes.func.isRequired,
        cancel: PropTypes.func,
        schedule: PropTypes.object
    })
};

Modal.defaultProps = {
    condition: false,
    options: {
        type: '',
        confirm: () => Functions.createWarning('confirm'),
        cancel: () => Functions.createWarning('cancel'),
        schedule: {}
    }
};

const mapStateToProps = state => ({
    options: {
        type: state.modal.options.type,
        confirm: state.modal.options.confirm,
        cancel: state.modal.options.cancel,
        schedule: state.modal.options.schedule,
    }
});

const mapDispatchToProps = dispatch => ({
    unMount: () => dispatch(actions.modal(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
