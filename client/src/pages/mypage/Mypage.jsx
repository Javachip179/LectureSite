import React, { useState, useEffect, useContext } from 'react'; // useEffect 추가
import './style.scss'; // SCSS 스타일 파일을 포함시킵니다.
import defaultProfileImage from '../../img/defaultProfileImage.png'; // 프로필 이미지를 포함시킵니다.
import { Link, useNavigate } from 'react-router-dom';
import Profile from './profile/profile';
import Payment from './payment/Payment';
import MyCourses from './mycourse/MyCourse';
import axios from 'axios';
import { baseUrl } from '../../config/baseUrl.js';
import jsCookie from 'js-cookie';
import { AuthContext } from '../../context/authContext.js';

const MyPage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState('수강중인 강의');
  const navigate = useNavigate();

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  return (
    <div className='profile-page'>
      <header className='profile-header'>
        <img
          src={currentUser.ProfileImage || defaultProfileImage}
          alt='Profile'
          className='profile-pic'
        />
        <h1 className='profile-name'>{currentUser.UserNickname}님</h1>{' '}
        {/* 사용자의 이름을 표시하세요. */}
      </header>

      <nav className='profile-nav'>
        <ul className='profile-list'>
          <li
            onClick={() => handleItemClick('수강중인 강의')}
            className={`list-group-item ${
              selectedItem === '수강중인 강의' && 'active'
            }`}
          >
            수강중인 강의
          </li>
          <li
            onClick={() => handleItemClick('프로필')}
            className={`list-group-item ${
              selectedItem === '프로필' && 'active'
            }`}
          >
            프로필
          </li>
          <li
            onClick={() => handleItemClick('결제내역')}
            className={`list-group-item ${
              selectedItem === '결제내역' && 'active'
            }`}
          >
            결제내역
          </li>
        </ul>
        <div className='vl'></div>
        <div className='profile-content-container'>
          {selectedItem === '수강중인 강의' && <MyCourses />}
          {selectedItem === '프로필' && <Profile />}
          {selectedItem === '결제내역' && <Payment />}
        </div>
      </nav>
    </div>
  );
};

export default MyPage;
