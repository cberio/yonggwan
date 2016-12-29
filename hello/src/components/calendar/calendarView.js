import React, { Component } from 'react';
import FullCalendar from './fullCalendar/index';
import Events from '../../data/event.json';

export default class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedViewType : undefined, // agendaDay or agendaWeekly
      partner : [
        {
        name : '홍길동'
        },
        {
          name : '박철수'
        }
      ]
    };
  }
  setRenderedViewType (e) {
    this.setState({
      renderedViewType: e
    });
  }
  render () {
    const mapToEachUi = (data) => {
      return data.map((data, i) => {
        return(
          <div className="each" key={i}>
            <input type="checkbox" name="partners" id={`p${i}`} onChange={ () => this.currentVisibleCalendarChange(data)} />
            <label htmlFor={`p${i}`}>{data.name}</label>
          </div>
        )
      })
    }
    const EachUi = (
      <div className="each-ui">
        <div className="each all">
          <input type="checkbox" name="partners" id="p-all" onChange={ () => this.currentVisibleCalendarChange('all')}/>
          <label htmlFor="p-all">ALL</label>
        </div>
        { mapToEachUi(this.state.partner) }
      </div>
    );
    return (
      <div className="calendar">
        { this.state.renderedViewType === 'agendaDay' ? EachUi : undefined }
        <div className="full-calendar">
          <FullCalendar events={Events}
                        defaultView={this.props.defaultView}
                        currentViewType={this.state.renderedViewType}
                        setRenderedViewType={ (e) => this.setRenderedViewType(e)} />
        </div>
      </div>
    );
  }
}
