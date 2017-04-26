import React from 'react';
import { Route } from 'react-router';
import { DailyContainer, WeeklyContainer } from './calendar/container';

class Container extends React.Component {
  render () {
    return (
      <div id="container">
        <Route path="/reservation/daily" component={DailyContainer} />
        <Route path="/reservation/weekly" component={WeeklyContainer} />
      </div>
    );
  }
}

export { Container }
