import React, { useState } from 'react';
import './style.scss';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Node.js 마스터',
      instructor: '노드마스터',
      price: 69999,
      imageUrl:
        'https://cdn.inflearn.com/public/courses/331985/cover/f0501069-2139-4112-aafa-a9b3a2932860/331985-eng.png',
      checked: false,
    },
    {
      id: 2,
      title: 'Node.js 마스터',
      instructor: '노드마스터',
      price: 69999,
      imageUrl:
        'https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png',
      checked: false,
    },
    // ... 추가 강의들
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const userInfo = {
    name: '이종호',
    email: 'gher53@naver.com',
    phone: '010-3177-2132',
  };

  const handleSelectAll = checked => {
    setSelectAll(checked);
    setCartItems(cartItems.map(item => ({ ...item, checked })));
  };

  const handleSelectItem = id => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCartItems(updatedItems);
    setSelectAll(updatedItems.every(item => item.checked));
  };

  const handleDeleteSelected = () => {
    setCartItems(cartItems.filter(item => !item.checked));
    setSelectAll(false);
  };

  // 개별 항목 삭제를 처리하는 함수
  const handleRemoveItem = id => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.checked ? item.price : 0),
    0
  );

  const selectedCount = cartItems.filter(item => item.checked).length;

  return (
    <div className='cart-page-container'>
      <h5 className='cart-title'>수강바구니</h5>
      <div className='user-info-container'>
        <div className='user-info'>
          <div className='info-title'>구매자 정보</div>
          <div className='info-content'>{userInfo.name}</div>
          <div className='info-content'>{userInfo.email}</div>
          <div className='info-content'>{userInfo.phone}</div>
        </div>
      </div>

      <div className='cart-container'>
        <div className='cart-header'>
          <div className='select-all'>
            <input
              type='checkbox'
              checked={selectAll}
              onChange={e => handleSelectAll(e.target.checked)}
            />
            전체선택
          </div>
          <button className='delete-selected' onClick={handleDeleteSelected}>
            선택삭제
          </button>
        </div>
        <div className='cart-items'>
          {cartItems.map(item => (
            <div className='cart-item' key={item.id}>
              <input
                type='checkbox'
                checked={item.checked}
                onChange={() => handleSelectItem(item.id)}
              />
              <img
                src={item.imageUrl}
                alt={item.title}
                className='item-image'
              />
              <div className='item-details'>
                <div className='item-title'>{item.title}</div>
                <div className='item-instructor'>{item.instructor}</div>
                <div className='item-price'>{`₩${item.price.toLocaleString()}`}</div>
              </div>
              <div
                className='remove-item'
                onClick={() => handleRemoveItem(item.id)}
              >
                ×
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='order-summary-container'>
        <div className='order-summary'>
          <div className='summary-title'>선택된 강좌 수</div>
          <div className='summary-content'>{selectedCount}개 강좌</div>
          <div className='summary-title'>구매할 강좌 합계</div>
          <div className='summary-content'>{`₩${totalPrice.toLocaleString()}`}</div>
        </div>
        <button className='checkout-button'>결제하기</button>
      </div>
    </div>
  );
};

export default Cart;
