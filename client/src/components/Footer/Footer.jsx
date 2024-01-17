import React from 'react';
import ITLogo from '../../img/it.png';
import './style.scss';

const Footer = () => {
  return (
    <footer>
      <hr />
      <img src={ITLogo} alt='' />
      <span>
        Made with ❤️ and <b>React.js</b>.
      </span>
    </footer>
  );
};

export default Footer;
