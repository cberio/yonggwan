import React from 'react';
import PropTypes from 'prop-types';
import * as Functions from '../../../js/common';

export const CreateOrderButtonDirect = ({
    handleClickSlot,
    handleClickReservation,
    handleClickOffTime,
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
                            <button onClick={() => handleClickReservation(null)} className="ui-reservation">예약생성</button>
                            <button onClick={() => handleClickOffTime('timeline')} className="ui-offtime">OFF TIME 생성</button>
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
    handleClickOffTime: PropTypes.func.isRequired,
    classes: PropTypes.string,
    buttonClasses: PropTypes.string
};

CreateOrderButtonDirect.defaultProps = {
    handleClickSlot: () => Functions.createWarning('handleClickSlot'),
    handleClickReservation: () => Functions.createWarning('handleClickReservation'),
    handleClickOffTime: () => Functions.createWarning('handleClickOffTime'),
    classes: '',
    buttonClasses: ''
};


export const CreateOrderButtonQuick = ({ newOrder, bindNewOfftime, toggleCreateOrderFixedUi }) => (
    <div className="create-order-wrap fixed">
        <div className="create-order-slot">
            <button className="create-button" onClick={toggleCreateOrderFixedUi}>
                <span>+</span>
            </button>
        </div>
        <div className="create-order-ui">
            <button onClick={() => newOrder('unknownStart')} className="ui-reservation">예약생성</button>
            <button onClick={bindNewOfftime} className="ui-offtime">OFF TIME 생성</button>
        </div>
    </div>
);

CreateOrderButtonQuick.propTypes = {
    newOrder: PropTypes.func.isRequired,
    bindNewOfftime: PropTypes.func.isRequired,
    toggleCreateOrderFixedUi: PropTypes.func.isRequired
};

CreateOrderButtonQuick.defaultProps = {
    newOrder: () => Functions.createWarning('newOrder'),
    bindNewOfftime: () => Functions.createWarning('bindNewOfftime'),
    toggleCreateOrderFixedUi: () => Functions.createWarning('toggleCreateOrderFixedUi')
};
