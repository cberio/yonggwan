import React from 'react';
import ReactDOM from 'react-dom';
import Home from './container/home/index';
import { Login } from './container/login/index';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import AsyncComponents from './components/asyncComponents';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import Reducers from './reducers';
import thunk from 'redux-thunk';
import * as Functions from './js/common';

import './css/reset.css';
import './css/index.css';

const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  Reducers,
  composeEnhancers(applyMiddleware(...middleware))
);

const NotFound = ({ location }) => (
  <div>
    <h3>페이지를 찾을수 없습니다.</h3><br />
    <p><code>{location.pathname}</code> 은 유효한 경로가 아닙니다.</p>
  </div>
);

if (Functions.getVersionIE() < 10)
    alert('Internet Explorer version 10 미만의 브라우저는 지원하지 않습니다');

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div style={{ height: '100%' }}>
        <div id="wrapper-outer">
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          {/* <Route component={NotFound} />*/}
        </div>
        <AsyncComponents />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
