import React, { Component } from 'react';
import $ from 'jquery';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.min.css';
import '../../../css/date-picker-customizing.css';

export default class DatePicker extends Component {
  componentWillUnmount () {
    $(document).unbind('click');
  }
  componentDidMount () {
    const _this = this;
    // ESC key 입력시 닫기
    $(document).on('keydown', function(e){
      if (e.which === 27) {
        _this.props.onClose();
        $(document).unbind('kewdown');
      }
    });
    // 빈 영역 클릭시 닫기
    $(document).bind('click', function(e) {
      if ($(e.target).parents('.date-picker').length < 1) {
        e.stopPropagation();
        _this.props.onClose();
      }
    });
    $('.Cal__Container__wrapper').append('<div class="Cal__Container__Shadow__Bottom"></div>');
  }
  render () {
    let date = new Date();
    return (
      <div className="">
        <InfiniteCalendar
          showHeader={false}
          showOverlay={false}
          selectedDate={this.props.selectedDate || date}
          locale={{ name: 'ko' }}
          autoFocus={true}
          width={360}
          height={this.props.height}
          rowHeight={50}
          className={`date-picker ${this.props.className}`}
          keyboardSupport={true}
          onSelect={ (date) => this.props.onChange(date) }
          onScroll={function(scrollTop) {
          }}
          theme={{
              selectionColor: '#e60b25',
              textColor: {
                 default: '#000',
                 active: '#ffffff'
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
