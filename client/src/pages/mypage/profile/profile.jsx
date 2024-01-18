import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink 컴포넌트를 임포트합니다.
import './style.scss';

const Profile = ({ name, email, onChangePicture }) => {
  return (
    <div className='profile-container'>
      <div className='profile-picture'>
        {/* 프로필 사진 자리 */}
        <div className='picture-placeholder'></div>
        <button onClick={onChangePicture}>프로필 사진 변경</button>
      </div>
      <div className='user-info'>
        <div className='name'>{name}</div>
        <div className='email'>{email}</div>
      </div>
    </div>
  );
};

export default Profile;
