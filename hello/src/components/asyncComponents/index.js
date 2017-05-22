import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardModal from './cardModal';
import Guider from './guider';
import Loading from './loading';
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
                {this.props.isModalNotifier && CardModalComponent}
                {this.props.isGuider && <Guider />}
                {/* this.props.isLoading && <Loading />*/}
            </div>
        );
    }
}

const mapStateToPops = state => ({
    isModalNotifier: state.notifier.isModalNotifier,
    isGuider: state.guider.isGuider,
    isLoading: state.loading.isLoading
});
const mapDispatchToProps = dispatch => ({
    toggleNotifier: condition => dispatch(actions.modalNotifier({ isModalNotifier: condition }))
});

export default connect(mapStateToPops, mapDispatchToProps)(AsyncComponents);
