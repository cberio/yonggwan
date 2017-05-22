import React from 'react';
import { connect } from 'react-redux';
import Card from '../../notifier/card';
import * as actions from '../../../actions';
import '../../../css/notifier.css';

class CardModal extends React.Component {
    constructor(props, container) {
        super(props);
        this.container = container;
    }

    componentDidMount() {
        this.button.focus();
    }

    getTitleText(cardType) {
        switch (cardType) {
            case '취소' : return '예약취소';
            case '요청' : return '예약요청';
            case '변경' : return '예약변경';
            case '신규' : return '신규예약';
            default : return '알림';
        }
    }

    render() {
        return (
            <div className="notifier-modal-wrap">
                <div className="notifier bounceInRight">
                    <div className="head-by-menu">
                        <p>{this.getTitleText(this.props.cardType)}</p>
                        <button ref={(c) => { this.button = c; }} onClick={() => this.props.toggleNotifier(false)}>닫기</button>
                    </div>
                    <Card cardType={this.props.cardType} schedule={this.props.schedule} />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    toggleNotifier: condition => dispatch(actions.modalNotifier({ isModalNotifier: condition }))
});

export default connect(null, mapDispatchToProps)(CardModal);
