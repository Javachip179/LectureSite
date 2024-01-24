import React from 'react';
import './style.scss';
import { NavLink } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { FaThumbsUp } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

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
  const CommentData = {
    ratingsCount: 2267,
  };

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

      <div className='lecture-nav-menu'>
        <div className='lecture-nav-container'>
          <span href='lecturesInfo' className='lecture-nav-list'>
            강의소개
          </span>
          <span href='./lecturesTOC' className='lecture-nav-list'>
            커리큘럼
          </span>
          <span href='./comment' className='lecture-nav-list'>
            수강평
          </span>
          <span href='./question' className='lecture-nav-list'>
            Q&A
          </span>
        </div>
      </div>

      <div className='lecture-content'>
        <div className='lecture-left-wrapper'>
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
