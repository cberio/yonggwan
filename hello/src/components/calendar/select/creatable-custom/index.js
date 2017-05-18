import React from 'react';
import PropTypes from 'prop-types';
import * as Functions from '../../../../js/common';

/* Creatable - custom component */
class CreatableCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.setIncrement = this.setIncrement.bind(this);
        this.setDecrement = this.setDecrement.bind(this);
    }
    handleChange(e) {
      var amount = e.target.value.trim().replace(/(^0+)/, "").replace(/,/gi, ""); //: 12345000
      var amountWithComma = Functions.numberWithCommas(amount); //: 12,345,000
      if (!isNaN(amount)) {
        this.setState({
          inputValue: amountWithComma
        });
      }
    }
    handleKeydown (e) {
      if (e.which === 13)
        this.setIncrement();
    }
    setIncrement () {
      this.props.handleIncrement(this.state.inputValue.replace(/,/gi, ''));
    }
    setDecrement () {
      this.props.handleDecrement(this.state.inputValue.replace(/,/gi, ''));
    }
    render() {
        return (
          <div className="creatable-wrap arrow-border-dark">
            <div className="creatable-container">
              <div className="creatable-field">
                <div className="creatable-field-inner">
                  <div className="creatable-field-input">
                    <input
                      className={this.state.inputValue ? '':'placeholder'}
                      id="priceValue"
                      name="priceValue"
                      ref="priceValue"
                      type="text"
                      placeholder="금액을 입력하세요"
                      maxLength="8"
                      value={this.state.inputValue}
                      onKeyDown={this.handleKeydown}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="creatable-field-unit">
                    <label htmlFor="priceValue">원</label>
                  </div>
                </div>
              </div>
              <div className="creatable-ui">
                <button onClick={this.setDecrement} className="decrement">차감</button>
                <button onClick={this.setIncrement} className="increment">충전</button>
              </div>
            </div>
          </div>
        );
    }
}

CreatableCustom.propTypes = {
  onDestroy: PropTypes.func,
  handleIncrement: PropTypes.func,
  handleDecrement: PropTypes.func
};
CreatableCustom.defaultProps = {
};

export default CreatableCustom;
