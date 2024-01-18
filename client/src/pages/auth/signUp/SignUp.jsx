import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const SignUp = () => {
  const [subtitle, setSubtitle] = useState('나의 성장을 돕는 IT 강의 플랫폼');

  const subtitles = [
    'IT 교육 세계를 탐험하세요',
    '업계 최고 전문가로부터 배우세요',
    '우리와 함께 잠재력을 발휘하세요',
    '성장에 목 마를땐 올잇원',
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % subtitles.length;
      setSubtitle(subtitles[currentIndex]);
    }, 2000); // 3초마다 부제목 변경 (필요에 따라 시간 조절 가능)

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='signup-container'>
      <div className='signup-card'>
        <h2 className='signup-title'>회원가입</h2>
        <p className='signup-subtitle'>{subtitle}</p> {/* 동적 부제목 사용 */}
        <form className='signup-form'>
          <input type='email' placeholder='이메일' className='signup-input' />
          <input
            type='password'
            placeholder='비밀번호'
            className='signup-input'
          />
          <input
            type='password'
            placeholder='비밀번호 확인'
            className='signup-input'
          />
          <input type='text' placeholder='이름' className='signup-input' />
          <input
            type='tel'
            placeholder='휴대폰 번호'
            className='signup-input'
          />
          <input type='text' placeholder='닉네임' className='signup-input' />
          <div className='signup-question'></div>
          <button type='submit' className='signup-button'>
            가입하기
          </button>
          <button type='button' className='kakao-signup'>
            카카오톡 회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
