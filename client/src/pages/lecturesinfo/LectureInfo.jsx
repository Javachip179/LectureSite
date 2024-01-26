import React, { useState, useEffect } from 'react';
import './style.scss';
import { NavLink } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { FaThumbsUp } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import LecturesTOC from './lecturesTOC/LecturesTOC';
import Comment from './comment/Comment.jsx';

const StarRatings = ({ rating }) => {
  const ratingToPercent = () => {
    const score = +rating * 20;
    return score + 1.5;
  };

  return (
    <div className='star-ratings'>
      <div
        className='star-ratings-fill space-x-2 text-lg'
        style={{ width: ratingToPercent() + '%' }}
      >
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <div className='star-ratings-base space-x-2 text-lg'>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
    </div>
  );
};

const LectureInfo = () => {
  const [activeNav, setActiveNav] = React.useState('lecturesInfo'); // 활성 네비게이션 상태

  const CommentData = {
    ratingsCount: 2267,
  };

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 위치가 443px를 초과했을 때만 isSticky를 true로 설정합니다.
      const shouldStick = window.scrollY > 350;
      setIsSticky(shouldStick);
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='lecture-info'>
      <div className='lecture-header'>
        <div className='lecture-course'>
          <div className='lecture-image'>
            <img
              src='https://cdn.inflearn.com/public/courses/331985/cover/f0501069-2139-4112-aafa-a9b3a2932860/331985-eng.png'
              alt='Course'
            />
          </div>
          <div className='lecture-title'>
            <p className='lecture-category'>
              백엔드 <FaChevronRight /> Node.js
            </p>
            <h3>
              [코드팩토리] [초급] NestJS REST API 백엔드 완전 정복 마스터 클래스
              - Part 1 NestJS Core
            </h3>
            <p className='lecture-instructor'>코드팩토리</p>
            <StarRatings rating={5.0} />
            <span>{CommentData.ratingsCount.toLocaleString()}개의 수강평</span>
            <div className='lecture-tag'>
              <span>#React</span>
              <span>#Node.js</span>
              <span>#원데이</span>
              <span>#MongoDB</span>
              <span>#Express</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`lecture-nav-menu ${isSticky ? 'sticky' : ''}`}>
        <div className='lecture-nav-container'>
          <a
            href='#lecturesInfo'
            className={`lecture-nav-list ${
              activeNav === 'lecturesInfo' ? 'active' : ''
            }`}
            onClick={() => setActiveNav('lecturesInfo')}
          >
            강의소개
          </a>
          <a
            href='#lecturesTOC'
            className={`lecture-nav-list ${
              activeNav === 'lecturesTOC' ? 'active' : ''
            }`}
            onClick={() => setActiveNav('lecturesTOC')}
          >
            커리큘럼
          </a>
          <a
            href='#comment'
            className={`lecture-nav-list ${
              activeNav === 'comment' ? 'active' : ''
            }`}
            onClick={() => setActiveNav('comment')}
          >
            수강평
          </a>
          <a
            href='#question'
            className={`lecture-nav-list ${
              activeNav === 'question' ? 'active' : ''
            }`}
            onClick={() => setActiveNav('question')}
          >
            Q&A
          </a>
        </div>
      </div>

      <div className='lecture-content'>
        <div className='lecture-left-wrapper'>
          <div className='lecture-explanation'>
            {/* 강의 설명 */}
            <h2>초급자를 위한 준비물</h2>
            <p>
              Next.js는 프론트엔드부터 서버까지 만들 수 있는 React 기반
              프레임워크입니다. 이제부터 사용하는 툴셋 개발에 가장합니다.
            </p>
            <div className='fixed-body'>
              <div className='fixed-body-title'>
                <p>
                  <FaThumbsUp />
                  <br />
                  이런 걸<br />
                  배워요 !
                </p>
              </div>
              <div className='fixed-body-list'>
                <p>
                  <FaCheck className='checkmark-icon' /> Node.js
                </p>
                <p>
                  <FaCheck className='checkmark-icon' />
                  AWS
                </p>
                <p>
                  <FaCheck className='checkmark-icon' /> Maria DB
                </p>
                <p>
                  <FaCheck className='checkmark-icon' /> React
                </p>
              </div>
            </div>
          </div>

          {/* 강사소개 */}
          <div className='lecture-instructor'>
            <div className='lecture-instructor-header'>
              <div class='instructor-intro'>
                <div class='instructor-header'>
                  안녕하세요
                  <br />
                  <span class='instructor-name'>강사이름</span>
                  <span class='suffix-text'>입니다.</span>
                </div>
              </div>

              <div className='instructor-image'>
                <img
                  src='https://cdn.inflearn.com/public/users/thumbnails/230375/184691e8-185e-477e-9daf-aa4edc5aac38'
                  alt='Instructor'
                />
              </div>
            </div>

            <div className='lecture-instructor-content'>
              <p className='instructor-title'>이메일</p>
              <p className='instructor-info'>gher53@naver.com</p>
              <p className='instructor-title'>프로젝트</p>
              <p className='instructor-info'>
                -온라인 교육 컨텐츠 운영
                <br />
                -오늘의 영화 추천 서비스
                <br />
                -카드 맞추기 게임
              </p>
              <p className='instructor-title'>강사소개</p>
              <p className='instructor-info'>
                한층 더 성장하고 싶으신가요?
                <br />
                기술들이 실무에서는 어떻게 쓰이는 지 궁금하신가요?
                <br />
                각각의 패키지와 라이브러리는 하나의 도구에 불과합니다.
                <br />
                시니어 개발자로 성장하기 위해선 '왜' 라는 질문이 정말 중요해요.
              </p>
            </div>
          </div>
          <div id='lecturesTOC'>
            <LecturesTOC />
          </div>
          <div id='comment'>
            <Comment />
          </div>
        </div>

        <div className='lecture-right-wrapper'>
          <div className='card'>
            <div className='card-header'>가격</div>
            <div className='card-body'>
              <button className='btn btn-primary'>수강 신청</button>
              <button className='btn btn-secondary'>장바구니 추가</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureInfo;
