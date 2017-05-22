import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

let setGuiderStart;

class Guider extends React.Component {
    componentDidMount() {
        const _component = this;
    // left position for guider-wrap
        const offsetLeft = `${($('#header').length && $('#header').outerWidth() * 1) +
                     ($('.notifier-wrap').length && $('.notifier-wrap').outerWidth() * 1)}px`;
        $('.guider-wrap').css('padding-left', offsetLeft);
    // auto focusing
        this.button.focus();
    // 컴포넌트 렌더링 한 뒤 5초후에 자동 사라짐
        $(document).ready(() => {
            setGuiderStart = setTimeout(() => {
                $('.guider-wrap').removeClass('slideInUp').addClass('slideOutDown');
                setTimeout(() => {
                    $(_component.button).click();
                }, 600);
            }, 3000);
        });
    }
    componentWillUnmount() {
        clearInterval(setGuiderStart);
    }
    render() {
        return (
            <div className="guider-wrap slideInUp">
                <p className="message">{this.props.message}</p>
                <button ref={(c) => { this.button = c; }} className="close" onClick={() => this.props.toggleGuider(false)}>닫기</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    message: state.guider.message
});
const mapDispatchToProps = dispatch => ({
    toggleGuider: condition => dispatch(actions.guider({ isGuider: condition }))
});

export default connect(mapStateToProps, mapDispatchToProps)(Guider);
