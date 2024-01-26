import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './style.scss';

const Question = () => {
  // 이 부분에는 실제 질문 데이터를 받아오는 로직이 포함되어야 합니다.
  const questions = [
    // 예시 데이터
    {
      id: 1,
      title: 'Node.js가 너무 어렵다',
      content: 'Node.js 내용이 ... 어렵다', // 실제 내용으로 대체해야 함
      author: 'javachip179',
      date: '2024.12.11',
    },
    // 추가 질문들...
  ];

  return (
    <div className='question-container'>
      <div className='search-bar'>
        <input type='text' placeholder='검색' />
        <FaSearch />
      </div>
      {questions.map(question => (
        <div key={question.id} className='question-item'>
          <div className='question-title'>{question.title}</div>
          <div className='question-content'>{question.content}</div>
          <div className='question-footer'>
            <span className='question-author'>{question.author}</span>
            <span className='question-date'>{question.date}</span>
            <FaTimes className='question-close' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Question;
