import React, { useState, useEffect } from 'react';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../../config/baseUrl';
import jsCookie from 'js-cookie';
import profileimage from '../../../img/it.png'; // 프로필 이미지를 포함시킵니다.

const MyCourse = () => {
  const calculateProgressBarStyle = attendanceRate => {
    return {
      width: `${attendanceRate}%`,
    };
  };

  const [mycourses, setMycourses] = useState([]);

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

        setMycourses(response.data);
      } catch (error) {
        console.error('프로필 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='my-course'>
      {mycourses.map((course, index) => (
        <div key={index} className='my-course-card'>
          <img
            className='my-course-image'
            src={course.LectureImageURL}
            alt=''
          />
          <div className='my-course-title'>{course.LectureTitle}</div>
          <div className='progress-bar-container'>
            <div
              className='my-course-progress'
              style={calculateProgressBarStyle(course.AttendanceRate)}
            >
              {course.AttendanceRate}%
            </div>
          </div>
          <button className='btn btn-primary my-course-continue'>
            다시보기
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyCourse;
