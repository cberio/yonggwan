import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import FullCalendar from './fullCalendar/index';
import Experts from '../../data/experts.json';
import Events from '../../data/event.json';
import _ from 'lodash';

class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedViewType : undefined // agendaDay or agendaWeekly
    };
  }

  componentDidMount() {
    const { selectedShop } = this.props;

    this.props.fetchSchedulesIfNeeded(selectedShop);
    this.props.fetchStaffsIfNeeded(selectedShop);
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
    selectedShop, 
    getSchedulesBySelectedShopID,
    getStaffsBySelectedShopID
  } = state;

  const { 
    schedules,
  } = getSchedulesBySelectedShopID[selectedShop] || { 
    isFetching: false, 
    schedules: {}
  };

  const { 
    staffs,
    isFetching
  } = getStaffsBySelectedShopID[selectedShop] || {
    isFetching: false,
    staffs: {}
  }

  return {
    isFetching,
    selectedShop,
    schedules,
    staffs,
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