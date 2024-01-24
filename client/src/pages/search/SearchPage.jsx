import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import { Search } from '@mui/icons-material';
import Banner from '../../img/s_banner.png';

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

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseCount, setCourseCount] = useState(0);
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const fetchCourses = async () => {
    const results = 4;
    setCourseCount(results);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = () => {
    console.log('검색 쿼리:', searchQuery);
    fetchCourses();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const CategoryTabs = () => {
    const categories = [
      'Node.js',
      'MongoDB',
      'Express',
      'React',
      'JavaScript',
      'MySQL',
      'Redux',
      '일반',
      'AWS',
      'REST API',
      'IoT',
      'Socket.io',
      'JWT',
      'IONIC',
    ];

    const moreCategories = ['PostgreSQL', 'Docker', 'C#', '하이브리드 앱'];

    return (
      <div className='category-tabs'>
        {categories.map(category => (
          <button key={category}>{category}</button>
        ))}
        {showMore &&
          moreCategories.map(category => (
            <button key={category}>{category}</button>
          ))}
        <button onClick={toggleShowMore} className='category-toggle'>
          {showMore ? '▲' : '▼'}
        </button>
      </div>
    );
  };

  return (
    <div className='search-page-wrapper'>
      <div className='search-page-container'>
        <img className='banner-container' src={Banner} alt='banner' />
      </div>

      <div className='search-content'>
        <h3>검색 강의</h3>
        <div className='search-header'>
          <div className='search-top-row'>
            <div className='search-results-count'>
              "{searchQuery}"에 대한 강의 결과 ({courseCount}개)
            </div>
            <div className='search-bar'>
              <input
                type='text'
                placeholder='검색어 입력'
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button onClick={handleSearch}>
                <Search />
              </button>
            </div>
          </div>
          <CategoryTabs />
        </div>

        <div className='search-courses'>
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
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
