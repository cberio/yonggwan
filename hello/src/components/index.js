import React from 'react';
import { Route } from 'react-router';
import { DailyContainer, WeeklyContainer } from './calendar/container';

const emptyComponent = ({param}) => {
  return (
    <div>
      빈 컨텐츠
    </div>
  )
}

class Container extends React.Component {
  render () {
    return (
      <div id="container">
        <Route path="/reservation/daily" component={DailyContainer} />
        <Route path="/reservation/weekly" component={WeeklyContainer} />
        <Route component={emptyComponent} />
      </div>
    );
  }
}

export { Container }
