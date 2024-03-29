import React, { useState, useEffect } from 'react';
import './style.scss'; // SCSS 스타일 파일을 포함시킵니다.
import { Link } from 'react-router-dom';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { baseUrl } from '../../../config/baseUrl';

const Payment = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get('userToken');

        const response = await axios.get(`${baseUrl}/api/modify/payment`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log('response.data:  ' + JSON.stringify(response.data));
        setPayments(response.data);
        console.log('response.data123:  ', response.data);
      } catch (error) {
        console.error('프로필 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);
  console.log('payments', payments);

  return (
    <div className='profile-page'>
      <div className='payment'>
        <div className='payment-card'>
          <table className='payment-table'>
            <thead>
              <tr>
                <th className='payment-container-no'>번호</th>
                <th className='payment-container-title'>강의명</th>
                <th className='payment-container-price'>구매금액</th>
                <th className='payment-container-date'>구매일</th>
                <th className='payment-container-payment'>결제방법</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td className='payment-no'>{index + 1}</td>
                  <td className='payment-title'>{payment.Title}</td>
                  <td className='payment-price'>
                    {payment.FormattedLecturePrice}
                  </td>
                  <td className='payment-date'>
                    {payment.PaymentDate.split('T')[0]}
                  </td>
                  <td className='payment-payment'>{payment.Payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;
