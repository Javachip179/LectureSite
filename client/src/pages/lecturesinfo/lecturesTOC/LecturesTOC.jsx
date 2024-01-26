import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRegPlayCircle } from 'react-icons/fa';
import './style.scss';

const sections = [
  // 섹션 데이터가 담긴 배열, 예시입니다.
  { title: 'Part 1 : 매트랩에서', lectures: 10, duration: '1시간 21분' },
  // ... 다른 섹션들
  { title: 'Part X : 최종 섹션', lectures: 5, duration: '45분' },
];

const LecturesTOC = () => {
  // 각 섹션의 접힘 상태를 관리하는 state
  const [isSectionOpen, setIsSectionOpen] = useState({});

  // 섹션의 토글 기능을 처리하는 함수
  const toggleSection = section => {
    setIsSectionOpen(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className='lectures-toc'>
      <div className='course-title'>
        카테고리명
        <span className='details'>총 55강 '12시간 15분' 수업</span>
      </div>
      <div className='description'>
        이 강의는 영상, 수업 노트, 첨부 파일이 제공됩니다. 미리보기를 통해
        콘텐츠를 확인해보세요.
      </div>
      <div className='section-container'>
        {sections.map((section, index) => (
          <div
            key={index}
            className={`toc-section ${
              index === 0
                ? 'first-section'
                : index === sections.length - 1
                ? 'last-section'
                : ''
            }`}
          >
            <div
              className='section-header'
              onClick={() => toggleSection(`section${index}`)}
            >
              <div className='header-content'>
                {isSectionOpen[`section${index}`] ? (
                  <FaChevronUp className='chevron-icon' />
                ) : (
                  <FaChevronDown className='chevron-icon' />
                )}
                <span className='section-name'>{section.title}</span>
              </div>
              <span className='section-info'>{`${section.lectures}강 ∙ ${section.duration}`}</span>
            </div>
            {isSectionOpen[`section${index}`] && (
              <div className='lecture-items'>
                <div className='lecture-item'>
                  <FaRegPlayCircle className='play-icon' />
                  <span>셀 너무 많아서 힘들어요</span>
                  <span className='lecture-time'>07:00</span>
                </div>
                <div className='lecture-item'>
                  <FaRegPlayCircle className='play-icon' />
                  <span>셀 너무 많아서 힘들어요</span>
                  <span className='lecture-time'>07:00</span>
                </div>
                <div className='lecture-item'>
                  <FaRegPlayCircle className='play-icon' />
                  <span>셀 너무 많아서 힘들어요</span>
                  <span className='lecture-time'>07:00</span>
                </div>

                {/* 추가 강의 아이템들 */}
              </div>
            )}
          </div>
        ))}
        {/* 추가 섹션들 */}
      </div>
    </div>
  );
};

export default LecturesTOC;
