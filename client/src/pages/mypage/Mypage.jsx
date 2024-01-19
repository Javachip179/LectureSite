import React from 'react';
import './style.scss'; // SCSS 스타일 파일을 포함시킵니다.
import profileimage from '../../img/it.png'; // 프로필 이미지를 포함시킵니다.
import { NavLink } from 'react-router-dom';
import { MdPlayCircleOutline } from 'react-icons/md';

const MyPage = () => {
  // 강의 데이터와 진행률을 포함한 하드코딩된 데이터
  const courses = [
    {
      id: 1, // 고유한 강의 ID 추가
      name: '[코드캠프] 부트캠프에서 만든 고농축 프론트엔드 코스',
      progress: 25, // 진행률 예시
      image:
        'https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png',
    },
    {
      id: 2, // 고유한 강의 ID 추가
      name: '[코드팩토리] [초급] NestJS REST API 백엔드 완전 정복 마스터 클래스 - Part 1 NestJS Core',
      progress: 100, // 진행률 예시
      image:
        'https://cdn.inflearn.com/public/courses/331985/cover/f0501069-2139-4112-aafa-a9b3a2932860/331985-eng.png',
    },
    // 추가 강의 데이터를 여기에 삽입하세요.
  ];

  // 동영상 시청 함수
  const watchVideo = courseId => {
    console.log(`Playing video for course ID: ${courseId}`);
    // 여기에 동영상 재생 로직을 구현합니다.
  };

  return (
    <div className='profile-page'>
      <header className='profile-header'>
        <img src={profileimage} alt='Profile' className='profile-pic' />
        <h1 className='profile-name'>이종호 님</h1>{' '}
        {/* 사용자의 이름을 표시하세요. */}
      </header>

      <nav className='profile-nav'>
        <ul>
          <li>
            <NavLink to='/mypage' activeClassName='active'>
              내 강의
            </NavLink>
          </li>
          <li>
            <NavLink to='/profile' activeClassName='active'>
              프로필
            </NavLink>
          </li>
          <li>
            <NavLink to='/payment' activeClassName='active'>
              결제내역
            </NavLink>
          </li>
        </ul>
      </nav>

      <h2 className='course-list-title'>수강중인 강좌</h2>

      <div className='course-list'>
        {courses.map((course, index) => (
          <div key={index} className='course'>
            <img
              src={course.image}
              alt={course.name}
              className='course-image'
            />
            <div className='course-info'>
              <h2 className='course-title'>{course.name}</h2>
              <div className='course-progress'>
                <span>진행률: {course.progress}%</span>
                <div className='progress-bar-background'>
                  <div
                    className={`progress-bar-fill ${
                      course.progress === 100 ? 'full' : ''
                    }`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button
              className='watch-video-button'
              onClick={() => watchVideo(course.id)}
            >
              <MdPlayCircleOutline className='play-icon' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
