import React, { useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaBars, FaTimes } from 'react-icons/fa';
import './style.scss';

const WatchLecture = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const videoId = 'giEx-MWao9A'; // 실제 YouTube 동영상 ID로 대체하세요.
  const iframeVideoUrl = `https://www.youtube.com/embed/${videoId}`;

  const [currentCourseIndex, setCurrentCourseIndex] = useState(1); // 현재 강의 인덱스
  const totalCourses = 10; // 전체 강의 수

  // 이전 강의로 이동하는 함수
  const goToPreviousCourse = () => {
    setCurrentCourseIndex(prev => (prev > 1 ? prev - 1 : prev));
  };

  // 다음 강의로 이동하는 함수
  const goToNextCourse = () => {
    setCurrentCourseIndex(prev => (prev < totalCourses ? prev + 1 : prev));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='video-container'>
      <div className='video-header'>
        <span className='video-title'>쉽게 넘어서 힘들어요 (강의 제목)</span>
        <FaBars className='menu-icon' onClick={toggleMenu} />
        {menuOpen && (
          <div className='menu-content'>
            <FaTimes className='menu-close' onClick={toggleMenu} />
            <ul>
              <li>커리큘럼</li>
              <li>수강평</li>
              <li>Q&A</li>
            </ul>
          </div>
        )}
      </div>
      <div className='video-player'>
        <iframe
          src={iframeVideoUrl}
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='Embedded YouTube Video'
        ></iframe>
      </div>
      <div className='video-footer'>
        <button className='back-button' onClick={goToPreviousCourse}>
          이전
        </button>
        <div className='course-indicator'>
          {currentCourseIndex} / {totalCourses}
        </div>
        <button className='next-button' onClick={goToNextCourse}>
          다음
        </button>
      </div>
    </div>
  );
};

export default WatchLecture;
