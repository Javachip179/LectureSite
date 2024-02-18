import React, { useState, useEffect } from 'react';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../../config/baseUrl';
import jsCookie from 'js-cookie';

const MyCourse = () => {
  const [mycourses, setMycourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(8); // 한 페이지에 표시할 강의 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get('userToken');

        const response = await axios.get(`${baseUrl}/api/userInfo/cours`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('서버로부터 받은 mycourses 데이터:', response.data);

        setMycourses(response.data);
      } catch (error) {
        console.error('프로필 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  const calculateProgressBarStyle = attendanceRate => {
    return { width: `${attendanceRate}%` };
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = mycourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // 페이지 버튼을 렌더링하는 함수
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(mycourses.length / coursesPerPage); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map(number => (
      <button
        key={number}
        onClick={() => paginate(number)}
        className={currentPage === number ? 'active' : ''}
      >
        {number}
      </button>
    ));
  };

  return (
    <>
      <div className='my-course'>
        <div className='my-course-content'>
          {currentCourses.map((course, index) => (
            <div key={index} className='course-card'>
              <img
                className='course-image'
                src={course.LectureImageURL}
                alt={course.Title}
              />
              <div className='course-info'>
                <div className='course-title'>{course.Title}</div>
                <div className='course-instructor'>{course.InstructorName}</div>
                <div className='progress-bar-container'>
                  <div
                    className='progress-bar'
                    style={calculateProgressBarStyle(course.AttendanceRate)}
                  ></div>
                  <div className='progress-text'>{course.AttendanceRate}%</div>
                </div>
              </div>
              <button className='watch-button'>이어서 학습하기</button>
            </div>
          ))}
        </div>
        <div className='pagination-container'>
          <div className='pagination'>{renderPageNumbers()}</div>
        </div>
      </div>
    </>
  );
};

export default MyCourse;
