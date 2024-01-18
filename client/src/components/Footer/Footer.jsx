import React from 'react';
import Logo from '../../img/it.png';
import './style.scss';

const Footer = () => {
  return (
    <footer>
      <hr />
      <img src={Logo} alt='' />
      <span>
        Made with ❤️
        <b>React.js</b>.
      </span>
    </footer>
  );
};

export default Footer;
