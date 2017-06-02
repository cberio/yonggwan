import React from 'react';
import _ from 'lodash';
import { ButtonElement } from './interface/button';

export const Foot = (props) => {
    let nextText = 'NEXT';
    let nextActive = false;
    let nextDisabled = false;

    /**  STEP-1 **/
    if (props.step === 1)
        if (props.isEmpties.guest_id)
            nextText = 'SKIP';

    /**  STEP-2 **/
    else if (props.step === 2) {
        if (props.isEmpties.shop_service_id || props.isEmpties.staff_id) {
            nextDisabled = true;
        } else {
            nextActive = true;
            nextText = 'CONFIRM';
        }
    }

    return (
        <div className="new-order-foot">
            <ButtonElement
                text="CANCEL"
                disabled={false}
                autofocus={false}
                active={false}
                classNames={['new-order-btn', 'new-order-cancel', 'left']}
                handleClick={props.cancel}
            />
            <ButtonElement
                text={nextText}
                disabled={nextDisabled}
                autofocus={false}
                active={nextActive}
                classNames={['new-order-btn', 'new-order-submit', 'right']}
                handleClick={props.nextStep}
            />
        </div>
      )
  }
