import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import _ from 'lodash';
import * as Functions from '../../../js/common';

const StaffsInputEach = createReactClass({
    render() {
        const { staff, isRenderConfirm, handleChange } = this.props;
        return (
          <div className="expert-each">
              <input
                  disabled={isRenderConfirm}
                  className="expert-input"
                  type="radio"
                  name="expert_w"
                  id={`expert_w_${staff.id}`}
                  value={staff.id}
                  onChange={input => handleChange(staff, input)}
              />
              <label className="expert-label" htmlFor={`expert_w_${staff.id}`}>
                  <span>{staff.nickname || staff.staff_name}</span>
                  <i className="today-count">7</i>
              </label>
          </div>
        );
    }
});

class StaffsInterfaceWeekly extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { staffs, isRenderConfirm, handleChange } = this.props;
        return (
            <div className="expert-wrap">
                <div className="expert-ui expert-weekly">
                    <div className="expert-inner">
                        { /* INPUT ELEMENTS EACH STAFF */
                          !_.isEmpty(staffs) && staffs.map(staff => {
                            return (
                                <StaffsInputEach
                                    key={staff.id}
                                    staff={staff}
                                    isRenderConfirm={isRenderConfirm}
                                    handleChange={handleChange}
                                />
                            )
                          })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

StaffsInterfaceWeekly.defaultProps = {
    staffs: [],
    isRenderConfirm: false,
    handleChange: Functions.createWarning('handleChange')
};
StaffsInterfaceWeekly.propTypes = {
    staffs: PropTypes.array.isRequired,
    isRenderConfirm: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
};

export { StaffsInterfaceWeekly };
