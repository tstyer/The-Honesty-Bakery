import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'

function Header() {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.userLogin)

  // Pull cart items to show a live cart badge
  const { cartItems } = useSelector((state) => state.cart)

  // Total items in cart
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0)

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar className="brand-bg" expand="lg" collapseOnSelect>
        <Container>
          {/* Logo / Brand */}
          <Navbar.Brand as={Link} to="/">
            <img src="/images/logo_2.png" alt="The Honesty Bakehouse logo" className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* LEFT NAV */}
            <Nav className="me-auto">
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

            {/* CENTER REVIEW MESSAGE */}
            <div className="nav-rating">
              <span className="nav-rating__stars">★★★★★</span>
              <span className="nav-rating__text">rated on Google & Facebook</span>
            </div>

            {/* RIGHT NAV */}
            <Nav>
              {userInfo ? (
                <NavDropdown title={userInfo.name || 'User'} id="username" align="end">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>

                  {userInfo.isAdmin && (
                    <>
                      <NavDropdown.Divider />

                      <NavDropdown.Item as={Link} to="/admin/userlist">
                        Users
                      </NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/admin/productlist">
                        Products
                      </NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/admin/orderlist">
                        Orders
                      </NavDropdown.Item>
                    </>
                  )}

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-user" /> Login
                </Nav.Link>
              )}

              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
                <i className="fas fa-shopping-cart" /> Cart
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header