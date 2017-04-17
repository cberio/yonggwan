import React from 'react';
import Select from 'react-select';
import * as Images from '../../../../require/images';

/* Search */

const OptionComponent = React.createClass({
	handleMouseDown (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter (event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove (event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	},
	render () {
		return (
			<div className={this.props.className}
				onMouseDown={this.handleMouseDown}
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
				title={this.props.option.title} >
					<div>
						<span className="label">{this.props.children}</span>
						{this.props.option.guest_class ?
							<span className={`rating ${this.props.option.guest_class}`}>{this.props.option.guest_class}</span>
							: ""
						}
					</div>
			</div>
		);
	}
});

const ValueComponent = React.createClass({
	render () {
		return (
			<div className="Select-value">
				<span className="Select-value-label">
					<span className="label">{this.props.children}</span>
					<span className={`rating ${this.props.value.guest_class}`}>{this.props.value.guest_class}</span>
					<i className="checked"><img src={Images.IMG_input_checked} alt="선택됨" /></i>
				</span>
			</div>
		);
	}
});

const SearchCustomer = React.createClass({
	propTypes: {
		hint: React.PropTypes.string,
		label: React.PropTypes.string,
	},
	getInitialState () {
		return {};
	},
	setValue (value) {
		this.setState({ value });
    this.props.onChange(value);
	},
  arrowRenderer () {
  	return (
  		<span>+</span>
  	);
  },

	render () {
		return (
			<div className={`Select-wrap searchable ${this.props.className}`}>
				<Select.Creatable
          searchable={true}
          options={this.props.options}
					autofocus={true}
          value={this.state.value}
          name={this.props.name}
					onChange={this.setValue}
					optionComponent={OptionComponent}
					valueComponent={ValueComponent}
  				placeholder={this.props.placeholder}
          arrowRenderer={this.arrowRenderer}
					/>
			</div>
		);
	}
});


module.exports = SearchCustomer;
