import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from 'react-select';
import * as Functions from '../../../../js/common';
import * as Images from '../../../../require/images';

/* Search */

class OptionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
    handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    }
    handleMouseEnter(event) {
        this.props.onFocus(this.props.option, event);
    }
    handleMouseMove(event) {
        if (this.props.isFocused) return;
        this.props.onFocus(this.props.option, event);
    }
    render() {
        return (
          <div
            className={this.props.className}
            onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter}
            onMouseMove={this.handleMouseMove}
            title={this.props.option.title}
          >
            <div title={this.props.children}>
              <span className="label">{this.props.children}</span>
              {this.props.option.guest_class ?
                <span className={`rating ${this.props.option.guest_class}`}>{this.props.option.guest_class}</span>
							: '' }
              {this.props.option.guest_mobile ?
                <span className={`phone ${this.props.option.guest_mobile}`}>
                  {!_.isEmpty(this.props.option.guest_mobile) && Functions.getPhoneStr(this.props.option.guest_mobile)}
                </span>
							: '' }
            </div>
          </div>
        );
    }
}

const ValueComponent = ({ children, value }) => (
    <div className="Select-value">
      <span className="Select-value-label">
        <span className="label">{ children ? children : ''}</span>
        <span className={`rating ${value.guest_class}`}>{value.guest_class}</span>
        <span className="phone">{!_.isEmpty(value.guest_mobile) && Functions.getPhoneStr(value.guest_mobile)}</span>
        <i className="checked"><img src={Images.IMG_input_checked} alt="선택됨" /></i>
      </span>
    </div>
);

class SearchGuest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          value: this.props.value
        };
        this.setValue = this.setValue.bind(this);
    }

    setValue(value) {
        this.setState({ value });
        this.props.onChange(value);
    }

    arrowRenderer() {
  	return (
    <span>+</span>
  	);
    }

    render() {
        return (
          <div className={`Select-wrap searchable ${this.props.className} ${_.isEmpty(this.state.value) ? 'null-value' : ''}`}>
            <Select.Creatable
              searchable
              options={this.props.options}
              autoFocus
              value={this.state.value}
              name={this.props.name}
              onChange={this.setValue}
              optionComponent={OptionComponent}
              valueComponent={ValueComponent}
              placeholder={this.props.placeholder}
              arrowRenderer={this.arrowRenderer}
              clearable={this.props.clearable}
            />
          </div>
        );
    }
}

SearchGuest.propTypes = {
    hint: PropTypes.string,
    label: PropTypes.string,
};

module.exports = SearchGuest;
