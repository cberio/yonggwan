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

import './css/reset.css';
import './css/index.css';

const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  Reducers,
  composeEnhancers(applyMiddleware(...middleware))
);
/*store.subscribe(() => console.log('ㅡㅡㅡㅡㅡ store was updated ㅡㅡㅡㅡㅡ'));
store.subscribe(() => console.log(store.getState()));
store.subscribe(() => console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ'));*/

const NotFound = ({ location }) => (
  <div>
    <h3>페이지를 찾을수 없습니다.</h3><br />
    <p><code>{location.pathname}</code> 은 유효한 경로가 아닙니다.</p>
  </div>
)

function get_version_of_IE () {
	 var word;
	 var version = "N/A";
	 var agent = navigator.userAgent.toLowerCase();
	 var name = navigator.appName;

	 // IE old version ( IE 10 or Lower )
	 if ( name == "Microsoft Internet Explorer" ) {
     word = "msie ";
   }
   // IE 11
	 else {
		 if ( agent.search("trident") > -1 )
        word = "trident/.*rv:";
		 // Microsoft Edge
		 else if ( agent.search("edge/") > -1 )
        word = "edge/";
	 }

	 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );
	 if (  reg.exec( agent ) != null  )
      version = RegExp.$1 + RegExp.$2;
   if (version < 10)
      alert('Internet Explorer version 10 미만의 브라우저는 지원하지 않습니다');
	 //return version;
}
get_version_of_IE();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div style={{height: '100%'}}>
        <div id="wrapper-outer">
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          {/*<Route component={NotFound} />*/}
        </div>
        <AsyncComponents />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
