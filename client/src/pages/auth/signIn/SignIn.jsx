import React, { useState } from 'react';
import styles from './style.scss'; // CSS Modules 스타일 파일을 불러옵니다.
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ITTLogo from '../../../img/allitone.png';

const SignIn = ({ toggleSignIn }) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={styles['signin-modal-backdrop']} onClick={toggleSignIn}>
      {/* 모달을 닫기 위한 배경 */}
      <div
        className={styles['signin-container']}
        onClick={e => e.stopPropagation()}
      >
        {/* 모달 내용 클릭 시, 배경 클릭 방지 */}
        <div className={styles['signin-card']}>
          {/* 모달 닫기 버튼 */}
          <button
            type='button'
            className={styles['close-button']}
            onClick={toggleSignIn}
          >
            X
          </button>

          {/* 로고 이미지 */}
          <img
            src={ITTLogo}
            alt='YouGotIT 로고'
            className={styles['signin-logo']}
          />
          {/* 로그인 폼 */}
          <form className={styles['signin-form']}>
            {/* 이메일 입력 필드 */}
            <input
              type='text'
              placeholder='이메일'
              className={styles['signin-input']}
            />

            {/* 비밀번호 입력 필드 */}
            <div className={styles['password-container']}>
              <input
                type={passwordShown ? 'text' : 'password'}
                placeholder='비밀번호'
                className={styles['signin-input']}
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className={styles['password-toggle']}
              >
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* 로그인 옵션 */}
            <div className={styles['signin-options']}>
              <label className={styles['remember-me']}>
                <input type='checkbox' />날 기억해줘!
              </label>
              <a href='#' className={styles['forgot-password']}>
                집 나간 비밀번호 찾기
              </a>
            </div>

            {/* 로그인 버튼 */}
            <button type='submit' className={styles['signin-button']}>
              로그인
            </button>

            {/* 카카오톡 로그인 버튼 */}
            <button type='button' className={styles['kakao-signin']}>
              카카오톡 로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
