import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const userLogin = useSelector((state) => state.userLogin)
  const userInfo = userLogin?.userInfo

  return (
    <header>
      <Navbar className="brand-bg" expand="lg" collapseOnSelect>
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/">
            <img
              src="/images/logo_2.png"
              alt="The Honesty Bakehouse logo"
              className="logo"
            />
          </Navbar.Brand>

          <div className="nav-rating">
            <span className="nav-rating__stars">★★★★★</span>
            <span className="nav-rating__text">rated on Google & Facebook</span>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="header-collapse">
            {/* LEFT SIDE */}
            <Nav className="header-left-nav">
              <Nav.Link
                as={NavLink}
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/about"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}
              >
                About
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/contact"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}
              >
                Contact
              </Nav.Link>

              <NavDropdown title="Cakes" id="cakes-dropdown">
                <NavDropdown.Item as={Link} to="/prebaked">
                  Prebaked Cakes
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/ready-to-bake">
                  Personalised Cakes
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {/* RIGHT SIDE */}
            <Nav className="header-right-nav ms-lg-auto">
              {userInfo ? (
                <span>{userInfo.name}</span>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}

              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
                <i className="fas fa-shopping-cart" /> Cart
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header