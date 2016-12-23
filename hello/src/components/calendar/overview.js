import React, { Component } from 'react';
import CalendarView from './calendarView';

export class Overview extends Component {
  render () {
    return (
      <CalendarView defaultView="agendaWeekly" />
    );
  }
}
