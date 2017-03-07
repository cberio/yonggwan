import React, { Component } from 'react';
import $ from 'jquery';
import InfiniteCalendar from 'react-infinite-calendar';
// import '../../../lib/jquery-custom-scrollbar-master/jquery.custom-scrollbar';
// import '../../../lib/jquery-custom-scrollbar-master/jquery.custom-scrollbar.css';
// import '../../../css/jquery.custom-scrollbar-customizing.css';
import 'react-infinite-calendar/styles.min.css';
import '../../../css/date-picker-customizing.css';

export default class DatePicker extends Component {
  componentDidMount () {
    const _this = this;
    // ESC key 입력시 닫기
    $(document).on('keydown', function(e){
        if (e.which === 27) {
          _this.props.onClose();
        }
    });
    // 빈 영역 클릭시 닫기
    $('.mask-transparent').bind('click', function (e){
      if (e.target.className === 'mask-transparent') {
        _this.props.onClose();
        $('.mask-transparent').unbind();
      }
    });
    //$('.ReactVirtualized__Grid').customScrollbar();
  }
  render () {
    let date = new Date();
    return (
      <div className="mask-transparent">
        <InfiniteCalendar
          showHeader={false}
          showOverlay={false}
          selectedDate={date}
          locale={{ name: 'ko' }}
          autoFocus={true}
          width={332}
          rowHeight={43}
          className="date-picker"
          keyboardSupport={true}
          onSelect={ (date) => this.props.onClick(date) }
          onScroll={function(scrollTop) {
          }}
          theme={{
              selectionColor: '#e60b25',
              textColor: {
                 default: '#000',
                 active: '#ffffff'
              },
              weekdayColor: '#4d4d4d',
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
