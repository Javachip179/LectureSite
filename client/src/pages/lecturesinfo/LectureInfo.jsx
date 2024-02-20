import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../config/baseUrl.js';
import jsCookie from 'js-cookie';
import { AuthContext } from '../../context/authContext.js';
import DefaultImage from '../../img/defaultProfileImage.png';
import Question from './question/Question.jsx';
import { FaCircle, FaRegCirclePlay } from 'react-icons/fa6';
import { FaUserGraduate } from 'react-icons/fa';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';

import PaymentModal from '../mypage/payment/paymentmodal/PaymentModal.jsx';

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
  const { lectureID } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrollment, setIsEnrollment] = useState(false);
  const [selectedItem, setSelectedItem] = useState('강의소개');
  const [menuStates, setMenuStates] = useState({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [ratingPercentages, setRatingPercentages] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // 메뉴 상태 초기화
    const initialState = tocData.reduce(
      (states, menu, index) => ({
        ...states,
        [`menu${menu.TOCID}Open`]: false,
      }),
      {}
    );
    setMenuStates(initialState);
  }, [tocData]);

  const toggleMenu = tocId => {
    setMenuStates(prevStates => {
      // 현재 상태를 콘솔에 기록합니다.
      console.log(
        `Current state for menu${tocId}:`,
        prevStates[`menu${tocId}Open`]
      );

      const newState = !prevStates[`menu${tocId}Open`];

      // 변경 후 상태를 콘솔에 기록합니다.
      console.log(`New state for menu${tocId}:`, newState);

      return {
        ...prevStates,
        [`menu${tocId}Open`]: newState,
      };
    });
  };

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

        const percentages = calculateRatingPercentages(response.data.comments);
        setRatingPercentages(percentages);

        setLectureData(response.data.lecture);
        setTocData(response.data.toc);
        setCategoryData(response.data.categories);
        setCommentData(response.data.comments);
        console.log('questions Data:', response.data.lecture);
      } catch (error) {
        console.error('강의 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
    console.log('lectureData?', lectureData);

    const calculateRatingPercentages = comments => {
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      comments.forEach(comment => {
        if (comment.Rating in ratingCounts) {
          ratingCounts[comment.Rating]++;
        }
      });

      const maxCount = Math.max(...Object.values(ratingCounts));
      const ratingPercentages = {};

      for (const rating in ratingCounts) {
        ratingPercentages[rating] = (ratingCounts[rating] / maxCount) * 100;
      }

      return ratingPercentages;
    };

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

  useEffect(() => {
    if (!window.IMP) {
      // IMP 객체가 없다면 스크립트 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js';
      script.onload = () => {
        console.log('아임포트 SDK 로드 완료');
        window.IMP.init(process.env.REACT_APP_IMP_KG_INICIS); // SDK 초기화
      };
      document.body.appendChild(script);

      return () => document.body.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    } else {
      window.IMP.init(process.env.REACT_APP_IMP_KG_INICIS); // 이미 로드된 경우, 바로 초기화
    }
  }, []);

  const handlePaymentSuccess = () => {
    setIsEnrollment(true); // 수강 등록 상태를 true로 업데이트
    alert('수강 등록 및 결제가 성공했습니다.');
  };
  // console.log("isInCart:", isInCart);
  // console.log("isEnrollment", isEnrollment);

  // 수강하기 버튼 클릭 이벤트 핸들러
  const handleEnrollClick = async () => {
    // 사용자가 로그인하지 않았을 경우, 경고 메시지를 띄우고 함수를 종료합니다.
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
      return;
    }

    // 강의가 무료인 경우, 바로 수강 신청을 진행합니다.
    if (lectureData[0].LecturePrice === 0) {
      handlePaymentSuccess();
    } else {
      // 강의가 무료가 아닌 경우, 결제창 모달을 띄웁니다.
      setIsPaymentModalOpen(true);
    }
  };

  const LectureEnrollHandler = async () => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
      return;
    } else {
      try {
        const token = jsCookie.get('userToken');

        // 서버로 결제 요청 데이터 만들기
        const paymentData = {
          pg: 'html5_inicis', // PG사
          pay_method: 'card', // 결제수단
          merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
          amount: lectureData[0].LecturePrice, // 결제금액
          name: lectureData[0].Title, // 주문명
          buyer_name: currentUser.UserName, // 구매자 이름
          buyer_email: currentUser.UserEmail, // 구매자 이메일
        };

        // console.log("paymentData", paymentData);

        // IMP SDK 초기화
        const { IMP } = window;
        IMP.init(`${process.env.REACT_APP_IMP_KG_INICIS}`);

        // 결제 요청
        IMP.request_pay(paymentData, async response => {
          const { success, error_msg } = response;
          // console.log("imp_uid1", response.imp_uid);
          // console.log("merchant_uid1", response.merchant_uid);
          // console.log("payment_amount1", response.paid_amount);
          const imp_uid = response.imp_uid;
          const merchant_uid = response.merchant_uid;
          const payment_amount = response.paid_amount;
          if (success) {
            try {
              // 결제 검증을 위한 서버 요청
              const verificationResponse = await axios.post(
                `${baseUrl}/api/modify/payment-verify`,
                {
                  imp_uid: imp_uid,
                  merchant_uid: merchant_uid,
                  payment_amount: payment_amount,
                },
                {
                  withCredentials: true,
                }
              );

              // console.log(
              //   "verificationResponse.data",
              //   verificationResponse.data
              // );
              const cardName = verificationResponse.data.cardName;
              // console.log("cardName", cardName);
              if (verificationResponse.data.success) {
                // 서버로 수강 등록 요청
                const enrollmentResponse = await axios.post(
                  `${baseUrl}/api/enrollment`,
                  { lectureId: lectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const paymentResponse = await axios.post(
                  `${baseUrl}/api/modify`,
                  { lectureId: lectureID, cardName: cardName },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const cartResponse = await axios.post(
                  `${baseUrl}/api/cart/delete-lecture`,
                  { lectureId: lectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                console.log(
                  'enrollmentResponse.data.success?',
                  enrollmentResponse.data
                );
                console.log(
                  'paymentResponse.data.success?',
                  paymentResponse.data
                );
                console.log('cartResponse.data', cartResponse.data);

                // 수강 등록이 성공한 경우
                if (
                  enrollmentResponse.data ===
                    '강의 수강 신청이 완료되었습니다.' &&
                  paymentResponse.data.success &&
                  cartResponse.data === '삭제 성공'
                ) {
                  alert('수강 등록 및 결제가 성공했습니다.');

                  window.location.reload();
                } else {
                  // 수강 등록이 실패한 경우에 대한 처리
                  alert('수강 등록에 실패했습니다.');
                  return;
                }
              } else {
                // 결제 검증 실패
                alert('결제 검증에 실패했습니다.');
                return;
              }
            } catch (error) {
              console.error('API 호출 중 오류:', error);
              alert('결제 요청 중 오류가 발생했습니다.');
              return;
            }
          } else {
            alert(`결제 실패: ${error_msg}`);
            return;
          }
        });
      } catch (error) {
        console.error('API 호출 중 오류:', error);
        alert('결제 요청 중 오류가 발생했습니다.');
        return;
      }
    }
  };

  const handlePayWithKakaoPay = async () => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
      return;
    } else {
      try {
        const token = jsCookie.get('userToken');

        // 서버로 결제 요청 데이터 만들기
        const paymentData = {
          pg: 'kakaopay', // PG사
          pay_method: 'card', // 결제수단
          merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
          amount: lectureData[0].LecturePrice, // 결제금액
          name: lectureData[0].Title, // 주문명
          buyer_name: currentUser.UserName, // 구매자 이름
          buyer_email: currentUser.UserEmail, // 구매자 이메일
        };

        // console.log("paymentData", paymentData);

        // IMP SDK 초기화
        const { IMP } = window;
        IMP.init(`${process.env.REACT_APP_IMP_KG_INICIS}`);

        // 결제 요청
        IMP.request_pay(paymentData, async response => {
          const { success, error_msg } = response;
          // console.log("imp_uid1", response.imp_uid);
          // console.log("merchant_uid1", response.merchant_uid);
          // console.log("payment_amount1", response.paid_amount);
          const imp_uid = response.imp_uid;
          const merchant_uid = response.merchant_uid;
          const payment_amount = response.paid_amount;
          if (success) {
            try {
              // 결제 검증을 위한 서버 요청
              const verificationResponse = await axios.post(
                `${baseUrl}/api/modify/payment-verify`,
                {
                  imp_uid: imp_uid,
                  merchant_uid: merchant_uid,
                  payment_amount: payment_amount,
                },
                {
                  withCredentials: true,
                }
              );

              // console.log(
              //   "verificationResponse.data",
              //   verificationResponse.data
              // );
              const cardName = verificationResponse.data.cardName;
              // console.log("cardName", cardName);
              if (verificationResponse.data.success) {
                console.log(`결제에 사용된 카드: ${cardName}`);
                // 서버로 수강 등록 요청
                const enrollmentResponse = await axios.post(
                  `${baseUrl}/api/enrollment`,
                  { lectureId: lectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const paymentResponse = await axios.post(
                  `${baseUrl}/api/modify/kakao`,
                  {
                    lectureId: lectureID,
                    cardName: cardName,
                  },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const cartResponse = await axios.post(
                  `${baseUrl}/api/cart/delete-lecture`,
                  { lectureId: lectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                console.log(
                  'enrollmentResponse.data.success?',
                  enrollmentResponse.data
                );
                console.log(
                  'paymentResponse.data.success?',
                  paymentResponse.data
                );
                console.log('cartResponse.data', cartResponse.data);

                // 수강 등록이 성공한 경우
                if (
                  enrollmentResponse.data ===
                    '강의 수강 신청이 완료되었습니다.' &&
                  paymentResponse.data.success &&
                  cartResponse.data === '삭제 성공'
                ) {
                  alert('수강 등록 및 결제가 성공했습니다.');

                  window.location.reload();
                } else {
                  // 수강 등록이 실패한 경우에 대한 처리
                  alert('수강 등록에 실패했습니다.');
                  return;
                }
              } else {
                // 결제 검증 실패
                alert('결제 검증에 실패했습니다.');
                return;
              }
            } catch (error) {
              console.error('API 호출 중 오류:', error);
              alert('결제 요청 중 오류가 발생했습니다.');
              return;
            }
          } else {
            alert(`결제 실패: ${error_msg}`);
            return;
          }
        });
      } catch (error) {
        console.error('API 호출 중 오류:', error);
        alert('결제 요청 중 오류가 발생했습니다.');
        return;
      }
    }
  };

  const handlePayWithTossPay = async () => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
      return;
    } else {
      try {
        const token = jsCookie.get('userToken');

        // 서버로 결제 요청 데이터 만들기
        const paymentData = {
          pg: 'toss', // PG사
          pay_method: 'card', // 결제수단
          merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
          amount: lectureData[0].LecturePrice, // 결제금액
          name: lectureData[0].Title, // 주문명
          buyer_name: currentUser.UserName, // 구매자 이름
          buyer_email: currentUser.UserEmail, // 구매자 이메일
        };

        // console.log("paymentData", paymentData);

        // IMP SDK 초기화
        const { IMP } = window;
        IMP.init(`${process.env.REACT_APP_IMP_KG_INICIS}`);

        // 결제 요청
        IMP.request_pay(paymentData, async response => {
          const { success, error_msg } = response;
          // console.log("imp_uid1", response.imp_uid);
          // console.log("merchant_uid1", response.merchant_uid);
          // console.log("payment_amount1", response.paid_amount);
          const imp_uid = response.imp_uid;
          const merchant_uid = response.merchant_uid;
          const payment_amount = response.paid_amount;
          if (success) {
            try {
              // 결제 검증을 위한 서버 요청
              const verificationResponse = await axios.post(
                `${baseUrl}/api/modify/payment-verify`,
                {
                  imp_uid: imp_uid,
                  merchant_uid: merchant_uid,
                  payment_amount: payment_amount,
                },
                {
                  withCredentials: true,
                }
              );

              // console.log(
              //   "verificationResponse.data",
              //   verificationResponse.data
              // );
              const cardName = verificationResponse.data.cardName;
              // console.log("cardName", cardName);
              if (verificationResponse.data.success) {
                // 서버로 수강 등록 요청
                const enrollmentResponse = await axios.post(
                  `${baseUrl}/api/enrollment`,
                  { lectureId: lectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const paymentResponse = await axios.post(
                  `${baseUrl}/api/modify`,
                  { lectureId: lectureID, cardName: cardName },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                const cartResponse = await axios.post(
                  `${baseUrl}/api/cart/delete-lecture`,
                  { lectureId: lectureID },
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                console.log(
                  'enrollmentResponse.data.success?',
                  enrollmentResponse.data
                );
                console.log(
                  'paymentResponse.data.success?',
                  paymentResponse.data
                );
                console.log('cartResponse.data', cartResponse.data);

                // 수강 등록이 성공한 경우
                if (
                  enrollmentResponse.data ===
                    '강의 수강 신청이 완료되었습니다.' &&
                  paymentResponse.data.success &&
                  cartResponse.data === '삭제 성공'
                ) {
                  alert('수강 등록 및 결제가 성공했습니다.');

                  window.location.reload();
                } else {
                  // 수강 등록이 실패한 경우에 대한 처리
                  alert('수강 등록에 실패했습니다.');
                  return;
                }
              } else {
                // 결제 검증 실패
                alert('결제 검증에 실패했습니다.');
                return;
              }
            } catch (error) {
              console.error('API 호출 중 오류:', error);
              alert('결제 요청 중 오류가 발생했습니다.');
              return;
            }
          } else {
            alert(`결제 실패: ${error_msg}`);
            return;
          }
        });
      } catch (error) {
        console.error('API 호출 중 오류:', error);
        alert('결제 요청 중 오류가 발생했습니다.');
        return;
      }
    }
  };

  const addToCartHandler = async () => {
    if (!currentUser) {
      alert('로그인 후 이용해 주세요.');
    } else {
      try {
        const token = jsCookie.get('userToken');

        if (lectureData[0].LecturePrice === 0) {
          alert('무료 강의는 장바구니에 담을 수 없습니다.');
          return;
        }
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
    scrollToSection(menuItemToSectionId(menuItem));
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

  const getNumberOfLectures = () => {
    return tocData ? tocData.length : 0;
  };

  const getNumberOfComments = () => {
    return commentData ? commentData.length : 0;
  };

  return (
    <div className='lecture'>
      <div className='lecture-container'>
        <div className='lecture-container2'>
          <div className='lecture-information'>
            {lectureData && lectureData.length > 0 && (
              <img
                className='lecture-image'
                src={lectureData[0].LectureImageURL || DefaultImage}
                alt='lecture'
              />
            )}

            <div className='lecture-information-details'>
              <div className='lecture-category'>
                {categoryData &&
                  Object.keys(categoryData).map(key => (
                    <div key={key}>
                      <span>카테고리 : {categoryData[key].CategoryName}</span>
                    </div>
                  ))}
              </div>

              <div className='lecture-title'>
                {lectureData.length > 0
                  ? lectureData[0].Title
                  : '강의 제목 없음'}
              </div>

              <div className='lecture-rating-details'>
                <div className='lecture-rating'>
                  <StarRatings rating={averageRating} />
                </div>
                <div className='lecture-rating-count'>
                  {commentData.length > 0
                    ? `(${calculateAverageRating().toFixed(1)}점)`
                    : '(평점 정보 없음)'}
                  <span> </span>
                  {getNumberOfComments()}개의 수강평
                </div>
              </div>
              <div className='lecture-instructor'>
                <FaUserGraduate className='instructor-icon' />
                <span> </span>
                {lectureData && lectureData[0] && lectureData[0].InstructorName}
              </div>

              <div className='lecture-subcategory'>
                {categoryData &&
                  Object.keys(categoryData).map(key => (
                    <div key={key}>
                      {categoryData[key].SubcategoryName && (
                        <span>#{categoryData[key].SubcategoryName}</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='lecture-card'>
        <ul className='lecture-card-button'>
          {['강의소개', '강사소개', '커리큘럼', '수강평', 'Q&A'].map(
            menuItem => (
              <li
                key={menuItem}
                className={selectedItem === menuItem ? 'active' : ''}
                onClick={() => handleMenuClick(menuItem)}
              >
                <a href={`#${menuItemToSectionId(menuItem)}`}>{menuItem}</a>
              </li>
            )
          )}
        </ul>
      </div>

      <div className='wrapper-container'>
        <div className='left-wrapper'>
          <div className='left-wrapper-container'>
            <div className='lecture-details-container'>
              {selectedItem !== 'Q&A' && (
                <>
                  <div
                    className='lecture-details-introcuction'
                    id='introduction'
                  >
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
                  <hr className='section-divider' />

                  <h3 className='lecture-details-title'>강사소개</h3>
                  <div className='lecture-details-instructor' id='instructor'>
                    <div>
                      <div className='lecture-details-instructor-content'>
                        <div className='instructor-name-greeting'>
                          안녕하세요,
                        </div>
                        <div className='instructor-name'>
                          <span className='instructor-name-bold'>
                            {lectureData &&
                              lectureData[0] &&
                              lectureData[0].InstructorName}
                          </span>
                          <span>입니다.</span>
                        </div>

                        <div className='instructor-description'>
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
                    <div className='instructor-image'>
                      <img
                        src={
                          lectureData &&
                          lectureData[0] &&
                          lectureData[0].InstructorProfileImage
                        }
                        alt='lecture'
                      />
                    </div>
                  </div>
                  <div className='instructor-comment'>
                    {lectureData &&
                      lectureData[0] &&
                      lectureData[0].InstructorComment}
                  </div>
                  <hr className='section-divider' />

                  <div className='curriculum-container' id='curriculum'>
                    <div className='lecture-details-header'>
                      <h3 className='lecture-details-title'>커리큘럼</h3>
                      <span className='lecture-details-title-count'>
                        총{getNumberOfLectures()}개의 강의
                        <FaCircle className='circle-icon' />
                        {lectureData &&
                          lectureData[0] &&
                          lectureData[0].FormattedLectureTime}
                        의 수업
                      </span>
                    </div>
                    <div className='curriculum-description'>
                      이 강의는 영상이 제공됩니다. 미리보기를 통해 콘텐츠를
                      확인해보세요.
                    </div>

                    <ul className='curriculum-list'>
                      {tocData
                        .filter(menu => menu.ParentTOCID === null)
                        .map(menu => (
                          <li key={menu.TOCID} className='dropdown'>
                            <div
                              className='menu-header'
                              onClick={() => toggleMenu(menu.TOCID)}
                            >
                              {menuStates[`menu${menu.TOCID}Open`] ? (
                                <GoChevronUp />
                              ) : (
                                <GoChevronDown />
                              )}
                              <span className='menu-title'>{menu.Title}</span>
                            </div>
                            {menuStates[`menu${menu.TOCID}Open`] && (
                              <ul className='dropdown-content'>
                                {tocData
                                  .filter(
                                    subMenu =>
                                      subMenu.ParentTOCID === menu.TOCID
                                  )
                                  .map(subMenu => (
                                    <li key={subMenu.TOCID}>
                                      <FaRegCirclePlay />
                                      {subMenu.Title}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <hr className='section-divider' />

                  <div className='lecture-details-comment' id='comment'>
                    <div className='lecture-details-header'>
                      <h3 className='lecture-details-title'>수강평</h3>
                      <span className='lecture-details-sum-count'>
                        총{commentData.length}개
                      </span>
                    </div>
                    <div className='comment-description'>
                      수강생분들이 직접 작성하신 수강평입니다.
                    </div>
                    <div className='rating-dashboard'>
                      <div className='star-ratings-dashboard'>
                        <div
                          className={`star-ratings-num ${
                            commentData.length === 0 ? 'no-rating' : ''
                          }`}
                        >
                          {commentData.length > 0
                            ? `${calculateAverageRating().toFixed(1)}`
                            : '(평점 정보 없음)'}
                        </div>
                        <div className='star-ratings-star'>
                          <StarRatings rating={averageRating} />
                        </div>
                        <div className='star-ratings-text'>
                          총{commentData.length}개의 수강평
                        </div>
                      </div>
                      <div className='graph-ratings'>
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className='rating-bar-container'>
                            <div className='rating-label'>{rating}점</div>
                            <div className='rating-bar'>
                              <div
                                className='rating-fill'
                                style={{
                                  width: `${ratingPercentages[rating]}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='lecture-details-comment-content'>
                      {commentData && Array.isArray(commentData)
                        ? commentData.map(comment => (
                            <div
                              key={comment.CommentID}
                              className='comment-userInfo'
                            >
                              <div className='comment-header'>
                                <img
                                  className='comment-userImage'
                                  src={comment.ProfileImage || DefaultImage}
                                  alt=''
                                />
                                <div className='comment-userInfo-content'>
                                  <div className='comment-userNickname'>
                                    {comment.UserNickname}
                                  </div>
                                  <div className='comment-rating'>
                                    평점: {comment.Rating} 점
                                  </div>
                                </div>
                              </div>
                              <div className='comment-content'>
                                {comment.Content}
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
                          ))
                        : '수강평이 없습니다.'}
                    </div>
                  </div>
                </>
              )}
              {selectedItem === 'Q&A' && <Question />}
            </div>
          </div>
        </div>

        <div className='right-wrapper'>
          <div className='right-wrapper-container'>
            <div className='lecture-button-card'>
              <div className='lecture-button-top'>
                <div className='lecture-price'>
                  {lectureData &&
                    lectureData[0] &&
                    lectureData[0].PriceDisplay.toLocaleString()}
                </div>
                {isEnrollment ? (
                  <button
                    onClick={() => watchLectureHandler(lectureID)}
                    className='lecture-paid'
                  >
                    이어서 학습하기
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={handleEnrollClick}
                      className='lecture-paid'
                    >
                      수강하기
                    </button>
                    <PaymentModal
                      isOpen={isPaymentModalOpen}
                      onClose={() => setIsPaymentModalOpen(false)}
                      onPayWithKakaoPay={handlePayWithKakaoPay}
                      onPayWithTossPay={handlePayWithTossPay}
                      onPayNormally={LectureEnrollHandler}
                    />
                  </div>
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
              <div className='lecture-button-bottom'>
                <p>
                  <FaCircle className='circle-icon' />
                  지식공유자 :{' '}
                  {lectureData &&
                    lectureData[0] &&
                    lectureData[0].InstructorName}{' '}
                </p>
                <p>
                  <FaCircle className='circle-icon' />
                  {getNumberOfLectures()}개의 강의(
                  {lectureData &&
                    lectureData[0] &&
                    lectureData[0].FormattedLectureTime}
                  )
                </p>
                <p>
                  <FaCircle className='circle-icon' />
                  수강기한 : 무제한
                </p>
                <p>
                  <FaCircle className='circle-icon' />
                  수료증 : 미발급
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureInfo;