import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './container/home/index';
import { Login } from './container/login/index';
import { Match, Miss } from 'react-router';
import { BrowserRouter as Router } from 'react-router';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducers from './reducers';

//import ScrollArea from 'react-scrollbar';

import './css/reset.css';
import './css/index.css';


const store = createStore(Reducers);

const NotFound = ({ location }) => (
  <div>
    <h3>페이지를 찾을수 없습니다.</h3><br />
    <p><code>{location.pathname}</code> 은 유효한 경로가 아닙니다.</p>
  </div>
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Match pattern="/" component={Home} />
        <Match pattern="/login" component={Login} />
        <Miss component={NotFound} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
