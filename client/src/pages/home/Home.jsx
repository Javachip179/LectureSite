import './style.scss';
import Banner from '../../img/banner.png';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MainAPI } from '../../apis/mainApi.tsx';
import React, { useEffect, useState } from 'react';

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
      </div>
      <div className='star-ratings-base space-x-2 text-lg'>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
        <span>
          <FaStar />
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const nav = useNavigate();
  const [freeLecture, setFreeCourses] = useState([]);
  const [newLecture, setNewCourses] = useState([]);
  const [popularLecture, setPopularCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 서버에서 데이터 가져오기
        const response = await MainAPI();
        if (response && response.data) {
          // response.data가 존재하는지 확인

          // 데이터를 상태에 설정
          setPopularCourses(response.data.popularLecture);
          setFreeCourses(response.data.freeLecture);
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
    nav(`/lecturesinfo/${lectureID}`);
  };

  return (
    <div className='home'>
      <img className='banner-image' src={Banner} alt='banner' />
      <div className='home-container'>
        <div className='card-container'>
          <h1>올잇원 인기 강의 🔥</h1>
          <p>올잇원 수강생들이 인정한 최고의 강의</p>
          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={6}
            navigation
            onSlideChange={() => console.log('slide change')}
            onSwiper={swiper => console.log(swiper)}
          >
            {popularLecture.map(course => (
              <SwiperSlide
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
              </SwiperSlide>
            ))}
          </Swiper>

          <h1>유료강의보다 좋은 무료 강의 👍</h1>
          <p>무료 강의부터 가볍게 시작해 보세요.</p>
          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={6}
            navigation
            onSlideChange={() => console.log('slide change')}
            onSwiper={swiper => console.log(swiper)}
          >
            {freeLecture.map(course => (
              <SwiperSlide
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
              </SwiperSlide>
            ))}
          </Swiper>

          <h1>따끈따끈, 신규 강의 🆕</h1>
          <p>새로운 흥미를 찾아 보세요</p>
          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={6}
            navigation
            onSlideChange={() => console.log('slide change')}
            onSwiper={swiper => console.log(swiper)}
          >
            {newLecture.map(course => (
              <SwiperSlide
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Home;
