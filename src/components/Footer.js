import React from 'react';

import logoImage from './../img/logo.png';
import './../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
      <img src={logoImage} alt="Website Logo" className="logo" />
        {/* Add your footer content here */}
      </div>
    </footer>
  );
};

export default Footer;
