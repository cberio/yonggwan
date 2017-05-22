import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import _ from 'lodash';
import * as Functions from '../../../js/common';

const StaffsInputAll = createReactClass({
    render() {
        const { handleChange, isRenderConfirm } = this.props;
        return (
            <div className="expert-each checkbox all">
                <input
                    disabled={isRenderConfirm}
                    className="expert-input"
                    type="checkbox"
                    name="expert"
                    id="expert_all"
                    value="all"
                    onChange={input => handleChange('all', input.target)}
                />
                <label className="expert-label" htmlFor="expert_all">
                    <span>ALL</span>
                </label>
            </div>
        );
    }
});

const StaffsInputEach = createReactClass({
    render() {
        const { staff, handleChange, isRenderConfirm } = this.props;

        return (
            <div
                className="expert-each checkbox"
                data-id={`expert_${staff.id}`}
                data-active="false"
                data-priority={staff.priority}
            >
                <input
                    disabled={isRenderConfirm}
                    className="expert-input"
                    type="checkbox"
                    name="expert" id={`expert_${staff.id}`}
                    value={staff.id}
                    onChange={input => handleChange(staff, input.target)}
                />
                <label className="expert-label" htmlFor={`expert_${staff.id}`}>
                    <span>{staff.nickname || staff.staff_name}</span>
                    <i className="today-count">3</i>
                </label>
            </div>
        );
    }
});

class StaffsInterfaceDaily extends PureComponent {
    render() {
        const { staffs, isRenderConfirm, handleChange } = this.props;
        return (
            <div className="expert-wrap">
                <div className="expert-ui expert-daily">
                    <div className="expert-inner">
                        { /* INPUT BUTTON 'ALL' */
                          staffs.length > 1 && (
                              <StaffsInputAll
                                  handleChange={handleChange}
                                  isRenderConfirm={isRenderConfirm}
                              />
                            )
                        }
                        <div className="expert-each-wrap">
                            { /* INPUT BUTTON 'EACH OF STAFF' */
                              !_.isEmpty(staffs) && staffs.map(staff => (
                                  <StaffsInputEach
                                      key={staff.id}
                                      staff={staff}
                                      handleChange={handleChange}
                                      isRenderConfirm={isRenderConfirm}
                                  />
                              ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

StaffsInterfaceDaily.defaultProps = {
    staffs: [],
    isRenderConfirm: false,
    handleChange: Functions.createWarning('handleChange')
};
StaffsInterfaceDaily.propTypes = {
    staffs: PropTypes.array.isRequired,
    isRenderConfirm: PropTypes.bool,
    handleChange: PropTypes.func.isRequired
};

export { StaffsInterfaceDaily };
