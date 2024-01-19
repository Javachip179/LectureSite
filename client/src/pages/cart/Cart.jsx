// Cart.jsx
import React from 'react';
import './style.scss';

const Cart = () => {
  return (
    <div className='cart'>
      <h3 className='list-title'>장바구니</h3>
      <div className='cart-card'>
        <input type='checkbox' />
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Cart;
