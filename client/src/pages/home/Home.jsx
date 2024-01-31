import './style.scss';
import Banner from '../../img/banner.png';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MainAPI } from '../../apis/mainApi.tsx';
import React, { useEffect, useState } from 'react';

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
  const nav = useNavigate();
  const [popularLecture, setPopularCourses] = useState([]);
  const [newLecture, setNewCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 서버에서 데이터 가져오기
        const response = await MainAPI();
        if (response && response.data) {
          // response.data가 존재하는지 확인

          // 데이터를 상태에 설정
          setPopularCourses(response.data.popularLecture);
          setNewCourses(response.data.newLecture);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = lectureID => {
    nav(`/lecture/${lectureID}`);
  };

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
        <h1>따끈따끈, 신규 강의 🆕</h1>
        <p>새로운 흥미를 찾아 보세요</p>
        <div className='new-courses'>
          {newLecture.map(course => (
            <div
              className='card'
              key={course.LectureID}
              onClick={() => handleSubmit(course.LectureID)}
            >
              <img
                className='card-image'
                src={course.LectureImageURL}
                alt='Course'
              />
              <div className='card-content'>
                <h2 className='card-title'>{course.Title}</h2>
                <p className='card-instructor'>{course.InstructorName}</p>
                <p className='card-price'>{`₩${course.LecturePrice}`}</p>
                <StarRatings rating={course.AverageRating} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1>유료강의보다 좋은 인기 강의 👍</h1>
      <p>무료 강의부터 가볍게 시작해 보세요.</p>
      <div className='popular-courses'>
        {popularLecture.map(course => (
          <div
            className='card'
            key={course.LectureID}
            onClick={() => handleSubmit(course.LectureID)}
          >
            <img
              className='card-image'
              src={course.LectureImageURL}
              alt='Course'
            />
            <div className='card-content'>
              <h2 className='card-title'>{course.Title}</h2>
              <p className='card-instructor'>{course.InstructorName}</p>
              <p className='card-price'>{`${course.PriceDisplay}`}</p>
              <StarRatings rating={course.AverageRating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
