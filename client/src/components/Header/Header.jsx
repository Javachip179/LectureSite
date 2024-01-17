import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ITLogo from '../../img/it.png';
import './style.scss';

const Header = () => {
  return (
    <div className='header'>
      <div className='container'>
        <div className='logo-container'>
          <Link to='/'>
            <div className='logo'>
              <img src={ITLogo} alt='YouGotIT 로고' />
            </div>
          </Link>
        </div>

        <div className='drop-down'>
          {/* 드랍다운 토글 버튼 */}
          <div className='dropdown-toggle'>강의</div>
          {/* 드랍다운 컨텐츠 */}
          <div className='dropdown-content'>
            <Link to='/page1'>프론트엔드</Link>
            <Link to='/page2'>백엔드</Link>
            <Link to='/page3'>파이썬</Link>
            <Link to='/page4'>리액트</Link>
          </div>
        </div>

        <div className='links'>
          <Link className='in-link' to='/signIn'>
            <h6 className='header-text'>로그인</h6>
          </Link>
          <Link className='up-link' to='/signUp'>
            <h6 className='header-text'>회원가입</h6>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
