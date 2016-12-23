import React, { Component } from 'react';
import { Header } from '../../components/header/index';
import { Container } from '../../components/index';

class Home extends Component {
  render () {
    return (
      <div>
        <Header />
        <Container />
      </div>
    );
  }
}

export { Home };
