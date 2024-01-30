import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ITTLogo from '../../../img/allitone.png';
import { AuthContext } from '../../../context/authContext';

const SignIn = ({ closeModal }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { signIn } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태

  const handleSignIn = async e => {
    e.preventDefault();

    try {
      await signIn(userEmail, password);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('인증 중 오류:', error);
      alert(
        '등록되지 않은 아이디이거나 아이디 또는 비밀번호가 일치하지 않습니다.'
      ); // 알림으로 오류 메시지 표시
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className='signin-modal-backdrop' onClick={e => e.stopPropagation()}>
      {' '}
      {/* 모달을 닫기 위한 배경 */}
      <div className='signin-container' onClick={e => e.stopPropagation()}>
        {/* 모달 내용 클릭 시, 배경 클릭 방지 */}
        <div className='signin-card'>
          {/* 모달 닫기 버튼 */}
          <button type='button' className='close-button' onClick={closeModal}>
            X
          </button>

          {/* 로고 이미지 */}
          <img src={ITTLogo} alt='YouGotIT 로고' className='signin-logo' />
          {/* 로그인 폼 */}
          <form className='signin-form' onSubmit={handleSignIn}>
            {/* 이메일 입력 필드 */}
            <input
              type='text'
              placeholder='이메일'
              className='signin-input'
              id='username'
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
            />

            {/* 비밀번호 입력 필드 */}
            <div className='password-container'>
              <input
                type={passwordShown ? 'text' : 'password'}
                placeholder='비밀번호'
                className='signin-input'
                id='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='password-toggle'
              >
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* 로그인 옵션 */}
            <div className='signin-options'>
              <label className='remember-me'>
                <input type='checkbox' />날 기억해줘!
              </label>
              <a href='#' className='forgot-password'>
                집 나간 비밀번호 찾기
              </a>
            </div>

            {/* 로그인 버튼 */}
            <button type='submit' className='signin-button'>
              로그인
            </button>

            {/* 카카오톡 로그인 버튼 */}
            <button type='button' className='kakao-signin'>
              카카오톡 로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
