import React, { useState } from 'react';
import '../auth/Modal.scss';
import kakao from '../../img/kklogin.png';

const Modal = ({ isOpen, onClose }) => {
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className='modal-overlay' onClick={handleOverlayClick}>
          <div className='modal-content'>
            <button className='close-button' onClick={onClose}>
              &times;
            </button>
            <h1>로그인</h1>
            {/* Add your login form components here */}

            <div className='login-box'>
              <form className='email-login'>
                <div className='u-form-group'>
                  <input type='email' placeholder='Email' />
                </div>
                <div className='u-form-group'>
                  <input type='password' placeholder='Password' />
                </div>
                <div className='u-form-group'>
                  <button>로그인</button>
                </div>
                <div className='u-form-group'>
                  <button>
                    <img src={kakao} alt='kakao' />
                  </button>
                </div>

                <div className='u-form-group'>
                  <a href='#' className='forgot-password'>
                    집 나간 비밀번호 찾기
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
