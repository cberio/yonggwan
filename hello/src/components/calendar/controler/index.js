import React, { Component } from 'react';
import $ from 'jquery';
import '../../../lib/cfTouchSwipe-master/jquery.cfTouchSwipe';

export default class Controler extends Component {
  componentDidMount() {
    let _component = this;
    $('#controler').cfTouchSwipe({
			swipeLeft: function(swipeLength) {
				_component.props.onScroll('next', swipeLength);
			},
			swipeRight: function(swipeLength) {
				_component.props.onScroll('prev', swipeLength);
			}
      //minSwipeLength: 50     // 사용자가 swipe 했다고 판단하는 최소 거리
		});
  }
  render () {
    return (
      <div id="controler" className="controler" style={{display: 'block'}}>
      </div>
    );
  }
}
