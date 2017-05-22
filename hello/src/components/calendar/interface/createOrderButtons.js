import React from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../../actions';
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
                            <button onClick={() => handleClickReservation(actions.NewOrderStatus.DIRECT)} className="ui-reservation">예약생성</button>
                            <button onClick={() => handleClickOfftime('timeline')} className="ui-offtime">OFF TIME 생성</button>
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


export const CreateOrderButtonQuick = ({ handleClickReservation, handleClickOfftime, toggleCreateOrderFixedUi }) => (
    <div className="create-order-wrap fixed">
        <div className="create-order-slot">
            <button className="create-button" onClick={toggleCreateOrderFixedUi}>
                <span>+</span>
            </button>
        </div>
        <div className="create-order-ui">
            <button onClick={() => handleClickReservation(actions.NewOrderStatus.QUICK)} className="ui-reservation">예약생성</button>
            <button onClick={handleClickOfftime} className="ui-offtime">OFF TIME 생성</button>
        </div>
    </div>
);

CreateOrderButtonQuick.propTypes = {
    handleClickReservation: PropTypes.func.isRequired,
    handleClickOfftime: PropTypes.func.isRequired,
    toggleCreateOrderFixedUi: PropTypes.func.isRequired
};

CreateOrderButtonQuick.defaultProps = {
    handleClickReservation: () => Functions.createWarning('handleClickReservation'),
    handleClickOfftime: () => Functions.createWarning('handleClickOfftime'),
    toggleCreateOrderFixedUi: () => Functions.createWarning('toggleCreateOrderFixedUi')
};
