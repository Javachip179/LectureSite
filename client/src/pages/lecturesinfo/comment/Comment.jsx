import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './style.scss';

const Comment = () => {
  const ratingValue = 4.9; // 평점 값, 실제 데이터와 연동되어야 합니다.
  const ratings = {
    5: 80, // 80%의 사람들이 5점을 줌
    4: 15, // 15%의 사람들이 4점을 줌
    3: 3, // 3%의 사람들이 3점을 줌
    2: 1, // 1%의 사람들이 2점을 줌
    1: 1, // 1%의 사람들이 1점을 줌
  };

  return (
    <div className='lecture-comment'>
      <div className='comment-title'>
        수강평
        <span className='details'>총 N개의 수강평</span>
      </div>
      <div className='description'>수강생분들이 직접 작성한 수강평입니다.</div>
      <div className='comment-dashboard'>
        <div className='comment-dashboard-card'>
          <div className='rating-value'>{ratingValue}점</div>
          <div className='rating-stars'>
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`star ${i < ratingValue ? 'filled' : ''}`}
              />
            ))}
          </div>
        </div>
        <div className='comment-dashboard-graph'>
          {Object.entries(ratings)
            .reverse()
            .map(([key, value]) => (
              <div key={key} className='rating-bar'>
                <span className='rating-number'>{key}점</span>
                <div className='rating-line-background'>
                  <div
                    className='rating-line-foreground'
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className='comment-list'>
        <div className='comment-item'>
          <div className='comment-user'>
            <img
              src='/path/to/user/avatar.png'
              alt='User Avatar'
              className='user-avatar'
            />
            <div className='user-name'>Javachip179</div>
          </div>
          <div className='comment-rating'>
            <div className='rating-stars'>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`star ${i < 4 ? 'filled' : ''}`} />
              ))}
            </div>
            <div className='comment-date'>2024-01-02</div>
          </div>
          <div className='comment-text'>잘못된게 너무 많아서 힘들었습니다.</div>
        </div>
        <div className='comment-item'>
          <div className='comment-user'>
            <img
              src='/path/to/user/avatar.png'
              alt='User Avatar'
              className='user-avatar'
            />
            <div className='user-name'>Javachip179</div>
          </div>
          <div className='comment-rating'>
            <div className='rating-stars'>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`star ${i < 4 ? 'filled' : ''}`} />
              ))}
            </div>
            <div className='comment-date'>2024-01-02</div>
          </div>
          <div className='comment-text'>잘못된게 너무 많아서 힘들었습니다.</div>
        </div>
      </div>
      <div className='comment-more'>
        <button className='more-button'>수강평 더보기</button>
      </div>
    </div>
  );
};

export default Comment;
