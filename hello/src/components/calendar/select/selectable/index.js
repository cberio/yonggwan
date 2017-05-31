import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

/* Selectbox */

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
                title={this.props.children}
              >
                <div title={this.props.children}>
                    {this.props.option.picture ?
                        <span className="thumbnail"><img src={this.props.option.picture} alt={this.props.children} /></span> :
                        <span className="thumbnail no-image" />
						         }
                    <span className="label">{this.props.children}</span>
                </div>
            </div>
        );
    }
}

const ValueComponentSlide = ({ children }) => (
    <div className="Select-value">
        <span className="Select-value-label">
            {children && children}
        </span>
    </div>
);

const ValueComponentNewOrder = ({ value, children }) => (
    <div className="Select-value">
        {value && value.picture ?
            <span className="thumbnail"><img src={value.picture} alt={children} /></span>
            : ''
          }
        <span className="Select-value-label">
            {children}
        </span>
    </div>
);

class Selectable extends React.Component {
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
            <div className={`Select-wrap selectable ${this.props.className}`} id={this.props.id ? this.props.id : ''}>
                <Select
                    ref={(c) => { this.select = c; }}
                    searchable={this.props.searchable}
                    clearable={this.props.clearable}
                    options={this.props.options}
                    value={this.state.value}
                    name={this.props.name}
                    onChange={this.setValue}
                    labelKey={this.props.labelKey}
                    autofocus={this.props.autofocus}
                    optionComponent={OptionComponent}
                    valueComponent={this.props.type === 'user-card' ? ValueComponentSlide : ValueComponentNewOrder}
                    placeholder={this.props.placeholder}
                    arrowRenderer={this.arrowRenderer}
                />
            </div>
        );
    }
}

Selectable.defaultProps = {
    lableKey: ''
};

Selectable.propTypes = {
    lableKey: PropTypes.string.isRequired
};

module.exports = Selectable;
