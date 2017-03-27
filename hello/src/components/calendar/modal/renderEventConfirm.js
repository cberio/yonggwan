import React from 'react';
import $ from 'jquery';

export default class RenderEventConfirm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const _component = this;

    // 상단 날짜이동 컨트롤러 비활성화
    $('.fc-header-toolbar button').prop('disabled', true);
    $('.fc-toolbar.fc-header-toolbar .fc-center h2').addClass('disabled');

    // Fake 이벤트 레이어를 렌더링했을경우
    if ($('#ID_' + this.props.newEventId + '_FAKE').length > 0) {
      $('.render-confirm-inner').appendTo($('#ID_' + this.props.newEventId + '_FAKE'));
    // Fake 이벤트 레이어를 렌더링하지 않은경우
    } else {
      $('.render-confirm-inner').appendTo($('#ID_' + this.props.newEventId));
    }

    // 'a tag' auto focusing 관련해서 자동으로 타임라인 스크롤 되는것을 방지한다
    var timeline,
        scrollX,
        scrollY;
    if (this.props.viewType === 'agendaWeekly') {
      timeline = $('.fc-scroller.fc-time-grid-container');
    } else {
      timeline = $('.fc-view-container');
    }
    scrollX = $(timeline).scrollLeft();
    scrollY = $(timeline).scrollTop();
    this.refs.input.focus();
    $(timeline).scrollLeft(scrollX);
    $(timeline).scrollTop(scrollY);

    $('.render-confirm-inner button').on('click', function(e) {
      if (e.target.className === 'complete') {
        _component.props.modalConfirm(true, _component.props.newEventId);
      } else {
        _component.props.modalConfirm(false, _component.props.newEventId);
      }
    });
    // 'a tag autofocusing prevent   /// E'

    // ESC key 입력시 닫기
    $(document).bind('keydown', function(e) {
      if (e.which === 27 && !_component.props.isModalConfirm) {
        console.log('happend RenderEventConfirm');
        _component.props.modalConfirm(false, _component.props.newEventId);
        $(document).unbind('keydown');
      }
    });
  }
  componentWillUnmount() {
    $('.render-confirm-inner').remove();
    // 상단 날짜이동 컨트롤러 활성화
    $('.fc-header-toolbar button').prop('disabled', false);
    $('.fc-toolbar.fc-header-toolbar .fc-center h2').removeClass('disabled');
  }

  render () {
    return (
      <div>
        <div className='render-confirm-inner'>
          <button className="complete" ref="input">확인</button>
          <button className="cancel">취소</button>
        </div>
      </div>
    )
  }
};
