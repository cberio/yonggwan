import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import FullCalendar from './fullCalendar/index';
import Staffs from '../../data/experts.json';
import Schedules from '../../data/event.json';
import _ from 'lodash';

class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedViewType : undefined // agendaDay or agendaWeekly
    };
  }

  componentDidMount() {
    const { selectedShopID } = this.props;

    this.props.fetchStaffsIfNeeded(selectedShopID);
    this.props.fetchSchedulesIfNeeded(selectedShopID);
  }

  componentWillReceiveProps(nextProps) {

  }

  setRenderedViewType (e) {
    this.setState({
      renderedViewType: e
    });
  }
  render () {
    //console.info(_.isEmpty(this.props.staffs));
    return (
      <div className="calendar">
        <div className="full-calendar">
          <FullCalendar events={this.props.schedules.data}
                        defaultView={this.props.defaultView}
                        experts={this.props.staffs.data}
                        defaultExpert={_.isEmpty(this.props.staffs) ? Experts[0] : this.props.staffs.data }
                        currentViewType={this.state.renderedViewType}
                        setRenderedViewType={ (e) => this.setRenderedViewType(e)} />
        </div>
      </div>
    );
  }
}

CalendarView.PropTypes = {
  fetchSchedulesIfNeeded: PropTypes.func.isRequired,
  fetchStaffsIfNeeded: PropTypes.func.isRequired,
  staffs: PropTypes.object.isRequired,
  schedules: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  const {
    selectedShopID,
    getStaffsBySelectedShopID,
    getSchedulesBySelectedShopID,
  } = state;

  const {
    staffs,
    isFetching
  } = getStaffsBySelectedShopID[selectedShopID] || {
    isFetching: false,
    staffs: {}
  };

  const {
    schedules,
  } = getSchedulesBySelectedShopID[selectedShopID] || {
    isFetching: false,
    schedules: {}
  };


  return {
    isFetching,
    selectedShopID,
    staffs,
    schedules,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSchedulesIfNeeded: shopID => (dispatch(actions.fetchSchedulesIfNeeded(shopID))),
    fetchStaffsIfNeeded: shopID => (dispatch(actions.fetchStaffsIfNeeded(shopID))),
    // or simply do...
    // actions: bindActionCreators(acations, dispatch)
    // this will dispatch all action
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarView);
