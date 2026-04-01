import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from 'react-router-dom'

function Header() {
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
            <Nav className="header-left-nav">
              <Nav.Link
                as={NavLink}
                to="/"
                end
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

            <Nav className="header-right-nav ms-lg-auto">
              <Nav.Link as={Link} to="/login">
                <i className="fas fa-user" /> Login
              </Nav.Link>

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