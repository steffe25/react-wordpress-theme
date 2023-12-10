import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './../styles/Header.css';

const NavigationMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation(); // Get the current location
  const mobileMenuRef = useRef(null); 

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/wp-json/steffestheme/v1/menus/primary`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    

    fetchMenuItems();
  }, []);

  useEffect(() => {
    // This effect will run when the location changes
    // It's just here to trigger a re-render
  }, [location]);

  const closeMenu = () => {
    if (mobileMenuRef.current && window.innerWidth <= 992) {
      mobileMenuRef.current.click(); 
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      item.children && item.children.length > 0 ? (
        <NavDropdown title={item.title} id={`dropdown-${item.ID}`} key={item.ID}>
          {item.children.map((subItem) => (
            <NavDropdown.Item key={subItem.ID} href={subItem.url} onClick={closeMenu}>
              {subItem.title}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      ) : (
        <Nav.Link as={NavLink} to={item.url} activeClassName="active-nav-item" key={item.ID} dangerouslySetInnerHTML={{ __html: item.title }} onClick={closeMenu} />
      )
    ));
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="custom-navbar">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggle" ref={mobileMenuRef} />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {renderMenuItems(menuItems)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationMenu;
