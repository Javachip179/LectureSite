import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Banner from '../../img/s_banner.png';
import './style.scss';
import { baseUrl } from '../../config/baseUrl';
import { FaStar } from 'react-icons/fa';

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

const LectureList = () => {
  const [lectureListData, setLectureListData] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // 서브 카테고리 데이터를 위한 상태 추가
  const location = useLocation();
  const nav = useNavigate();

  // 여기서 state 객체를 통해 전달된 값을 추출합니다.
  const { SubcategoryID, SubcategoryName, CategoryName, CategoryID } =
    location.state || {};

  // 서브 카테고리 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/subcategories`);
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    console.log('SubcategoryID:', subcategories);
    fetchSubcategories();
  }, []);

  useEffect(() => {
    // 서버로부터 강의 목록을 가져오는 함수
    const fetchLectures = async () => {
      try {
        // 서브카테고리 ID를 사용하여 API 호출
        const response = await axios.get(
          `${baseUrl}/api/categories/lectures/${SubcategoryID}`
        );
        console.log('강의 리스트 데이터:', response.data); // API 응답 데이터를 콘솔에 로깅
        setLectureListData(response.data); // 결과를 상태에 저장
      } catch (error) {
        console.error('강의 리스트 가져오는 중 오류 발생:', error);
      }
    };

    if (SubcategoryID) {
      fetchLectures(); // 서브카테고리 ID가 있을 때만 함수 호출
    }
  }, [SubcategoryID]);

  const handleSelectSubcategory = async SubcategoryID => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/categories/lectures/${SubcategoryID}`
      );
      setLectureListData(response.data);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const handleSubmit = lectureID => {
    nav(`/lecturesinfo/${lectureID}`);
  };

  // 강의 목록 렌더링
  return (
    <div className='lecture-list'>
      <div className='wrapper-container'>
        <div className='left-wrapper'>
          <div className='left-wrapper-container'>
            <img className='banner-image' src={Banner} alt='banner' />
          </div>
        </div>

        <div className='right-wrapper'>
          <div className='right-wrapper-container'>
            <h3 className='category-title'>
              {CategoryName} / {SubcategoryName}
            </h3>

            <div className='category-buttons'>
              {subcategories.map(subcategory => (
                <button
                  key={subcategory.SubcategoryID}
                  onClick={() =>
                    handleSelectSubcategory(subcategory.SubcategoryID)
                  }
                >
                  {subcategory.SubcategoryName}
                </button>
              ))}
            </div>

            <div className='card-courses'>
              {lectureListData && lectureListData.length > 0 ? (
                lectureListData.map(course => (
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
                ))
              ) : (
                <div>해당 카테고리에 대한 강의가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureList;