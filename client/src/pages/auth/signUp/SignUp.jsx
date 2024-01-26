import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../../config/baseUrl';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickName] = useState('');
  const [cellphone, setCellPhone] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNickNameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [cellphoneError, setCellPhoneError] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordCheckShown, setPasswordCheckShown] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const togglePasswordCheckVisibility = () => {
    setPasswordCheckShown(!passwordCheckShown);
  };
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true); // Show the message
  };

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

  const validateEmail = async () => {
    // 이메일 유효성 검사를 수행
    const emailRegex = /^[^\s@]{5,}@[^\s@]+\.(com|net)$/;

    if (!email) {
      setEmailError('이메일 주소를 입력해주세요.');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일 형식을 입력해주세요.');
      return false;
    } else {
      // 서버 사이드에서의 중복 검사를 위한 API 요청
      try {
        const response = await axios.get(
          `${baseUrl}/api/auth/duplication-email`,
          {
            params: {
              email: email,
            },
            withCredentials: true,
          }
        );

        if (response.data.isDuplicate) {
          setEmailError('중복된 이메일 주소입니다.');
          return false;
        } else {
          setEmailError('');
          return true;
        }
      } catch (error) {
        console.error('이메일 중복 검사 중 오류 발생:', error);
        return false;
      }
    }
  };

  const validateName = () => {
    // 이름 유효성 검사를 수행
    const nameRegex = /^[ㄱ-ㅎ|가-힣].{1,4}$/;

    if (!name) {
      setNameError('이름을 입력해주세요.');
      return false;
    } else if (!nameRegex.test(name) || name.length < 1 || name.length >= 5) {
      setNameError('1글자 이상 5글자 미만 한글만 입력 가능합니다.');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validatePassword = () => {
    // 비밀번호 유효성 검사를 수행
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        '비밀번호는 최소 8자 이상, 영문자와 숫자, 특수 문자를 포함해야 합니다.'
      );
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validatePasswordMatch = () => {
    //비밀번호 확인
    if (!passwordCheck) {
      setPasswordMatchError('비밀번호를 입력해주세요.');
      return false;
    } else if (password !== passwordCheck) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      return false;
    } else {
      setPasswordMatchError('');
      return true;
    }
  };

  const validateCellPhone = async () => {
    // 클라이언트 사이드에서의 전화번호 유효성 검사
    const cellPhoneRegex = /^010[0-9]{8}$/;

    if (!cellphone) {
      setCellPhoneError('전화번호를 입력해주세요.');
      return false;
    } else if (!cellPhoneRegex.test(cellphone)) {
      setCellPhoneError('유효한 전화번호 형식을 입력해주세요.');
      return false;
    } else {
      // 서버 사이드에서의 중복 검사를 위한 API 요청
      try {
        const response = await axios.get(
          `${baseUrl}/api/auth/duplication-cellphone`,
          {
            params: {
              cellphone: cellphone,
            },
            withCredentials: true,
          }
        );

        if (response.data.isDuplicate) {
          setCellPhoneError('중복된 전화번호입니다.');
          return false;
        } else {
          setCellPhoneError('');
          return true;
        }
      } catch (error) {
        console.error('전화번호 중복 검사 중 오류 발생:', error);
        return false;
      }
    }
  };

  const validateNickname = async () => {
    // 클라이언트 사이드에서의 닉네임 형식 검사
    const nicknameRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{1,8}$/;

    if (!nickname) {
      setNickNameError('닉네임을 입력해주세요.');
      return false;
    } else if (!nicknameRegex.test(nickname)) {
      setNickNameError('1글자 이상 9글자 미만으로 입력해주세요.');
      return false;
    } else {
      // 서버 사이드에서의 중복 검사를 위한 API 요청
      try {
        const response = await axios.get(
          `${baseUrl}/api/auth/duplication-nickname`,
          {
            params: {
              nickname: nickname,
            },
            withCredentials: true,
          }
        );
        console.log(response.data.isDuplicate);
        if (response.data.isDuplicate) {
          setNickNameError('중복된 닉네임입니다.');
          return false;
        } else {
          setNickNameError('');
          return true;
        }
      } catch (error) {
        console.error('닉네임 중복 검사 중 오류 발생:', error);
        return false;
      }
    }
  };

  const onSignUpButtonClick = async e => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isNicknameValid = validateNickname();
    const isCellPhoneValid = validateCellPhone();
    const isNameValid = validateName();
    const isPasswordValid = validatePassword();
    const isPasswordMatchValid = validatePasswordMatch();

    if (
      isEmailValid &&
      isNicknameValid &&
      isNameValid &&
      isPasswordValid &&
      isPasswordMatchValid &&
      isCellPhoneValid
    ) {
      try {
        // 여기에 회원가입을 위한 API 호출 추가
        const response = await axios.post(
          `${baseUrl}/api/auth/signUp`,
          {
            UserEmail: email,
            UserName: name,
            Password: password,
            PasswordCheck: passwordCheck,
            UserCellPhone: cellphone,
            UserNickname: nickname,
          },
          {
            withCredentials: true,
          }
        );

        // API 호출에 대한 후속 처리 추가
        console.log('회원가입 성공:', response);
        alert(`회원가입을 환영합니다!`);
        navigate('/');
      } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
      }
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-card'>
        <h2 className='signup-title'>회원가입</h2>
        <p className='signup-subtitle'>{subtitle}</p> {/* 동적 부제목 사용 */}
        <form className='signup-form'>
          <div className='input-container'>
            <input
              type='email'
              placeholder='이메일'
              className='signup-input'
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            {emailError && <p className='error-message'>{emailError}</p>}
          </div>

          <div className='input-container'>
            <input
              type={passwordShown ? 'text' : 'password'}
              placeholder='비밀번호'
              className='signup-input'
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={validatePassword}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='password-toggle'
            >
              {passwordShown ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordError && <p className='error-message'>{passwordError}</p>}
          </div>

          <div className='input-container'>
            <input
              type={passwordCheckShown ? 'text' : 'password'}
              placeholder='비밀번호 확인'
              className='signup-input'
              value={passwordCheck}
              onChange={e => setPasswordCheck(e.target.value)}
              onBlur={validatePasswordMatch}
            />
            <button
              type='button'
              onClick={togglePasswordCheckVisibility}
              className='password-toggle'
            >
              {passwordCheckShown ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordMatchError && (
              <p className='error-message'>{passwordMatchError}</p>
            )}
          </div>

          <div className='input-container'>
            <input
              type='text'
              placeholder='이름'
              className='signup-input'
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={validateName}
            />
            {nameError && <p className='error-message'>{nameError}</p>}
          </div>

          <div className='input-container'>
            <input
              type='tel'
              placeholder='전화번호'
              className='signup-input'
              value={cellphone}
              onChange={e => setCellPhone(e.target.value)}
              onBlur={validateCellPhone}
            />
            {cellphoneError && (
              <p className='error-message'>{cellphoneError}</p>
            )}
          </div>

          <div className='input-container'>
            <input
              type='text'
              placeholder='닉네임'
              className='signup-input'
              value={nickname}
              onChange={e => setNickName(e.target.value)}
              onBlur={validateNickname}
            />
            {nicknameError && <p className='error-message'>{nicknameError}</p>}
          </div>

          <button
            type='submit'
            className='signup-button'
            onClick={onSignUpButtonClick}
          >
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
