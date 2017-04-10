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
			<div
				className={`${this.props.option.itemColor +' '+ this.props.className}`}
				onMouseDown={this.handleMouseDown}
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
				title={this.props.option.title} >
					<div>
						<i className="bullet"></i>
						<span className="label">{this.props.children}</span>
						<span className="service-time">{this.props.option.serviceTime}분</span>
						<span className="price">{this.props.option.price} ￦</span>
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
					<span className={`label ${this.props.value.itemColor}`}>{this.props.children}</span>
					<span className="service-time">{this.props.value.serviceTime}분</span>
					<i className="checked"><img src={Images.IMG_input_checked} alt="선택됨" /></i>
				</span>
			</div>
		);
	}
});

const GenderFilterComponent = React.createClass({
	propTypes: {
		onChange: React.PropTypes.func.isRequired
	},
	render () {
		return (
			<div className="Select-filter-wrap">
				<div className="Select-filter-container">
					<div className="Select-filter-option">
						<input
							type="radio"
							id="gender_all"
							name="gender"
							value="0"
							onChange={(e) => this.props.onChange(e)}
							defaultChecked={this.props.init === 0}
						/>
						<label htmlFor="gender_all">전체</label>
					</div>
					<div className="Select-filter-option">
						<input
							type="radio"
							id="gender_male"
							name="gender"
							value="1"
							onChange={(e) => this.props.onChange(e)}
							defaultChecked={this.props.init === 1}
						/>
						<label htmlFor="gender_male">남성</label>
					</div>
					<div className="Select-filter-option">
						<input
							type="radio"
							id="gender_female"
							name="gender"
							value="2"
							onChange={(e) => this.props.onChange(e)}
							defaultChecked={this.props.init === 2}
						/>
						<label htmlFor="gender_female">여성</label>
					</div>
				</div>
			</div>
		);
	}
})



const SearchProduct = React.createClass({
	propTypes: {
		hint: React.PropTypes.string,
		label: React.PropTypes.string,
	},
	componentDidMount () {
		let _component = this;
		if (this.props.autoDropdown) {
			setTimeout(function () {
				_component.dropDownSelectOptions();
			},0);
		}
	},
	// react-select 모듈의 옵션에 초기 자동 드롭다운 옵션이 없으므로 트리거하여 드롭다운 하도록 함수
	dropDownSelectOptions () {
		this.refs.select.handleMouseDown({
			target: {},
			preventDefault: function () {},
			stopPropagation: function () {}
		});
	},
	getInitialState () {
		return {
			genderCode: 0,
			value: this.props.value
		};
	},
	setGenderCode (value) {
		this.setState({
			genderCode: value
		});
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
	getGenderCode(productObj, inputStr){
		let code = productObj.gender *1;

		switch (this.state.genderCode *1) {
			case 0 :
				return true;
				break;
			case 1 :
				if (code === 1)
					return true;
					break;
			case 2 :
				if (code === 2)
					return true;
					break;
			default :
				return false;
		}
	},

	render () {
		return (
			<div className={`Select-wrap searchable ${this.props.className}`} id={this.props.id ? this.props.id : ''}>
				<Select
					ref="select"
					filterOption={this.getGenderCode}
					noResultsText={this.props.noResultsText}
					matchPos="any"
					ignoreCase={false}
          searchable={true}
					clearable={false}
          options={this.props.options}
          value={this.state.value}
          name={this.props.name}
					onChange={this.setValue}
					autofocus={true}
					optionComponent={OptionComponent}
					valueComponent={ValueComponent}
  				placeholder={this.props.placeholder}
          arrowRenderer={this.arrowRenderer}
					/>
				{this.props.customFilterComponent
					? <GenderFilterComponent init={this.state.genderCode} onChange={ (e) => this.setGenderCode(e.target.value) } />
					: ''
				}
			</div>
		);
	}
});


module.exports = SearchProduct;
