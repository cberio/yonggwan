import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
                className={`${`${this.props.option.color} ${this.props.className}`}`}
                onMouseDown={this.handleMouseDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseMove}
                title={this.props.option.title}
            >
                <div title={this.props.children}>
                    <i className="bullet" />
                    <span className="label">{this.props.children}</span>
                    <span className="service-time">{Functions.minuteToTime(moment.duration(this.props.option.time, 'hh:mm').asMinutes())}</span>
                    <span className="price">{Functions.numberWithCommas(this.props.option.amount)} ￦</span>
                </div>
            </div>
        );
    }
}

class ValueComponent extends React.Component {
    render() {
        return (
            <div className="Select-value">
                <span className="Select-value-label">
                    <span className={`label ${this.props.value.color}`}>{this.props.children}</span>
                    <span className="service-time">{this.props.value.time}분</span>
                    <i className="checked"><img src={Images.IMG_input_checked} alt="선택됨" /></i>
                </span>
            </div>
        );
    }
}

class GenderFilterComponent extends React.Component {
    render() {
        return (
            <div className="Select-filter-wrap">
                <div className="Select-filter-container">
                    <div className="Select-filter-option">
                        <input
                            type="radio"
                            id="gender_all"
                            name="gender"
                            value={0}
                            onChange={e => this.props.onChange(e)}
                            defaultChecked={this.props.default === 0}
                        />
                        <label htmlFor="gender_all">전체</label>
                    </div>
                    <div className="Select-filter-option">
                        <input
                            type="radio"
                            id="gender_male"
                            name="gender"
                            value={1}
                            onChange={e => this.props.onChange(e)}
                            defaultChecked={this.props.default === 1}
                        />
                        <label htmlFor="gender_male">남성</label>
                    </div>
                    <div className="Select-filter-option">
                        <input
                            type="radio"
                            id="gender_female"
                            name="gender"
                            value={2}
                            onChange={e => this.props.onChange(e)}
                            defaultChecked={this.props.default === 2}
                        />
                        <label htmlFor="gender_female">여성</label>
                    </div>
                </div>
            </div>
        );
    }
}

class SearchService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.options,
            value: this.props.value,
            genderCode: 0
        };
        this.setOptions = this.setOptions.bind(this);
        this.setGenderCode = this.setGenderCode.bind(this);
        this.setValue = this.setValue.bind(this);
    }
    componentDidMount() {
        const _component = this;
        if (this.props.autoDropdown) {
            setTimeout(() => {
                _component.dropDownSelectOptions();
            }, 0);
        }
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
    setGenderCode(value) {
        this.setState({
            genderCode: Number(value)
        }, this.setOptions);
    }
    setOptions() {
        let options = this.props.options;
        if (this.state.genderCode)
            options = options.filter(option => option.sex === this.state.genderCode);

        this.setState({
            options
        }, this.dropDownSelectOptions);
    }
	// react-select 모듈의 옵션에 초기 자동 드롭다운 옵션이 없으므로 트리거하여 드롭다운 하도록 함수
    dropDownSelectOptions() {
        this.select.handleMouseDown({
            target: {},
            preventDefault() {},
            stopPropagation() {}
        });
    }
    render() {
        return (
            <div className={`Select-wrap searchable ${this.props.className}`} id={this.props.id ? this.props.id : ''}>
                <div className="viewstate">
					         필터링된 서비스: {this.state.options.length}개
                </div>
                <Select
                    ref={(c) => { this.select = c; }}
                    noResultsText={this.props.noResultsText}
                    matchProp="any"
                    matchPos="any"
                    ignoreCase={false}
                    searchable
                    labelKey={this.props.labelKey}
                    clearable={false}
                    options={this.state.options}
                    value={this.state.value}
                    name={this.props.name}
                    onChange={this.setValue}
                    autofocus={this.props.autofocus}
                    openOnFocus={this.props.openOnFocus}
                    optionComponent={OptionComponent}
                    valueComponent={ValueComponent}
                    placeholder={this.props.placeholder}
                    arrowRenderer={this.arrowRenderer}
                />
                {this.props.customFilterComponent
					? <GenderFilterComponent
    default={this.state.genderCode}
    onChange={e => this.setGenderCode(e.target.value)}
					/>
					: ''
				}
            </div>
        );
    }
}

GenderFilterComponent.propTypes = {
    onChange: PropTypes.func.isRequired
};

SearchService.propTypes = {
    hint: PropTypes.string,
    label: PropTypes.string,
};


module.exports = SearchService;
