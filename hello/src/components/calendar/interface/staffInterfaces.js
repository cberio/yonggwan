import React from 'react';
import PropTypes from 'prop-types';
import * as Functions from '../../../js/common';

export const StaffsInterfaceDaily = ({ staffs, isRenderConfirm, renderStaff }) => {

    const StaffsInputAll = (
      <div className="expert-each checkbox all">
        <input
          disabled={isRenderConfirm}
          className="expert-input"
          type="checkbox"
          name="expert"
          id="expert_all"
          value="all"
          onChange={input => renderStaff('all', input.target)}
        />
        <label className="expert-label" htmlFor="expert_all">
          <span>ALL</span>
        </label>
      </div>
    );

    const StaffsInputEach = staffs.map((staff, i) => (
      <div
        className="expert-each checkbox"
        data-id={`expert_${staff.id}`}
        data-active="false"
        data-priority={staff.priority}
        key={i}
      >
        <input
          disabled={isRenderConfirm}
          className="expert-input"
          type="checkbox"
          name="expert" id={`expert_${staff.id}`}
          value={staff.id}
          onChange={input => this.renderStaff(staff, input.target)}
        />
        <label
          className="expert-label"
          htmlFor={`expert_${staff.id}`}
        >
          <span>{staff.nickname || staff.staff_name}</span>
          <i className="today-count">{9}</i>
        </label>
      </div>
    ))

    return (
      <div className="expert-wrap">
        <div className="expert-ui expert-daily">
          <div className="expert-inner">
            {staffs && staffs.length >= 2 && StaffsInputAll}
            <div className="expert-each-wrap">
              {StaffsInputEach}
            </div>
          </div>
        </div>
      </div>
    )
};

StaffsInterfaceDaily.defaultProps = {
};
StaffsInterfaceDaily.propTypes = {
};
