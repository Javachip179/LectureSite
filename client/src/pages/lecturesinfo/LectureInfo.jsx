import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../config/baseUrl.js';
import jsCookie from 'js-cookie';
import { AuthContext } from '../../context/authContext.js';
import DefaultImage from '../../img/defaultProfileImage.png';
import Question from './question/Question.jsx';

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

const LectureInfo = () => {
  const [lectureData, setLectureData] = useState({});
  const [tocData, setTocData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [commentData, setCommentData] = useState({});
  const [menuStates, setMenuStates] = useState({});
  const { lectureID } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrollment, setIsEnrollment] = useState(false);
  const [selectedItem, setSelectedItem] = useState('강의소개');

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

  const scrollToSection = menuItem => {
    const sectionId = menuItemToSectionId(menuItem); // 메뉴 아이템 이름을 섹션의 id로 변환하는 함수
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

  const handleMenuClick = menuItem => {
    setSelectedItem(menuItem);
    scrollToSection(menuItem);
  };

  const menuItemToSectionId = menuItem => {
    switch (menuItem) {
      case '강의소개':
        return 'introduction';
      case '강사소개':
        return 'instructor';
      case '커리큘럼':
        return 'curriculum';
      case '수강평':
        return 'comment';
      default:
        return '';
    }
  };

  return (
    <div className='lecture'>
      <div className='lecture-container'>
        <div className='lecture-information'>
          {lectureData && lectureData.length > 0 && (
            <img
              className='lecture-image'
              src={lectureData[0].LectureImageURL || DefaultImage}
              alt='lecture'
            />
          )}

          <div className='lecture-information-details'>
            <div className='lecture-information-details'>
              <div className='lecture-category'>
                {categoryData &&
                  Object.keys(categoryData).map(key => (
                    <div key={key}>
                      <span>{categoryData[key].CategoryName}</span>
                      {categoryData[key].SubcategoryName && (
                        <span>·{categoryData[key].SubcategoryName}</span>
                      )}
                    </div>
                  ))}
              </div>

              <div className='lecture-title'>
                {lectureData.length > 0
                  ? lectureData[0].LectureTitle
                  : '강의 제목 없음'}
              </div>
            </div>

            <div className='lecture-rating-details'>
              <div className='lecture-rating'>
                <StarRatings rating={averageRating} />
              </div>
              <div className='lecture-rating-count'>
                {commentData.length > 0
                  ? `(${calculateAverageRating().toFixed(1)}점)`
                  : '(평점 정보 없음)'}
              </div>
            </div>
            <div className='lecture-instructor'>
              {lectureData && lectureData[0] && lectureData[0].InstructorName}
            </div>
            <div className='lecture-price'>
              {lectureData &&
                lectureData[0] &&
                lectureData[0].PriceDisplay.toLocaleString()}
            </div>

            <div className='lecture-time'>
              {lectureData &&
                lectureData[0] &&
                lectureData[0].FormattedLectureTime}
            </div>

            <div className='lecture-button'>
              {isEnrollment ? (
                <button
                  onClick={() => watchLectureHandler(lectureID)}
                  className='lecture-paid'
                >
                  이어서 학습하기
                </button>
              ) : (
                <button
                  onClick={() => LectureEnrollHandler()}
                  className='lecture-paid'
                >
                  수강하기
                </button>
              )}
              {isInCart ||
                (!isEnrollment && (
                  <button
                    className='lecture-add-cart'
                    onClick={() => addToCartHandler()}
                  >
                    장바구니 담기
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className='lecture-card'>
        <div className='lecture-card-button'>
          <button onClick={() => handleMenuClick('강의소개')}>강의소개</button>
          <button onClick={() => handleMenuClick('강사소개')}>강사소개</button>
          <button onClick={() => handleMenuClick('커리큘럼')}>커리큘럼</button>
          <button onClick={() => handleMenuClick('수강평')}>수강평</button>
          <button onClick={() => setSelectedItem('Q&A')}>Q&A</button>
        </div>
      </div>
      <hr className='lecture-hr' />

      <div className='lecture-details-container'>
        {selectedItem !== 'Q&A' && (
          <>
            <div className='lecture-details-introcuction' id='introduction'>
              <h3 className='lecture-details-title'>강의소개</h3>
              <div className='lecture-details-introcuction-content'>
                {lectureData &&
                  lectureData[0] &&
                  lectureData[0].Description &&
                  lectureData[0].Description.split('.').map(
                    (sentence, index) => (
                      <div key={index}>{sentence.trim()}</div>
                    )
                  )}
              </div>
            </div>
            <hr className='lecture-hr' />
            <div className='lecture-details-instructor' id='instructor'>
              <h3 className='lecture-details-title'>강사소개</h3>
              <div className='lecture-details-instructor-content'>
                <div>
                  {lectureData &&
                    lectureData[0] &&
                    lectureData[0].InstructorName}{' '}
                  강사님
                </div>
                <div>
                  {lectureData &&
                    lectureData[0] &&
                    lectureData[0].InstructorEmail}
                </div>
                <div>
                  {lectureData &&
                    lectureData[0] &&
                    lectureData[0].InstructorDescription &&
                    lectureData[0].InstructorDescription.split('.').map(
                      (sentence, index) => (
                        <div key={index}>{sentence.trim()}</div>
                      )
                    )}
                </div>
              </div>
            </div>
            <hr className='lecture-hr' />

            <div className='curriculum-container' id='curriculum'>
              <h3 className='lecture-details-title'>커리큘럼</h3>
              <ul>
                {Array.isArray(tocData) &&
                  tocData
                    .filter(menu => menu.ParentTOCID === null)
                    .map((menu, index) => (
                      <li key={menu.TOCID} className='dropdown'>
                        <input
                          type='checkbox'
                          checked={menuStates[`menu${index + 1}Open`]}
                          onChange={createToggleFunction(index)}
                        />
                        <a
                          href='#'
                          data-toggle='dropdown'
                          onClick={createToggleFunction(index)}
                        >
                          {menu.Title}
                        </a>
                        {menuStates[`menu${index + 1}Open`] && (
                          <ul className='dropdown-menu'>
                            {tocData
                              .filter(
                                subMenu => subMenu.ParentTOCID === menu.TOCID
                              )
                              .map((subMenu, subIndex) => (
                                <li key={subIndex}>
                                  <a
                                    href='#'
                                    onClick={() =>
                                      watchLectureHandler(lectureID)
                                    }
                                  >
                                    {subMenu.Title}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
              </ul>
            </div>

            <hr className='lecture-hr' />
            <div className='lecture-details-comment' id='comment'>
              <h3 className='lecture-details-title'>수강평</h3>
              <div className='lecture-details-comment-content'>
                {commentData && Array.isArray(commentData)
                  ? commentData.map(comment => (
                      <div key={comment.CommentID} className='comment-userInfo'>
                        <img
                          className='comment-userImage'
                          src={comment.ProfileImage || DefaultImage}
                          alt=''
                        />
                        <div className='comment-userInfo-content'>
                          <div className='comment-userNickname'>
                            {comment.UserNickname}
                          </div>
                          <div className='comment-createDate'>
                            {comment.WriteDate && (
                              <>
                                {
                                  new Date(comment.WriteDate)
                                    .toISOString()
                                    .split('T')[0]
                                }
                              </>
                            )}
                          </div>
                        </div>
                        <div className='comment-content'>{comment.Content}</div>
                        <div className='comment-rating'>
                          평점: {comment.Rating} 점
                        </div>
                      </div>
                    ))
                  : '수강평이 없습니다.'}
              </div>
            </div>
          </>
        )}

        {selectedItem === 'Q&A' && <Question />}
      </div>
    </div>
  );
};

export default LectureInfo;
