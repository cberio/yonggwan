import React, { Component } from 'react';
import Header from '../../components/header/index';
import { Container } from '../../components/index';
import Notifier from '../../components/notifier';
import * as actions from '../../actions';
import { connect } from 'react-redux';

class Home extends Component {
    render() {
        return (
            <div id="wrapper">
                {this.props.isNotifier && <Notifier toggleNotifier={this.props.toggleNotifier} />}
                <Header />
                <Container />
            </div>
        );
    }
}
const mapStateToPops = state => ({
    isNotifier: state.notifier.isNotifier
});
const mapDispatchToProps = dispatch => ({
    toggleNotifier: condition => dispatch(actions.notifier({ isNotifier: condition }))
});

export default connect(mapStateToPops, mapDispatchToProps)(Home);
