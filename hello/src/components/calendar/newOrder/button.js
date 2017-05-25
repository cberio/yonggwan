import React from 'react';

export const ButtonElement = ({ text, disabled, autofocus, active, handleClick, classNames }) => {
    const classes = classNames;
    if (active) classes.push('active');

    return (
      <button
        className={classNames.join(' ')}
        disabled={disabled}
        autoFocus={autofocus}
        onClick={handleClick}
      >
        {text}
      </button>
    )
}
