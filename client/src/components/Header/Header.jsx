import { Link, useNavigate } from 'react-router-dom'; //
import React, { useState, useEffect } from 'react';
import ITTLogo from '../../img/allitone.png';
import './style.scss';
import SignIn from '../../pages/auth/signIn/SignIn';
import { Search } from '@mui/icons-material';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // useNavigate 사용

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  const handleSearch = () => {
    // 검색 버튼 클릭 또는 엔터 키를 눌렀을 때 실행되는 검색 함수
    // 검색 쿼리(searchQuery)를 사용하여 검색 기능을 구현할 수 있습니다.
    console.log('검색 쿼리:', searchQuery);

    // '/search' 페이지로 이동
    navigate(`/search?query=${searchQuery}`);
  };

  const handleSearchInputChange = event => {
    // 검색 입력란의 내용이 변경될 때마다 호출되는 함수
    setSearchQuery(event.target.value);
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

        <div className='search-bar'>
          <input
            type='text'
            placeholder=' '
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearch}>
            <Search />
          </button>
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
