import React from 'react';
import NavigationMenu from './NavigationMenu';
import logoImage from './../img/logo.png';
import { Link } from 'react-router-dom';
import './../styles/Header.css';



const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
      <Link to="/">
        <img src={logoImage} alt="Website Logo" className="logo" />
      </Link>
        {/* Replace "/path-to-your-logo.png" with the actual path to your logo */}
      </div>
      <NavigationMenu />
    </header>
  );
};

export default Header;
