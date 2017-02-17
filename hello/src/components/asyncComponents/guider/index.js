import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

var setGuiderStart;

class Guider extends React.Component {
  componentDidMount() {
    let _component = this;
    // left position for guider-wrap
    let offsetLeft = ( $('#header').length && $('#header').outerWidth()*1 ) +
                     ( $('.notifier-wrap').length && $('.notifier-wrap').outerWidth()*1 ) + 'px';
    $('.guider-wrap').css('padding-left', offsetLeft);
    // auto focusing
    this.refs.button.focus();
    // 컴포넌트 렌더링 한 뒤 5초후에 자동 사라짐
    $(document).ready(function(){
      setGuiderStart = setTimeout(function(){
        $('.guider-wrap').removeClass('slideInUp').addClass('slideOutDown');
        setTimeout(function(){
          $(_component.refs.button).click();
        },600);
      },3000);
    });
  }
  componentWillUnmount() {
    clearInterval(setGuiderStart);
  }
  render () {
    return (
      <div className="guider-wrap slideInUp">
        <p className="message">{this.props.message}</p>
        <button ref="button" className="close" onClick={ () => this.props.toggleGuider(false) }>닫기</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    message: state.guider.message
  }
}
const mapDispatchToProps = (dispatch) => {
   return {
     toggleGuider: (condition) => dispatch(actions.guider({ isGuider: condition }))
   }
}

export default connect (mapStateToProps, mapDispatchToProps)(Guider);
