import { Link, useNavigate } from 'react-router-dom'; //
import React, { useState, useEffect, useContext } from 'react';
import ITTLogo from '../../img/allitone.png';
import './style.scss';
import SignIn from '../../pages/auth/signIn/SignIn';
import { Search } from '@mui/icons-material';
import { AuthContext } from '../../context/authContext.js';
import axios from 'axios';
import { baseUrl } from '../../config/baseUrl.js';
import Cookies from 'js-cookie';
import UserIcon from '../../img/defaultProfileImage.png';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchWord, setSearchWord] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate(); // useNavigate 사용

  useEffect(() => {
    const token = Cookies.get('userToken');
    setIsLoggedIn(!!token);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/categories/all`, {
          withCredentials: true,
        });
        setCategoryData(response.data);
      } catch (error) {
        console.error('강의 정보를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('로그아웃');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };
  const onInputChange = e => {
    const newSearchWord = e.target.value;
    setSearchWord(newSearchWord);
  };

  const onSearchHandler = async e => {
    e.preventDefault();
    navigate('/search', { state: { searchWord: searchWord } });
  };

  const onCategoryHandler = async (categoryId, categoryName) => {
    navigate('/lectureList', {
      state: { categoryID: categoryId, categoryName: categoryName },
    });
  };

  const onLogoClick = () => {
    setSearchWord('');
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
            {categoryData &&
              categoryData.map(
                (
                  category // categoryData가 존재할 때만 map을 실행합니다.
                ) => (
                  <div
                    key={category.CategoryID} // key prop을 추가하여 React 리스트 렌더링 성능 최적화
                    className='dropdown-title'
                    onClick={() =>
                      onCategoryHandler(
                        category.CategoryID,
                        category.CategoryName
                      )
                    }
                  >
                    {category.CategoryName}
                  </div>
                )
              )}
          </div>
        </div>

        <div className='search-bar'>
          <input
            type='text'
            placeholder=' '
            value={searchWord || ''}
            onChange={onInputChange}
          />
          <button onClick={onSearchHandler}>
            <Search />
          </button>
        </div>

        <div className='links'>
          {isLoggedIn ? (
            <>
              <button className='cart-button' onClick={() => navigate('/cart')}>
                <FaShoppingCart />
              </button>
              <button
                className='profile'
                onMouseEnter={toggleProfileDropdown}
                onMouseLeave={closeProfileDropdown}
              >
                <img src={UserIcon} alt='프로필 이미지' className='usericon' />
                {isProfileDropdownOpen && (
                  <div className='profile-dropdown'>
                    <div className='user-info'>
                      <div className='dropdown-profile-container'>
                        {currentUser && currentUser.ProfileImage !== null ? (
                          <img
                            src={currentUser.ProfileImage}
                            alt='프로필 이미지'
                            className='user-profile-image'
                          />
                        ) : (
                          <img
                            src={UserIcon}
                            alt='프로필 이미지'
                            className='user-profile-image'
                          />
                        )}
                        {currentUser && (
                          <div className='dropdown-profile-info'>
                            <p className='dropdown-profile-nickname'>
                              {currentUser.UserName}
                            </p>
                            <p className='dropdown-profile-email'>
                              {currentUser.UserEmail}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link to='/mypage' className='dropdown-item'>
                      마이페이지
                    </Link>
                    <hr className='dropdown-hr' />
                    <button className='dropdown-item' onClick={handleLogout}>
                      로그아웃
                    </button>
                  </div>
                )}
              </button>
            </>
          ) : (
            <>
              <div className='in-link' onClick={openModal}>
                <h6 className='header-text'>로그인</h6>
              </div>
              <Link className='up-link' onClick={() => navigate('/signUp')}>
                <h6 className='header-text'>회원가입</h6>
              </Link>
            </>
          )}
        </div>
      </div>
      {isModalOpen && <div className='modal-overlay' onClick={closeModal} />}
      {isModalOpen && <SignIn closeModal={closeModal} />}
    </div>
  );
};

export default Header;