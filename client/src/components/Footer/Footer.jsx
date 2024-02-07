import React from 'react';
import './style.scss';
import ITTLogo from '../../img/allitone.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-main-content'>
          <p>환영합니다!</p>
          <p>
            여러분의 성장과 발전을 위한 여정에 동반자가 되어 드릴 강의 사이트,
            올잇원에 오신 것을 환영합니다.
          </p>{' '}
          <p>
            저희는 기술부터 비즈니스, 창의적 취미에 이르기까지 다양한 분야의
            전문가들이 만든 고품질의 강의를 제공합니다.
          </p>{' '}
          <p>
            {' '}
            항상 배우고, 성장하며 살아가는 여러분들에게 실질적인 도움이 되고자,
            최신 트렌드에 맞춘 커리큘럼과 실습 중심의 학습 경험을 제공하기 위해
            노력하고 있습니다.
          </p>
          <p>
            올잇원에서는 자기주도적 학습을 통해 새로운 기술을 습득하고, 커리어를
            한 단계 업그레이드할 수 있습니다.
          </p>{' '}
          <p>
            여러분의 학습 목표가 무엇이든, 올잇원은 그 목표 달성을 위한 최고의
            콘텐츠와 커뮤니티를 제공합니다.
          </p>{' '}
          <p>지금 바로 시작하여 여러분의 가능성을 최대한 발휘해보세요.</p>{' '}
          올잇원과 함께라면, 배움의 여정이 더욱 풍부하고 즐거워질 것입니다!
        </div>
        <div className='footer-social-icons'>
          <a
            href='https://twitter.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href='https://youtube.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
