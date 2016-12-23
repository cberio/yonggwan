import React, { Component } from 'react';
import { Match } from 'react-router';
import { Daily } from './calendar/daily';
import { Overview } from './calendar/overview';
import { ReservationCard } from './reservationCard/index';

class Container extends Component {
  render () {
    return (
      <div id="container">
        <Match pattern="/reservation/daily" component={Daily} />
        <Match pattern="/reservation/overview" component={Overview} />
      </div>
    );
  }
}

export { Container }
