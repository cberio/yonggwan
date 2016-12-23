import React, { Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.min.css';
import '../../../css/date-picker-customizing.css';

export default class DatePicker extends Component {
  render () {
    let date = new Date();
    let today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    let maxDay = (date.getFullYear() + 1 ) + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    return (
      <InfiniteCalendar
        locale={{ name: 'ko' }}
        className="date-picker"
        keyboardSupport={true}
        selectedDate={today}
        min={today}
        minDate={today}
        max={maxDay}
        onSelect={ (date) => this.props.onClick(date) }
        theme={{
            selectionColor: 'rgb(146, 118, 255)',
            textColor: {
               default: '#333',
               active: '#FFF'
            },
            weekdayColor: 'rgb(146, 118, 255)',
            headerColor: 'rgb(127, 95, 251)',
            floatingNav: {
               background: 'rgba(81, 67, 138, 0.96)',
               color: '#FFF',
               chevron: '#FFA726'
            }
         }}
      />
    );
  }
}
