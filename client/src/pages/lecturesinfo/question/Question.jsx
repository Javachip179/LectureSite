import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../../config/baseUrl.js';
import jsCookie from 'js-cookie';
import { AuthContext } from '../../../context/authContext.js';
import DefaultImage from '../../../img/defaultProfileImage.png';

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

const Question = () => {
  const [lectureData, setLectureData] = useState({});
  const [tocData, setTocData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [commentData, setCommentData] = useState({});
  const [menuStates, setMenuStates] = useState({});
  const { lectureID } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrollment, setIsEnrollment] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const topLevelMenus = tocData.filter(menu => menu.ParentTOCID === null);

    // 동적으로 상태 생성
    const initialState = {};
    topLevelMenus.forEach((menu, index) => {
      initialState[`menu${index + 1}Open`] = index === 0;
    });

    setMenuStates(initialState);
  }, [tocData]);

  useEffect(() => {
    const token = jsCookie.get('userToken');
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/lecture/${lectureID}`,
          {
            withCredentials: true,
          }
        );

        setLectureData(response.data.lecture);
        setTocData(response.data.toc);
        setCategoryData(response.data.categories);
        setCommentData(response.data.comments);
        console.log('questions Data:', response.data.question);
      } catch (error) {
        console.error('강의 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cart/cartlist/check`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            lectureId: lectureID,
          },
        });

        // console.log("cart API 응답:", response);

        if (response.data) {
          setIsInCart(true);
        } else {
          setIsInCart(false);
        }
      } catch (error) {
        console.error('API 호출 중 오류:', error);
      }
    };

    fetchCart();

    const fetchEnrollment = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/enrollment/checked/${lectureID}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("enroll API 응답:", response);

        setIsEnrollment(response.data);
      } catch (error) {
        console.error('API 호출 중 오류:', error);
      }
    };

    fetchEnrollment();
  }, []);

  // console.log("isInCart:", isInCart);
  // console.log("isEnrollment", isEnrollment);

  const createToggleFunction = menuIndex => {
    return () => {
      setMenuStates(prevStates => {
        const updatedStates = { ...prevStates };
        updatedStates[`menu${menuIndex + 1}Open`] =
          !prevStates[`menu${menuIndex + 1}Open`];
        return updatedStates;
      });
    };
  };

  const handleScrollToSection = sectionId => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calculateAverageRating = () => {
    if (
      !commentData ||
      !Array.isArray(commentData) ||
      commentData.length === 0
    ) {
      return 0;
    }

    const totalRating = commentData.reduce((sum, comment) => {
      return sum + comment.Rating;
    }, 0);

    const averageRating = totalRating / commentData.length;
    return averageRating;
  };

  const averageRating = calculateAverageRating();

  const watchLectureHandler = lectureID => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
    } else {
      navigate(`/watchlecture/${lectureID}`);
    }
  };

  const LectureEnrollHandler = async () => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
    } else {
      try {
        const token = jsCookie.get('userToken');
        await axios.post(
          `${baseUrl}/api/enrollment`,
          { lectureId: lectureID }, // 수정된 부분
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 결제하기

        setIsEnrollment(true);
      } catch (error) {
        console.error('API 호출 중 오류:', error);
      }
    }
  };

  const addToCartHandler = async () => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
    } else {
      try {
        const token = jsCookie.get('userToken');

        // 이미 장바구니에 담겨있는지 확인
        if (isInCart) {
          alert('이미 장바구니에 담겨있습니다.');
        } else if (isEnrollment) {
          alert('이미 수강한 강의입니다.');
        } else {
          // 장바구니에 담기
          await axios.post(
            `${baseUrl}/api/cart/add-lecture`,
            {
              LectureID: lectureID,
            },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIsInCart(true);
          alert('장바구니에 강의를 추가했습니다.');
        }
      } catch (error) {
        console.error('API 호출 중 오류:', error);
      }
    }
  };

  return (
    <div className='lecture'>
      <div className='lecture-container'></div>
      <hr className='lecture-hr' />

      <div className='lecture-details-container'></div>
    </div>
  );
};

export default Question;
