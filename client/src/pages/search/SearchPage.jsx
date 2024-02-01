import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import Banner from '../../img/s_banner.png';
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

const SearchPage = () => {
  const location = useLocation();
  const searchWord = location.state?.searchWord;
  const [searchData, setSearchData] = useState(null);
  const nav = useNavigate();
  const [subCategories, setSubCategories] = useState([]);

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
        console.log(searchWord);
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
      <img className='banner-image' src={Banner} alt='banner' />
      <div className='subcategories-container'>
        {subCategories.map(subCategory => (
          <button
            key={subCategory.SubcategoryID}
            onClick={() =>
              onSubCategoryClick(
                subCategory.SubcategoryID,
                subCategory.SubcategoryName,
                subCategory.CategoryName
              )
            }
          >
            {subCategory.SubcategoryName}
          </button>
        ))}
      </div>
      <h1>전체 강의</h1>
      <div className='card-container'>
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
                <p className='card-price'>{`₩${course.LecturePrice}`}</p>
                <StarRatings rating={course.AverageRating} />
              </div>
            </div>
          ))
        ) : (
          <div>검색 강의에 대한 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
