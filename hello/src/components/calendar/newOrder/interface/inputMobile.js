import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import _ from 'lodash';
import * as Functions from '../../../../js/common';

export class MobileInputElements extends React.Component {
    constructor(props) {
        super(props);
        // string 형식의 phone number value를 배열로 저장
        const value = !_.isEmpty(props.value) ? Functions.getPhoneStr(props.value).split('-') : ['', '', ''];
        this.state = {
            value
        }
        this.update = this.update.bind(this);
    }

    update(e, index) {
        const component = this;
        this.setState({
            value: update(this.state.value, {
                [index]: { $set: e.target.value }
            })
        }, () => {
            component.props.handleChange(this.state.value.join(''))
        })
    }

    render() {
        return (
          <div className="customer-phone">
              <div>
                  <input
                      type="text"
                      maxLength="3"
                      className={this.state.value[0] ? 'has-value' : 'null-value'}
                      value={this.state.value[0]}
                      onChange={e => this.update(e, 0)}
                      ref={(c) => { this.phone1 = c; }}
                      placeholder="010"
                  />
                  <i>-</i>
                  <input
                      type="text"
                      maxLength="4"
                      className={this.state.value[1] ? 'has-value' : 'null-value'}
                      value={this.state.value[1]}
                      onChange={e => this.update(e, 1)}
                      ref={(c) => { this.phone2 = c; }}
                      placeholder="0000"
                  />
                  <i>-</i>
                  <input
                      type="text"
                      maxLength="4"
                      className={this.state.value[2] ? 'has-value' : 'null-value'}
                      value={this.state.value[2]}
                      onChange={e => this.update(e, 2)}
                      ref={(c) => { this.phone3 = c; }}
                      placeholder="0000"
                  />
              </div>
          </div>
        );
    }
}

MobileInputElements.defaultProps = {
    handleChange: Functions.createWarning('handleChange')
}
MobileInputElements.propTypes = {
    handleChange: PropTypes.func.isRequired
}
