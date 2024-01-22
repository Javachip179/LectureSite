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
        <Link to='/search'>
          <button className='search-button'>
            <Search />
          </button>
        </Link>
      </div>

      <div className='card-container'>
        <h5>따끈따끈, 신규 강의 🆕</h5>
        <p>새로운 흥미를 찾아 보세요</p>
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

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/324566/cover/aa1fac55-6e80-4506-9c92-f32c2b65f93a/sql_basic.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [백문이불여일타] 데이터 분석을 위한 기초 SQL
              </h2>
              <p className='card-instructor'>데이터리안</p>
              <p className='card-price'>₩16,500</p>
              <StarRatings rating={5.0} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/324082/cover/57af93de-1021-40b4-80d7-a0dfc17190cf/324082.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                파이썬입문과 크롤링기초 부트캠프 [파이썬, 웹, 데이터 이해
                기본까지] (업데이트)
              </h2>
              <p className='card-instructor'>잔재미코딩</p>
              <p className='card-price'>₩55,000</p>
              <StarRatings rating={5.0} />
            </div>
          </div>
        </div>

        <h5>유료강의보다 좋은 인기 강의 👍</h5>
        <p>무료 강의부터 가볍게 시작해 보세요.</p>
        <hr />
        <div className='popular-courses'>
          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/332523/cover/2653d194-99a7-437d-96a3-cd787c875473/332523-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [인프런] 프로덕트 디자인 밋업 (with 강영화)
              </h2>
              <p className='card-instructor'>인프런</p>
              <p className='card-price'>무료!!</p>
              <StarRatings rating={4.7} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/326716/cover/e4917b63-2f4e-4607-953a-b1cdf8bb1a67/326716-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                [백문이불여일타] 데이터 분석을 위한 SQL 실전편 (무료 미니 코스)
              </h2>
              <p className='card-instructor'>데이터리안</p>
              <p className='card-price'>무료!!</p>
              <StarRatings rating={4.3} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/course-324063-cover/3c856a69-e213-4394-8317-1469386b82cc'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>웹 게임을 만들며 배우는 React</h2>
              <p className='card-instructor'>조현영</p>
              <p className='card-price'>무료!!</p>
              <StarRatings rating={4.7} />
            </div>
          </div>

          <div className='card'>
            <img
              className='card-image'
              src='https://cdn.inflearn.com/public/courses/325630/cover/56f635a3-3a44-4096-a16b-453ea1696b1a/325630-eng.png'
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>
                스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술
              </h2>
              <p className='card-instructor'>김영한</p>
              <p className='card-price'>무료!!</p>
              <StarRatings rating={4.3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
