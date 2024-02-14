import { Link, useNavigate } from 'react-router-dom'; //
import React, { useState, useEffect, useContext } from 'react';
import ITTLogo from '../../img/allitone.png';
import './style.scss';
import SignIn from '../../pages/auth/signIn/SignIn';
import { GoSearch } from 'react-icons/go';
import { AuthContext } from '../../context/authContext.js';
import axios from 'axios';
import { baseUrl } from '../../config/baseUrl.js';
import Cookies from 'js-cookie';
import UserIcon from '../../img/defaultProfileImage.png';
import { BsCart4 } from 'react-icons/bs';
import { MdLogout, MdOutlineHomeWork } from 'react-icons/md';
const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchWord, setSearchWord] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const fetchSubCategories = async categoryId => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/categories/sub?categoryId=${categoryId}`,
        { withCredentials: true }
      );
      setSubCategories(prev => ({ ...prev, [categoryId]: response.data }));
    } catch (error) {
      console.error('서브 카테고리 정보를 불러오는 중 오류 발생:', error);
    }
  };

  // 메인 카테고리를 가져오는 함수
  const fetchMainCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/categories/all`, {
        withCredentials: true,
      });
      setCategoryData(response.data);
    } catch (error) {
      console.error('메인 카테고리 정보를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    // 토큰을 확인하여 로그인 상태를 설정합니다.
    const token = Cookies.get('userToken');
    setIsLoggedIn(!!token);

    // 메인 카테고리를 가져옵니다.
    fetchMainCategories();

    // 다른 의존성이나 상태에 따라 fetchSubCategories를 호출할 수도 있습니다.
  }, [isLoggedIn, currentUser]);

  console.log('커런트,유저', currentUser);

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

  const onSearchSubmit = e => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    if (searchWord) {
      navigate('/search', { state: { searchWord: searchWord } });
    }
  };

  const onSubCategoryHandler = async (
    SubcategoryID,
    SubcategoryName,
    CategoryName
  ) => {
    navigate('/lectureList', {
      state: {
        SubcategoryID: SubcategoryID,
        SubcategoryName: SubcategoryName,
        CategoryName: CategoryName,
      },
    });
  };

  const handleMouseEnterCategory = categoryId => {
    setActiveCategoryId(categoryId);
    fetchSubCategories(categoryId);
  };

  const handleMouseLeaveCategory = () => {
    setActiveCategoryId(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

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
          <div className='dropdown-toggle'>강의</div>
          <div className='dropdown-content'>
            {categoryData.map(category => (
              <div
                key={category.CategoryID}
                className='dropdown-title'
                onMouseEnter={() =>
                  handleMouseEnterCategory(category.CategoryID)
                }
                onMouseLeave={handleMouseLeaveCategory}
              >
                {category.CategoryName}
                {activeCategoryId === category.CategoryID &&
                  subCategories[category.CategoryID] && (
                    <div className='sub-dropdown-content'>
                      {subCategories[category.CategoryID].map(subCategory => (
                        <div
                          key={subCategory.SubcategoryID}
                          className='sub-dropdown-title'
                          onClick={() =>
                            onSubCategoryHandler(
                              subCategory.SubcategoryID,
                              subCategory.SubcategoryName,
                              category.CategoryName
                            )
                          }
                        >
                          {subCategory.SubcategoryName}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        <div className='search-bar'>
          <form onSubmit={onSearchSubmit}>
            <input
              type='text'
              placeholder=' '
              value={searchWord || ''}
              onChange={onInputChange}
            />
            <button
              className='search-button'
              type='submit'
              disabled={!searchWord}
            >
              <GoSearch />
            </button>
          </form>
        </div>

        <div className='links'>
          {isLoggedIn ? (
            <>
              <button className='cart-button' onClick={() => navigate('/cart')}>
                <BsCart4 />
              </button>
              <button
                className='profile'
                onMouseEnter={toggleProfileDropdown}
                onMouseLeave={closeProfileDropdown}
              >
                <img
                  src={currentUser.ProfileImage || UserIcon}
                  alt='프로필 이미지'
                  className='usericon'
                />
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
                            <div className='dropdown-profile-nickname'>
                              {currentUser.UserName}
                            </div>
                            <div className='dropdown-profile-email'>
                              {currentUser.UserEmail}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='dropdown-item'>
                      <Link to='/mypage' className='dropdown-mypage'>
                        <MdOutlineHomeWork />
                        마이페이지
                      </Link>
                      <button
                        className='dropdown-logout'
                        onClick={handleLogout}
                      >
                        <MdLogout />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </>
          ) : (
            <>
              <div className='buttons'>
                <button className='in-button' onClick={openModal}>
                  로그인
                </button>
                <button
                  className='up-button'
                  onClick={() => navigate('/signUp')}
                >
                  회원가입
                </button>
              </div>
            </>
          )}

          {isModalOpen && (
            <div className='modal-overlay' onClick={closeModal} />
          )}
          {isModalOpen && <SignIn closeModal={closeModal} />}
        </div>
      </div>
    </div>
  );
};

export default Header;