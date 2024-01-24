import React, { useState } from 'react';
import './style.scss'; // 가정한 SCSS 파일입니다. 실제 파일 경로에 맞게 수정해주세요.


const Cart = () => {
  // 강의 목록과 선택된 강의들의 상태를 관리합니다.
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
    {
      id: 3,
      title: 'Node.js 마스터',
      instructor: '노드마스터',
      price: 69999,
      imageUrl:
        'https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png',
      checked: false,
    },
  ]);

  const userInfo = {
    name: '이종호',
    email: 'gher53@naver.com',
    phoneNumber: '010-3177-2132',
  };

  const [selectedItems, setSelectedItems] = useState([]);

  // 모든 항목을 선택 또는 선택 해제하는 함수입니다.
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // 특정 항목을 선택 또는 선택 해제하는 함수입니다.
  const toggleSelectItem = id => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // 선택된 항목을 삭제하는 함수입니다.
  const deleteSelectedItems = () => {
    setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  return (
    <div>
      <h3 className='cart-title'>장바구니</h3>
      <div className='cart-page-container'>
        <div className='left-section'>
          <div className='cart-header'>
            <div className='select-all'>
              <input
                type='checkbox'
                id='selectAllCheckbox' // 체크박스의 ID 추가
                checked={selectedItems.length === cartItems.length}
                onChange={toggleSelectAll}
              />
              <label htmlFor='selectAllCheckbox'>전체 선택</label>{' '}
              {/* 라벨 연결 */}
            </div>
            <button className='delete-selected' onClick={deleteSelectedItems}>
              선택 삭제
            </button>
          </div>
          <div className='cart-items'>
            {cartItems.map(item => (
              <div className='cart-item' key={item.id}>
                <label
                  className='checkbox-label'
                  htmlFor={`checkbox-${item.id}`}
                >
                  <input
                    type='checkbox'
                    id={`checkbox-${item.id}`} // 각 체크박스마다 고유한 ID 추가
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                  <span className='custom-checkbox'></span>{' '}
                  {/* 커스텀 체크박스 스타일 */}
                </label>
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
                  onClick={() => toggleSelectItem(item.id)}
                >
                  ×
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='right-section'>
          <div className='user-info-container'>
            <div className='user-info'>
              <div className='info-title'>구매자 정보</div>
              <div className='info-row'>
                <div className='info-label'>이름</div>
                <div className='info-content'>{userInfo.name}</div>
              </div>
              <div className='info-row'>
                <div className='info-label'>이메일</div>
                <div className='info-content'>{userInfo.email}</div>
              </div>
              <div className='info-row'>
                <div className='info-label'>연락처 번호</div>
                <div className='info-content'>{userInfo.phoneNumber}</div>
              </div>
            </div>
          </div>
          <div className='order-summary-container'>
            <div className='order-summary'>
              <div className='summary-title'>선택된 강좌 수</div>
              <div className='summary-row'>
                <div className='summary-content'>{selectedItems.length}</div>
                <div className='summary-label'> 개 강좌</div>
              </div>
              <div className='summary-row'>
                <div className='summary-label'>구매할 강좌 합계</div>
                <div className='summary-content'>
                  {selectedItems
                    .reduce((total, id) => {
                      const item = cartItems.find(item => item.id === id);
                      return item ? total + item.price : total;
                    }, 0)
                    .toLocaleString()}
                  원
                </div>
              </div>
              <button className='checkout-button'>결제하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
