import React from 'react';
import PropTypes from 'prop-types';
import * as Functions from '../../../js/common';

export const TodayTimelineButton = ({ isToday, dateText, handleClick }) => (
    <div className={`fc-today-timeline-button-wrap ${isToday ? 'today' : ''}`}>
        <button
            className={`fc-today-timeline-button ${isToday ? 'today' : ''}`}
            disabled={isToday}
            onClick={handleClick}
        >
            { dateText }
        </button>
    </div>
);

TodayTimelineButton.defaultProps = {
    isToday: false,
    dateText: 31,
    handleClick: () => Functions.createWarning('handleClick'),
};
TodayTimelineButton.propTypes = {
    isToday: PropTypes.bool,
    dateText: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    handleClick: PropTypes.func,
};
