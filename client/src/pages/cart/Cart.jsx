import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { baseUrl } from '../../config/baseUrl';
import DefaultImage from '../../img/defaultProfileImage.png';
import { AuthContext } from '../../context/authContext';
import { useParams, useNavigate } from 'react-router-dom';
import './style.scss';
// import { useLocation } from "react-router-dom";

import PaymentModal from '../mypage/payment/paymentmodal/PaymentModal';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [lectureData, setLectureData] = useState({});
  const [isEnrollment, setIsEnrollment] = useState(false);
  const { lectureID } = useParams();

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

  const handlePaymentSuccess = () => {
    setIsEnrollment(true); // 수강 등록 상태를 true로 업데이트
    alert('결제가 성공했습니다.');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get('userToken');
        const response = await axios.get(`${baseUrl}/api/cart/cartlist`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data);
        console.log(cartItems);
      } catch (error) {
        console.error('장바구니 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  const totalAmount = selectedItems.reduce((total, selectedIndex) => {
    const selectedItem = cartItems[selectedIndex];

    // 만약 선택한 항목이 유효하다면 해당 항목의 LecturePrice를 누적합니다.
    if (selectedItem && selectedItem.LecturePrice) {
      return total + selectedItem.LecturePrice;
    }

    // 그렇지 않으면 누적값을 그대로 반환합니다.
    return total;
  }, 0);

  const formattedTotalAmount = totalAmount.toLocaleString();

  const selectedRemoveItem = async index => {
    try {
      const lectureIds = selectedItems
        .map(selectedIndex => cartItems[selectedIndex]?.LectureID)
        .filter(Boolean);
      const token = jsCookie.get('userToken');
      const deletePromises = lectureIds.map(async id => {
        await axios.post(
          `${baseUrl}/api/cart/delete-lecture`,
          {
            LectureID: id,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
      alert('강의를 삭제했습니다.'); // 여기에 alert 추가

      await Promise.all(deletePromises);

      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(item => item !== index)
      );

      const updatedCart = cartItems.filter(
        (_, i) => !selectedItems.includes(i)
      );
      setCartItems(updatedCart);
      setSelectedItems([]);
    } catch (error) {
      console.error('선택한 강의 삭제 중 오류 발생:', error);
    }
  };

  const removeItem = async (lectureId, index) => {
    try {
      // LectureID 속성이 정의되어 있는지 확인
      if (lectureId) {
        // 삭제 요청을 서버에 보냄
        await axios.post(
          `${baseUrl}/api/cart/delete-lecture`,
          {
            LectureID: lectureId,
          },
          {
            withCredentials: true,
          }
        );

        // 강의가 성공적으로 삭제된 경우에만 클라이언트 상태 업데이트
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
      } else {
        console.error('선택한 아이템에 유효한 LectureID가 없습니다.');
      }
    } catch (error) {
      console.error('장바구니 아이템 삭제 중 오류 발생:', error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : cartItems.map((_, index) => index));
  };

  const handleCheckboxChange = index => {
    const isSelected = selectedItems.includes(index);

    // 선택된 항목 배열을 업데이트합니다.
    const updatedSelectedItems = isSelected
      ? selectedItems.filter(item => item !== index)
      : [...selectedItems, index];

    setSelectedItems(updatedSelectedItems);

    // 모든 항목이 선택되었는지 확인하고, 전체 선택 상태를 업데이트합니다.
    setSelectAll(updatedSelectedItems.length === cartItems.length);
  };

  return (
    <div className='cart'>
      <div className='title-container'>
        <h3 className='cart-title'>장바구니</h3>
      </div>
      <div className='wrapper-container'>
        <div className='left-wrapper'>
          <div className='left-wrapper-container'>
            <div className='cartTop'>
              <div className='select'>
                <input
                  className='selectAll'
                  type='checkbox'
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className='selected'>
                  전체선택 {selectedItems.length}/{cartItems.length}
                </span>
                <button className='removeBtn' onClick={selectedRemoveItem}>
                  선택삭제
                </button>
              </div>
            </div>
            <div className='cart-content'>
              <ul className='cartWrap'>
                {cartItems.map((item, index) => (
                  <li
                    key={index}
                    className={`items ${index % 2 === 0 ? 'even' : 'odd'}`}
                  >
                    <div className='infoWrap'>
                      <input
                        className='cartChk'
                        type='checkbox'
                        checked={selectedItems.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <div className='cartSection'>
                        {item.LectureImageURL ? (
                          <img
                            src={item.LectureImageURL}
                            alt=''
                            className='itemImg'
                          />
                        ) : (
                          <img
                            src={DefaultImage}
                            alt='Default Lecture Image'
                            className='itemImg'
                          />
                        )}
                        <div className='itemInfo'>
                          <a className='cart-lecture-title'>{item.Title}</a>
                          <span className='cart-instructor'>
                            {item.InstructorName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='qtyWrap'>
                      <div className='prodTotal'>
                        <a className='price-wrap'>
                          {item.LecturePrice.toLocaleString()}원
                        </a>
                      </div>
                      <div className='removeWrap'>
                        <a
                          href='#'
                          className='remove'
                          onClick={() => removeItem(item.LectureID, index)}
                        >
                          x
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className='right-wrapper'>
          <div className='right-wrapper-container'>
            <div className='cart-buttons'>
              <div className='user-info'>
                <span className='info'>사용자 정보</span>
                <div className='user-detail'>
                  <p className='label'>이름:</p>
                  <p className='value'>
                    {cartItems[0]?.UserName || '이름 없음'}
                  </p>
                </div>
                <div className='user-detail'>
                  <p className='label'>이메일:</p>
                  <p className='value'>
                    {cartItems[0]?.UserEmail || '이메일 없음'}
                  </p>
                </div>
                <div className='user-detail'>
                  <p className='label'>휴대폰 번호:</p>
                  <p className='value'>
                    {cartItems[0]?.UserCellPhone || '번호 없음'}
                  </p>
                </div>
              </div>

              <div className='subtotal'>
                <div className='total-info'>
                  <div className='total-detail'>
                    <p className='label'>선택상품 금액</p>
                    <p className='label'>{formattedTotalAmount}원</p>
                  </div>
                  <div className='total-detail'>
                    <p className='value'>총 결제금액</p>
                    <p className='value'>{formattedTotalAmount}원</p>
                  </div>
                </div>
                <div>
                  <button onClick={handleEnrollClick} className='btn-continue'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
