import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './nav-bar.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { AppDispatch, RootState } from '../../redux/store';
import { handleLogout } from '../../handlers/authHandlers';

const NavBar: React.FC = () => {
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.user.isLoggedIn,
  );
  const dispatch: AppDispatch = useAppDispatch();

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
              <Button
                variant="outline-danger"
                onClick={() => handleLogout(dispatch)}
              >
                Logout
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
