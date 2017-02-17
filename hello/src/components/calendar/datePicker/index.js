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
    let today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //let max = (date.getFullYear() + 1 ) + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    let selectedDate = today;
    return (
      <div className="mask-transparent">
        <InfiniteCalendar
          showHeader={false}
          showOverlay={false}
          selectedDate={selectedDate}
          locale={{ name: 'ko' }}
          autoFocus={true}
          width={332}
          rowHeight={43}
          className="date-picker"
          keyboardSupport={true}
          onSelect={ (date) => this.props.onClick(date) }
          onScroll={function(scrollTop) {
            /*$('.ReactVirtualized__Grid.ReactVirtualized__List.Cal__List__root').css({'opacity': 0});
            clearTimeout(animating);
            let animating = setTimeout(function (){
              $('.ReactVirtualized__Grid.ReactVirtualized__List.Cal__List__root')
              .stop()
              .animate({'opacity':1}, 400);
            })*/
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
