import React from 'react';

export const Head = ({ title, handleClick }) => (
    <div className="new-order-head">
        <h2>{title}</h2>
        <button className="new-order-close ir" onClick={handleClick}>닫기</button>
    </div>
)
