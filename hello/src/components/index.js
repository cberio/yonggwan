import React, { Component } from 'react';
import { Match } from 'react-router';
import { DailyContainer, WeeklyContainer } from './calendar/container';

class Container extends Component {
  render () {
    return (
      <div id="container">
        <Match pattern="/reservation/daily" component={DailyContainer} />
        <Match pattern="/reservation/weekly" component={WeeklyContainer} />
      </div>
    );
  }
}

export { Container }
