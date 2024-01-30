import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Banner from '../../img/banner.png';
import './style.scss';
import { baseUrl } from '../../config/baseUrl';

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
      <h2>{SubcategoryName} 강의 목록</h2>
      <div className='lectures'>
        {lectureListData.length > 0 ? (
          lectureListData.map(lecture => (
            <div key={lecture.id} className='lecture'>
              {/* 강의 정보 렌더링 */}
            </div>
          ))
        ) : (
          <p>해당 카테고리의 강의가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default LectureList;