import React, { useState, useEffect } from 'react';
import './style.scss'; // SCSS 스타일 파일을 포함시킵니다.
import defaultProfileImage from '../../../img/it.png'; // 프로필 이미지를 포함시킵니다.
import { NavLink } from 'react-router-dom';

const Payment = () => {
  // 여러 개의 임시 데이터를 배열로 초기 상태 설정
  const [payments, setPayments] = useState([
    {
      id: 1,
      courseName: '웹 개발 마스터',
      paymentDate: '2024-01-19 12:00:00',
      coursePrice: 30000,
    },
    {
      id: 2,
      courseName: '데이터 사이언스 입문',
      paymentDate: '2024-01-20 15:30:00',
      coursePrice: 45000,
    },
    {
      id: 3,
      courseName: '인공지능 기초',
      paymentDate: '2024-01-22 11:00:00',
      coursePrice: 50000,
    },
  ]);

  useEffect(() => {
    // 실제 환경에서는 이 부분에 API 호출 로직이 들어갑니다.
    // 예: fetchPaymentData 함수를 여기에 정의하고 호출합니다.
    // 지금은 임시 데이터를 사용하고 있으므로 이 부분은 비워두겠습니다.
    // 만약 API 호출을 시뮬레이션하고 싶다면 setTimeout을 사용할 수 있습니다.
    // setTimeout(() => {
    //   setPaymentData({
    //     courseName: '웹 개발 마스터',
    //     paymentDate: '2024-01-19 12:00:00',
    //     coursePrice: 30000,
    //   });
    // }, 1000); // 1초 후에 데이터를 설정합니다.
  }, []);

  return (
    <div className='profile-page'>
      <header className='profile-header'>
        <img src={defaultProfileImage} alt='Profile' className='profile-pic' />
        <h1 className='profile-name'>이종호 님</h1>
        {/* 사용자의 이름을 표시하세요. */}
      </header>
      <div className='profile-nav'>
        <ul>
          <li>
            <NavLink to='/mypage' activeClassName='active'>
              내 강의
            </NavLink>
          </li>
          <li>
            <NavLink to='/profile' activeClassName='active'>
              프로필
            </NavLink>
          </li>
          <li>
            <NavLink to='/payment' activeClassName='active'>
              결제내역
            </NavLink>
          </li>
        </ul>
      </div>
      <div className='payment-container'>
        {payments.map(payment => (
          <div key={payment.id} className='payment-row-group'>
            <div className='payment-row payment-title-row'>
              <div className='payment-title'>강의 이름</div>
              <div className='payment-title'>결제 날짜</div>
              <div className='payment-title'>강의 가격</div>
            </div>
            <div className='payment-row payment-info-row'>
              <div className='payment-info'>{payment.courseName}</div>
              <div className='payment-info'>{payment.paymentDate}</div>
              <div className='payment-info'>{`₩${payment.coursePrice.toLocaleString()}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;
