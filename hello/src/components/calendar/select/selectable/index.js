import React from 'react';
import Select from 'react-select';

/* Selectbox */

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
						{this.props.option.picture ?
							<span className="thumbnail"><img src={this.props.option.picture} alt={this.props.children} /></span>
							: ""
						}
						{this.props.children}
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
          {this.props.value.picture ?
            <span className="thumbnail"><img src={this.props.value.picture} alt={this.props.children} /></span>
            : ""
          }
					{this.props.children}
				</span>
			</div>
		);
	}
});

const Selectable = React.createClass({
	propTypes: {
		hint: React.PropTypes.string,
		label: React.PropTypes.string,
	},
	getInitialState () {
		return {
			value: this.props.value
		};
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
			<div className={`Select-wrap selectable ${this.props.className}`}>
				<Select
          searchable={this.props.searchable}
          options={this.props.options}
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


module.exports = Selectable;
