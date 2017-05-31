import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import * as Functions from '../../../../js/common';

export class MobileInputElements extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
        this.update = this.update.bind(this);
    }
    update(e, index) {
        this.setState({
            value: update(this.state.value, {
                [index]: { $set: e.target.value }
            })
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
                      onBlur={e => this.props.handleChange(e, 0)}
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
                      onBlur={e => this.props.handleChange(e, 1)}
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
                      onBlur={e => this.props.handleChange(e, 2)}
                      ref={(c) => { this.phone3 = c; }}
                      placeholder="0000"
                  />
              </div>
          </div>
        );
    }
}

MobileInputElements.defaultProps = {
    handleChange: Functions.createWarning('handleChange'),
    value: ['', '', '']
}
MobileInputElements.propTypes = {
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired
}
