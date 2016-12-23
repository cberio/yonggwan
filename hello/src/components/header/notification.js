import React, { Component } from 'react';
import Noti from './noti';

export default class Notification extends Component {
  constructor (props) {
    super(props);
    this.state = {
      noti : [
        {
          id : 0,
          type: '타입1',
          new : 1
        },
        {
          id : 1,
          type: '타입2',
          new : 20
        },
      ]
    };
  }

  render () {
    return (
      <div className="header-util">
        <ul>
          { this.state.noti.map((content, i) => {
            return (
              <Noti new={content.new}
                    type={content.type}
                    key={content.id} />
            )
          })
        }
        </ul>
      </div>
    );
  }
}
