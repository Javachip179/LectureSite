import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.scss';
import axios from 'axios';
import { baseUrl } from '../../../config/baseUrl.js';
import jsCookie from 'js-cookie';
import { AuthContext } from '../../../context/authContext.js';
import DefaultImage from '../../../img/defaultProfileImage.png';

const Question = () => {
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { lectureID } = useParams();
  const [categoryData, setCategoryData] = useState({});
  const { currentUser } = useContext(AuthContext);
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrollment, setIsEnrollment] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = jsCookie.get('userToken');
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/lecture/${lectureID}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategoryData(response.data.categories);
        setQuestions(response.data.question);
        setAnswers(response.data.answer);

        // Q&A 데이터 설정
        // 예시에서는 response.data.question을 직접 출력하고 있지만,
        // 실제로는 setQuestions와 같은 상태 설정 함수를 사용하여 상태를 업데이트해야 함
        console.log('questions Data:', response.data.question);
      } catch (error) {
        console.error('강의 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [lectureID]); // lectureID가 변경될 때마다 fetchData 함수를 다시 호출

  const addAnswer = async (questionId, userId, content) => {
    const token = jsCookie.get('userToken');
    try {
      const response = await axios.post(
        `${baseUrl}/api/lecture/add-answers`, // 서버의 엔드포인트로 POST 요청
        {
          QuestionID: questionId,
          UserID: userId,
          Content: content,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      // 답변 추가 후 필요한 상태 업데이트 또는 UI 새로고침
    } catch (error) {
      console.error('답변 추가 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h3 className='lecture-details-title'>Q&A</h3>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            <div>
              <strong>질문: </strong>
              {question.QuestionContent}
              <br />
              <strong>닉네임: </strong>
              {question.UserNickname}
              <br />
              <strong>답변: </strong>
              {question.AnswerContent || '답변 대기 중'}
              <br />
              {!question.AnswerContent && (
                <>
                  <textarea
                    value={newAnswer}
                    onChange={e => setNewAnswer(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      addAnswer(question.QuestionID, newAnswer);
                      setNewAnswer(''); // 답변 후 입력 필드 초기화
                    }}
                  >
                    답변하기
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
