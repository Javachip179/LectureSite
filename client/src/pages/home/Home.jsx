import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import Banner from '../../img/banner.png';
import { Search } from '@mui/icons-material';

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

const Home = () => {
  return (
    <div className='home'>
      <img className='banner-image' src={Banner} alt='banner' />

      <div className='search-container'>
        <input
          type='text'
          placeholder='강의를 검색해보세요'
          className='search-input'
        />
        <button className='search-button'>
          <Search />
        </button>
      </div>

      <div className='card-container'>
        <h5>따끈따끈, 신규 강의 🆕</h5>
        <hr />
        <div className='new-courses'>
          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [코드캠프] 부트캠프에서 만든 고농축 프론트엔드 코스
              </h2>
              <p className='card-instructor'>코드캠프</p>
              <p className='card-price'>₩396,000</p>
              <StarRatings rating={4.6} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/331985/cover/f0501069-2139-4112-aafa-a9b3a2932860/331985-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [코드팩토리] [초급] NestJS REST API 백엔드 완전 정복 마스터
                클래스 - Part 1 NestJS Core
              </h2>
              <p className='card-instructor'>코드팩토리</p>
              <p className='card-price'>₩66,000</p>
              <StarRatings rating={5.0} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/326905/cover/739f7b4b-1a9f-478f-a6a8-1a13bf58cae3/326905-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [리액트 1부] 만들고 비교하며 학습하는 리액트 (React)
              </h2>
              <p className='card-instructor'>김정환</p>
              <p className='card-price'>₩55,000</p>
              <StarRatings rating={4.8} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/329593/cover/77a56ae8-9bfd-47c4-854f-df8f6dc8ac47/329593-eng.jpg'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [게임 프로그래머 입문 올인원] C++ & 자료구조/알고리즘 & STL &
                게임 수학 & Windows API & 게임 서버
              </h2>
              <p className='card-instructor'>Rookiss</p>
              <p className='card-price'>₩79,200</p>
              <StarRatings rating={5.0} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/326174/cover/b0536120-7de3-4aa8-8266-97cf3881e87d'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                비전공자를 위한 진짜 입문 올인원 개발 부트캠프
              </h2>
              <p className='card-instructor'>그랩</p>
              <p className='card-price'>₩48,000</p>
              <StarRatings rating={5.0} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/330981/cover/902f03c3-a5f3-4d4b-a24f-9608edc6d17c/330981-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>처음 만난 리덕스(Redux)</h2>
              <p className='card-instructor'>Inje Lee (소플)</p>
              <p className='card-price'>₩74,250</p>
              <StarRatings rating={5.0} />
            </div>
          </div>
        </div>

        <h5>유료강의보다 좋은 인기 강의 👍</h5>
        <hr />
        <div className='popular-course-special'>
          <div className='emoji'>😊</div>
          <div className='message'>
            내 첫 커리어의 시작을 고민하고 있다면? 인기 강의에서 찾아보기.
          </div>
          <button className='button'>전체 보기</button>
        </div>
        <div className='popular-courses'>
          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/326368/cover/7b26110e-1eab-4ab6-8d9c-82381a5afd3d/KakaoTalk_Photo_2021-05-26-22-29-45.jpeg'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                mongoDB 기초부터 실무까지(feat. Node.js)
              </h2>
              <p className='card-instructor'>김시훈</p>
              <p className='card-price'>₩57,750</p>
              <StarRatings rating={4.7} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/332857/cover/0a28850c-f109-492a-baac-43277dc58ebd/332857.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                딥러닝 이론 + PyTorch 실무 완전 정복
              </h2>
              <p className='card-instructor'>변정현</p>
              <p className='card-price'>₩199,430</p>
              <StarRatings rating={4.3} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/325240/course_cover/d5d7e9a9-2d6f-4a81-84da-5e9cde3f39a4/nodereactecommerce-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                따라하며 배우는 노드, 리액트 시리즈 - 쇼핑몰 사이트 만들기[전체
                리뉴얼]
              </h2>
              <p className='card-instructor'>John Ahn</p>
              <p className='card-price'>₩33,000</p>
              <StarRatings rating={4.7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
