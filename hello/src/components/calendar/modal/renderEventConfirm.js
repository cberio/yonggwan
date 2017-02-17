import React from 'react';
import $ from 'jquery';

export default class RenderEventConfirm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const _component = this;
    // Fake 이벤트 레이어를 렌더링했을경우
    if ($('#ID_' + this.props.newEventId + '_FAKE').length > 0) {
      $('.render-confirm-inner').appendTo($('#ID_' + this.props.newEventId + '_FAKE'));
    // Fake 이벤트 레이어를 렌더링하지 않은경우
    } else {
      $('.render-confirm-inner').appendTo($('#ID_' + this.props.newEventId));
    }
    this.refs.input.focus();
    $('.render-confirm-inner button').on('click', function(e) {
      if (e.target.className === 'complete') {
        _component.props.modalConfirm(true, _component.props.newEventId);
      } else {
        _component.props.modalConfirm(false, _component.props.newEventId);
      }
    });

    // ESC key 입력시 닫기
    $(document).bind('keydown', function(e) {
      if (e.which === 27 && !_component.props.isModalConfirm) {
        console.log('happend RenderEventConfirm');
        _component.props.modalConfirm(false, _component.props.newEventId);
        // $(document).unbind('keydown');
      }
    });
  }
  componentWillUnmount() {
    $('.render-confirm-inner').remove();
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
