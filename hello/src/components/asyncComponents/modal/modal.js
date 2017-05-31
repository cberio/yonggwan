import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import * as actions from '../../../actions';
import * as Functions from '../../../js/common';
import '../../../css/modal.css';
/*
// 생성
{moment(schedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
{moment(schedule.end).locale('ko').format('A HH:mm')}
{schedule.guest_name}
{schedule.guest_class.toUpperCase()}
{schedule.class schedule.shop_service_id}

// 변경
{moment(schedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
{moment(schedule.end).locale('ko').format('A HH:mm')}
{schedule.guest_name ? <span className="name">{schedule.guest_name}</span> : <span className="name">이름없음</span>}
{schedule.guest_class ? <span className={`rating ${schedule.guest_class.toUpperCase()}`}>{schedule.guest_class.toUpperCase()}</span> : undefined} 님의
{moment(props.editedDate.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
{moment(props.editedDate.end).locale('ko').format('A HH:mm')}

// 삭제
{moment(schedule.start).locale('ko').format('YYYY년 MM월 DD일(ddd) A HH:mm')} -
{moment(schedule.end).locale('ko').format('A HH:mm')
{schedule.guest_name ? <span className="name">{schedule.guest_name}</span> : <span className="name">고객명 미입력</span>}
{schedule.guest_class ? <span className={`rating ${schedule.guest_class.toUpperCase()}`}>{schedule.guest_class.toUpperCase()}</span> : undefined}님의
{`product ${schedule.class}`}>{schedule.shop_service_id}
*/

class Modal extends Component {

    componentDidMount() {
        const component = this;
        // 접근성 - close
        $(document).bind('keydown', (e) => {
            if (e.which === 27) {
                component.props.cancel();
                $(document).unbind('keydown');
            }
        });
    }

    render() {
        return (
            <div className='modal-mask mask-full'>
                <div className="modal-layer layer-center order-confirm">
                    <div className="confirm-content">
                        {!_.isEmpty(this.props.htmls) && this.props.htmls.map((html, i) => (
                              <span
                                className={!_.isEmpty(html.classes) && html.classes.join(' ')}
                                style={html.style}
                                key={html.text ? html.text : `key_${i}`}
                              >
                                  {html.text}
                              </span>
                            )
                        )}
                    </div>
                    <div className="confirm-ui">
                        {!_.isEmpty(this.props.buttons) && this.props.buttons.map((button, i) => (
                              <button
                                autoFocus={button.autoFocus}
                                className={!_.isEmpty(button.classes) && button.classes.join(' ')}
                                onClick={button.click}
                                key={button.text ? button.text : `key__${i}`}
                              >
                                  {button.text}
                              </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

Modal.propTypes = {
    buttons: PropTypes.array.isRequired,
    htmls: PropTypes.array.isRequired
};

Modal.defaultProps = {
    buttons: [
        {
            text: '',
            classes: [''],
            autoFocus: false,
            click: function() {
                Functions.createWarning('buttons')
            }
        },
    ],
    htmls: [ { text: '???', classes:[''], style: {} } ]
};

const mapStateToProps = state => ({
    ...state.modal
});

export default connect(mapStateToProps)(Modal);
