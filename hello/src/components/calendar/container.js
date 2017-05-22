import React, { Component } from 'react';
import Calendar from './calendar';

class DailyContainer extends Component {
    render() {
        return (
            <Calendar defaultView="agendaDay" />
        );
    }
}

class WeeklyContainer extends Component {
    render() {
        return (
            <Calendar defaultView="agendaWeekly" />
        );
    }
}

export { DailyContainer, WeeklyContainer };
