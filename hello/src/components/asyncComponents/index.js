import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardModal from './cardModal';
import Advise from './advise';
import Loading from './loading';
import Modal from './modal/modal';
import * as actions from '../../actions';

const scheduleTemporary = require('../../data/schedules').default[1];

class AsyncComponents extends Component {
    render() {
        const CardModalComponent = (
            <CardModal
                cardType=""
                schedule={scheduleTemporary}
            />
        );

        return (
            <div>
                {this.props.isModal && <Modal />}
                {this.props.isModalNotifier && CardModalComponent}
                {this.props.isLoading && <Loading />}
                <Advise />
            </div>
        );
    }
}

const mapStateToPops = state => ({
    isModalNotifier: state.notifier.isModalNotifier,
    isLoading: state.loading.isLoading,
    isModal: state.modal.condition
});
const mapDispatchToProps = dispatch => ({
    toggleNotifier: condition => dispatch(actions.modalNotifier({ isModalNotifier: condition }))
});

export default connect(mapStateToPops, mapDispatchToProps)(AsyncComponents);
