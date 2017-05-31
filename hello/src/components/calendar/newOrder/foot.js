import React from 'react';
import _ from 'lodash';
import { ButtonElement } from './interface/button';

export const Foot = (props) => (
    <div className="new-order-foot">
        <ButtonElement
            text="CANCEL"
            disabled={false}
            autofocus={false}
            active={false}
            classNames={['new-order-btn', 'new-order-cancel', 'left']}
            handleClick={props.newOrderCancel}
        />
        <ButtonElement
            text="DELETE"
            disabled
            autofocus={false}
            active={false}
            classNames={['new-order-btn', 'new-order-cancel', 'left']}
            handleClick={props.newOrderCancel}
        />
        <ButtonElement
            text="NEXT"
            disabled={false}
            autofocus={false}
            active={!_.isEmpty(props.newOrderGuest) && (!_.isEmpty(props.newOrderGuest.guest_name) || !_.isEmpty(props.newOrderGuestName))}
            classNames={['new-order-btn', 'new-order-submit', 'right']}
            handleClick={props.nextStep}
        />
        <ButtonElement
            text="SKIP"
            disabled
            autofocus={false}
            active={false}
            classNames={['new-order-btn', 'new-order-submit', 'right']}
            handleClick={props.nextStep}
        />
        <ButtonElement
            text="CONFIRM"
            disabled={false}
            autofocus={false}
            active
            classNames={['new-order-btn', 'new-order-submit', 'right']}
            handleClick={props.nextStep}
        />
    </div>
)
