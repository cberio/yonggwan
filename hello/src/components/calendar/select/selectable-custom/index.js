import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import '../../../../lib/jquery-custom-scrollbar-master/jquery.custom-scrollbar.js';

/* Selectbox - custom component */
class OptionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            selected: this.props.selected
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }
    handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.value, event);
    }
    render() {
        return (
            <li
                className={`select-option ${this.state.selected
                ? 'select-option-selected'
                : 'select-option-unselected'}`}
            >
                <a href="" onClick={this.handleMouseDown} className="select-option-anchor">
                    <span className="option-start">{moment(this.props.value.start).format('HH:mm')}</span>
                    <span className="option-dash">
                        -
                    </span>
                    <span className="option-end">{moment(this.props.value.end).format('HH:mm')}</span>
                </a>
            </li>
        );
    }
}
OptionComponent.propTypes = {
    value: PropTypes.object,
    selected: PropTypes.bool
};
OptionComponent.defaultProps = {
    selected: false,
    value: {
        start: undefined,
        end: undefined
    }
};

class SelectableCustom extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        $(document).unbind('click keydown');
    }
    componentDidMount() {
        const _this = this;
        // 빈 영역 클릭시 닫기
        $(document).unbind('click').bind('click', (e) => {
            if ($(e.target).parents('.selectable-wrap').length < 1) {
                console.log('이거지');
                e.stopPropagation();
                _this.props.onDestroy();
            } else
                alert();
        });
        if (this.props.type !== 'RecommendedReservationTime') {
            $(this.container).customScrollbar({
                // animationSpeed: number,
                // updateOnWindowResize: true,
                skin: 'dark-skin',
                wheelSpeed: 20,
                hScroll: false
            });
        }
    }
    render() {
        const mapToComponent = options => options.map((option, i) => (
            <OptionComponent
                key={i}
                value={option}
                onSelect={value => this.props.onChange(moment(value.start), moment(value.end), this.props.type)}
            />
                ));
        const title = (
            <p className="select-title">{this.props.title}</p>
        );
        return (
            <div className={`selectable-wrap ${this.props.themeClass}`}>
                <div
                    className="selectable-container" ref={(c) => { this.container = c; }} style={{
                        width: `${this.props.width}px`,
                        height: this.props.height
                        ? this.props.height
                        : 'auto'
                    }}
                >
                    {this.props.title
                        ? title
                        : ''}
                    <ul className="select-option-outer">
                        {mapToComponent(this.props.options)}
                    </ul>
                </div>
            </div>
        );
    }
}

SelectableCustom.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    themeClass: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onDestroy: PropTypes.func,
    value: PropTypes.object
};

SelectableCustom.defaultProps = {
    themeClass: 'no-theme',
    width: 150
};

export default SelectableCustom;
