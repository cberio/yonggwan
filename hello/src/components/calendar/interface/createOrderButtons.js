import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import * as Functions from '../../../js/common';

export const CreateOrderButtonDirect = ({
    handleClickSlot,
    handleClickReservation,
    handleClickOfftime,
    classes,
    buttonClasses
}) => (
    <div data-date="" className={`create-order-wrap timeline ${classes || ''}`}>
        <div className="create-order-inner">
            <div className="create-order-slot">
                <button className={`create-button ${buttonClasses || ''}`} onClick={handleClickSlot}>
                    <i className="time" />
                    <span>+</span>
                </button>
                <div className="create-order-ui-wrap">
                    <div className="create-order-ui-inner">
                        <div className="create-order-ui">
                            <button onClick={handleClickReservation} className="ui-reservation">예약생성</button>
                            <button onClick={handleClickOfftime} className="ui-offtime">OFF TIME 생성</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

CreateOrderButtonDirect.propTypes = {
    handleClickSlot: PropTypes.func.isRequired,
    handleClickReservation: PropTypes.func.isRequired,
    handleClickOfftime: PropTypes.func.isRequired,
    classes: PropTypes.string,
    buttonClasses: PropTypes.string
};

CreateOrderButtonDirect.defaultProps = {
    handleClickSlot: () => Functions.createWarning('handleClickSlot'),
    handleClickReservation: () => Functions.createWarning('handleClickReservation'),
    handleClickOfftime: () => Functions.createWarning('handleClickOffTime'),
    classes: '',
    buttonClasses: ''
};


export const CreateOrderButtonQuick = ({ handleClickReservation, handleClickOfftime }) => {
    const show = () => { $('.create-order-wrap.fixed .create-order-ui').show(); };
    const hide = () => { $('.create-order-wrap.fixed .create-order-ui').hide(); };
    return (
        <div className="create-order-wrap fixed" onMouseLeave={hide}>
            <div className="create-order-slot">
                <button className="create-button" onClick={show} onFocus={show} >
                    <span>+</span>
                </button>
            </div>
            <div className="create-order-ui">
                <button onClick={handleClickReservation} className="ui-reservation">예약생성</button>
                <button onClick={handleClickOfftime} className="ui-offtime">OFF TIME 생성</button>
            </div>
        </div>
    );
};

CreateOrderButtonQuick.propTypes = {
    handleClickReservation: PropTypes.func.isRequired,
    handleClickOfftime: PropTypes.func.isRequired
};

CreateOrderButtonQuick.defaultProps = {
    handleClickReservation: () => Functions.createWarning('handleClickReservation'),
    handleClickOfftime: () => Functions.createWarning('handleClickOfftime')
};
