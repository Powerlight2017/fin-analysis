import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './nav-bar.css';

interface NavBarProps {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isLoggedIn,
  handleLogin,
  handleLogout,
}) => {
  return (
    <Navbar bg="light" expand="lg" className="nav-container">
      <Navbar.Brand as={Link} to="/">
        Fin-Analysis
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-between"
      >
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/edit-expenses">
            Edit expenses
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
        </Nav>
        <div className="login-logout-container">
          {isLoggedIn ? (
            <>
              <span>Welcome!</span>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline-success" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
