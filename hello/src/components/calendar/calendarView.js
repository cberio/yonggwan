import React, { Component } from 'react';
import FullCalendar from './fullCalendar/index';
import Experts from '../../data/experts.json';
import Events from '../../data/event.json';

export default class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedViewType : undefined // agendaDay or agendaWeekly
    };
  }
  setRenderedViewType (e) {
    this.setState({
      renderedViewType: e
    });
  }
  render () {
    return (
      <div className="calendar">
        <div className="full-calendar">
          <FullCalendar events={Events}
                        defaultView={this.props.defaultView}
                        defaultExpert={Experts[0]}
                        currentViewType={this.state.renderedViewType}
                        setRenderedViewType={ (e) => this.setRenderedViewType(e)} />
        </div>
      </div>
    );
  }
}
