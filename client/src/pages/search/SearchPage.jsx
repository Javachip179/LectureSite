import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import Banner from '../../img/s_banner.png';
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

const SearchPage = () => {
  const location = useLocation();
  const searchWord = location.state?.searchWord;
  const [searchData, setSearchData] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('검색 요청을 보내는 중:', searchWord);
        const response = await axios.get(
          `${baseUrl}/api/search-list/${searchWord}`,
          {
            withCredentials: true,
            params: {
              searchWord: searchWord,
            },
          }
        );
        setSearchData(response.data);
        console.log('response.data123:  ', response.data);
      } catch (error) {
        console.error('검색 중 오류:', error);
      }
    };

    fetchData();
  }, [searchWord]);

  const onSubCategoryClick = (SubcategoryID, SubcategoryName, CategoryName) => {
    nav('/lectureList', {
      state: {
        SubcategoryID,
        SubcategoryName,
        CategoryName,
      },
    });
  };

  const handleSubmit = lectureID => {
    nav(`/lecturesinfo/${lectureID}`);
  };

  return (
    <div className='search'>
      <div className='wrapper-container'>
        <div className='left-wrapper'>
          <div className='left-wrapper-container'>
            <img className='banner-image' src={Banner} alt='banner' />
          </div>
        </div>

        <div className='right-wrapper'>
          <div className='right-wrapper-container'>
            {/* 검색된 강의 제목과 강의 갯수 표시 */}
            <h3 className='search-title'>전체 강의</h3>
            {searchData && searchData.length > 0 && (
              <div className='search-content'>
                "{searchWord}"에 대한 강의 결과 ({searchData.length})
              </div>
            )}
            <div className='card-courses'>
              {/* 검색 결과가 있으면 강의 카드를 표시하고, 없으면 안내 메시지를 표시 */}
              {searchData && searchData.length > 0 ? (
                searchData.map(course => (
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
                      <p className='card-price'>{course.PriceDisplay}</p>
                      <StarRatings rating={course.AverageRating} />
                    </div>
                  </div>
                ))
              ) : (
                <div>검색 강의에 대한 결과가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;