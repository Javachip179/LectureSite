import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Banner from '../../img/banner.png';
import './style.scss';
import { baseUrl } from '../../config/baseUrl';

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

const LectureList = () => {
  const [lectureListData, setLectureListData] = useState([]);
  const location = useLocation();
  // 여기서 state 객체를 통해 전달된 값을 추출합니다.
  const { SubcategoryID, SubcategoryName } = location.state || {};

  useEffect(() => {
    // 서버로부터 강의 목록을 가져오는 함수
    const fetchLectures = async () => {
      try {
        // 서브카테고리 ID를 사용하여 API 호출
        const response = await axios.get(
          `${baseUrl}/api/categories/lectures/${SubcategoryID}`
        );
        setLectureListData(response.data); // 결과를 상태에 저장
      } catch (error) {
        console.error('강의 리스트 가져오는 중 오류 발생:', error);
      }
    };

    if (SubcategoryID) {
      fetchLectures(); // 서브카테고리 ID가 있을 때만 함수 호출
    }
  }, [SubcategoryID]);

  // 강의 목록 렌더링
  return (
    <div className='lecture-list'>
      <img className='banner-image' src={Banner} alt='banner' />
      <h1>선택한 카테고리: {SubcategoryName} </h1>
      <div className='lectures-container'>
        {lectureListData && lectureListData.length > 0 ? (
          lectureListData.map(course => (
            <div className='card' key={course.LectureID}>
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
          ))
        ) : (
          <div>해당 카테고리에 대한 강의가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default LectureList;