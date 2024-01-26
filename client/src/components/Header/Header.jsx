import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ITTLogo from '../../img/allitone.png';
import './style.scss';
import SignIn from '../../pages/auth/signIn/SignIn';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  useEffect(() => {
    const handleScroll = () => {
      // window.scrollY는 수직으로 얼마나 스크롤 되었는지를 반환합니다.
      // 헤더의 높이보다 더 스크롤 되었다면, 헤더를 고정시키기 위해 isSticky를 true로 설정합니다.
      setIsSticky(window.scrollY > 0);
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={isSticky ? 'header sticky' : 'header'}>
      <div className='container'>
        <div className='logo-container'>
          <Link to='/'>
            <div className='logo'>
              <img src={ITTLogo} alt='YouGotIT 로고' />
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
          <div className='in-link' onClick={toggleSignIn}>
            <h6 className='header-text'>로그인</h6>
          </div>
          <Link className='up-link' to='/signUp'>
            <h6 className='header-text'>회원가입</h6>
          </Link>
        </div>
      </div>
      {showSignIn && <SignIn toggleSignIn={toggleSignIn} />}
    </div>
  );
};

export default Header;
