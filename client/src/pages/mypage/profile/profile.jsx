import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useHistory,
} from 'react';
import './style.scss';
import defaultProfileImage from '../../../img/defaultProfileImage.png';
import axios from 'axios';
import { baseUrl } from '../../../config/baseUrl.js';
import jsCookie from 'js-cookie';
import { AuthContext } from '../../../context/authContext.js';
import { useNavigate } from 'react-router-dom';

const Profile = ({ initialName, initialEmail }) => {
  const [imageChanged, setImageChanged] = useState(false);
  const [nicknameChanged, setNicknameChanged] = useState(false);
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const [Password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { currentUser, logout, setCurrentUser } = useContext(AuthContext);

  const [profileInfo, setProfileInfo] = useState({
    UserName: '',
    UserCellPhone: '',
    Introduction: '',
    ProfileImage: '',
    UserNickname: '',
    UserEmail: '',
    Password: '',
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get('userToken');

        const response = await axios.get(`${baseUrl}/api/userInfo/mypage`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileInfo(response.data[0]);
      } catch (error) {
        console.error('프로필 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  console.log(profileInfo);

  const onNicknameChange = event => {
    setProfileInfo({ ...profileInfo, UserNickname: event.target.value });
    setNicknameChanged(true);
  };

  const onProfileImageChange = event => {
    try {
      const file = event.target.files[0];

      if (!file) {
        console.error('No file selected');
        setImageChanged(false);
        return;
      }

      setProfileInfo(prevProfileInfo => ({
        ...prevProfileInfo,
        ProfileImage: URL.createObjectURL(file),
      }));
      setImageChanged(true);
    } catch (error) {
      console.error('프로필 이미지를 업데이트하는 중 오류 발생:', error);
    }
  };

  const onProfileImageChangeButtonClick = async event => {
    event.preventDefault();
    try {
      console.log('1234');
      const fileInput = fileInputRef.current;
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append('profileImage', file);

      const token = jsCookie.get('userToken');
      const response = await axios.post(
        `${baseUrl}/api/file/fileupload`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // 서버 응답에서 imagePath를 추출
      const imageUrl = response.data.imageUrl;
      console.log('imageUrl', imageUrl);

      // 프로필 이미지 경로를 이용하여 프로필 정보 업데이트
      setProfileInfo(prevProfileInfo => ({
        ...prevProfileInfo,
        ProfileImage: imageUrl,
      }));

      setCurrentUser(prevUser => ({
        ...prevUser,
        ProfileImage: imageUrl,
      }));

      console.log('profileInfo123', profileInfo);

      alert('프로필 이미지 변경이 완료되었습니다.');
    } catch (error) {
      console.error('프로필 이미지를 업데이트하는 중 오류 발생:', error);
    }
  };

  const handleAgreementChange = event => {
    setAgreed(event.target.checked);
  };

  const handleAccountDeletion = async () => {
    if (agreed) {
      console.log('회원탈퇴 처리');
      if (window.confirm('정말 탈퇴 하시겠습니까?')) {
        const token = jsCookie.get('userToken');
        try {
          await axios.post(
            `${baseUrl}/api/userInfo/delete-user`,
            {}, // 두 번째 인수로 빈 객체를 전달하여 데이터 부분을 비움
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert('탈퇴되었습니다.');
          jsCookie.remove('userToken');
          localStorage.removeItem('user');
          navigate('/');
        } catch (error) {
          console.error('회원탈퇴 중 오류 발생:', error);
        }
      }
    }
  };

  const onProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const onNicknameChangeButtonClick = async () => {
    try {
      const token = jsCookie.get('userToken');

      const updatedNickname = profileInfo.UserNickname;

      await axios.post(
        `${baseUrl}/api/userInfo/update-nickname`,
        { UserNickname: updatedNickname },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNicknameChanged(false);
      alert('닉네임 변경이 완료되었습니다.');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 시도해주세요.');
      } else {
        console.error('에러:', error);
      }
    }
  };

  const handlePasswordChange = async event => {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    // 새 비밀번호와 새 비밀번호 확인이 일치하는지 검증
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // API 요청을 통한 비밀번호 변경 로직 구현
    try {
      const token = jsCookie.get('userToken');
      const userId = currentUser && currentUser.id; // 현재 로그인한 사용자 ID 가져오기

      await axios.post(
        `${baseUrl}/api/userinfo/update-password`,
        {
          UserID: userId, // 현재 로그인한 사용자의 ID
          Password: Password, // 현재 비밀번호
          NewPassword: newPassword, // 새 비밀번호
          newPasswordCheck: confirmPassword, // 새 비밀번호 확인, 서버 측에서 이 필드를 기대한다면
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      alert('비밀번호 변경에 실패했습니다. ' + error.response.data);
      console.error('비밀번호 변경 중 오류 발생:', error);
    }
  };

  return (
    <div className='profile-page'>
      <div className='profile-content'>
        <div className='profile-image-container'>
          <form
            className='profile-image-container'
            encType='multipart/form-data'
          >
            <img
              src={profileInfo.ProfileImage || defaultProfileImage}
              alt='Profile'
              className='profile-image'
              onClick={onProfileImageClick}
            />
            <p className='upload-instructions'>
              최대 1MB까지 업로드 가능합니다.
              <br />
              현재 이미지는 현재용으로 측정됩니다.
            </p>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={onProfileImageChange}
            />
            <button
              onClick={onProfileImageChangeButtonClick}
              className='btn-upload'
              disabled={!imageChanged}
            >
              프로필 사진 업로드
            </button>
          </form>
        </div>
        <div className='profile-info'>
          <label className='input-label'>
            닉네임
            <input
              type='text'
              value={profileInfo.UserNickname}
              onChange={onNicknameChange}
              placeholder='닉네임'
              className='input-field-n'
            />
          </label>
          <label className='input-label'>
            이메일
            <input
              type='email'
              value={profileInfo.UserEmail}
              placeholder='이메일'
              className='input-field-e'
              readOnly // 이메일은 읽기 전용
            />
            <span className='email-message'>이메일은 변경할 수 없습니다.</span>
          </label>
          <button
            onClick={onNicknameChangeButtonClick}
            className='btn-save'
            disabled={!nicknameChanged}
          >
            변경 사항 저장
          </button>
        </div>
      </div>
      {/* 비밀번호 변경 */}
      <div className='profile-password-change'>
        <form onSubmit={handlePasswordChange}>
          <div className='password-input-group'>
            <label htmlFor='current-password'>현재 비밀번호</label>
            <input
              id='current-password'
              type='password'
              value={Password}
              onChange={e => setPassword(e.target.value)}
              placeholder='현재 비밀번호 입력'
              className='input-field'
            />
          </div>
          <div className='password-input-group'>
            <label htmlFor='new-password'>새로운 비밀번호</label>
            <input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder='새로운 비밀번호 입력'
              className='input-field'
            />
          </div>
          <div className='password-input-group'>
            <label htmlFor='confirm-password'>새로운 비밀번호 확인</label>
            <input
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder='새로운 비밀번호 확인'
              className='input-field'
            />
          </div>
          <button type='submit'>비밀번호 변경</button>
        </form>
      </div>
      {/* 회원탈퇴 섹션 */}
      <div className='account-deletion-section'>
        <p>
          <h5>탈퇴</h5>를 원하시나요? 서비스에서 탈퇴하면 모든 정보가 삭제되며
          복구할 수 없습니다.
        </p>
        <div className='deletion-warning'>
          서비스에 만족하지 못하셨나요? 탈퇴하기 전에 먼저 개선요청을 해보시는
          건 어떨까요? <br />
          그래도 탈퇴하시겠다면 탈퇴 전에 아래 유의사항을 꼭 읽어주세요! <br />
          🙇🏻‍♂️ 감사합니다 🙇🏻‍♀️ <br />
          <div class='divider'>유의사항</div>
          <br /> 1.계정 탈퇴 시, 올잇원과 랠릿 서비스에서 모두 탈퇴됩니다.
          <br />
          2.탈퇴 시 계정과 관련된 모든 권한이 사라지며 복구할 수 없습니다.
          <br />
          3.직접 작성한 콘텐츠(동영상, 게시물, 댓글 등)는 자동으로 삭제되지
          않으며, 만일 삭제를 원하시면 탈퇴 이전에 삭제가 필요합니다. <br />
          4.탈퇴 후 동일한 메일로 재가입이 가능하나, 탈퇴한 계정과 연동되지
          않습니다. <br />
          5.탈퇴 후 연동된 소셜 계정 정보도 사라지며 소셜 로그인으로 기존 계정
          이용이 불가능합니다. <br />
          6.현재 비밀번호를 입력하고 탈퇴하기를 누르시면 위 내용에 동의하는
          것으로 간주됩니다.
        </div>
        <div className='checkbox-agreement'>
          <input
            type='checkbox'
            id='agree-checkbox'
            checked={agreed}
            onChange={handleAgreementChange}
          />
          <label htmlFor='agree-checkbox'>위 사항에 동의하시겠습니까?</label>
        </div>
        <button
          onClick={handleAccountDeletion}
          className='btn-delete-account'
          disabled={!agreed} // 체크박스가 체크되어 있지 않으면 버튼 비활성화
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Profile;
