import React, { Component } from 'react';
import CalendarView from './calendarView';

export class Daily extends Component {
  render () {
    return (
      <CalendarView defaultView="agendaDay" />
    );
  }
}
