import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import InfiniteCalendar, { withRange, Calendar } from 'react-infinite-calendar';
import 'jquery.nicescroll';
import 'react-infinite-calendar/styles.css';
import '../../../css/date-picker-customizing.css';

export default class DatePicker extends Component {
    componentWillUnmount() {
        $(document).unbind('click');
    }
    componentDidMount() {
        const _this = this;
    // ESC key 입력시 닫기
        $(document).on('keydown', (e) => {
            if (e.which === 27) {
                _this.props.onClose();
                $(document).unbind('kewdown');
            }
        });
    // 빈 영역 클릭시 닫기
        $(document).bind('click', (e) => {
            if ($(e.target).parents('.date-picker').length < 1) {
                e.stopPropagation();
                _this.props.onClose();
            }
        });
    // insert element for shadow
        $('.Cal__Container__wrapper').append('<div class="Cal__Container__Shadow__Bottom"></div>');
    // scroller init.
    // $('.Cal__MonthList__root').niceScroll({
    //     background: 'transparent',
    //     railpadding: {
    //         right: 1, left: 1, top: 1, bottom: 1
    //     },
    //     cursorcolor: '#545454',
    //     cursorborder: false,
    //     cursorwidth: '4px',
    //     autohidemode: false,
    //     touchbehavior: true,
    //     cursordragontouch: true,
    //     //mousescrollstep: 200,
    //     enablekeyboard: false
    // });
    }
    render() {
        const today = new Date();
        return (
            <div>
                <InfiniteCalendar
          // Component={withRange(Calendar)}
                    showHeader={false}
                    selected={this.props.selectedDate || today}
                    locale={{
                        locale: require('date-fns/locale/ko'),
            // headerFormat: 'dddd, D MMM',
                        weekdays: ['일', '월', '화', '수', '목', '금', '토']
                    }}
                    autoFocus
                    width={420}
                    height={480}
                    rowHeight={68}
                    className={`date-picker ${this.props.className}`}
                    keyboardSupport
                    onSelect={date => this.props.onChange(moment(date))}
                    displayOptions={{
                        showOverlay: false
                    }}
                    theme={{
                        selectionColor: '#fb3e50',
                        textColor: {
                            default: '#999',
                            active: '#fff'
                        },
                        weekdayColor: '#1a1a1a',
                        headerColor: 'pink',
                        floatingNav: {
                            background: '#000',
                            color: '#e60b25',
                            chevron: '#e60b25'
                        }
                    }}
                />
            </div>
        );
    }
}
