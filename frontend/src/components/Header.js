import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

function Header() {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar className="brand-bg" expand="lg" collapseOnSelect>
        <Container>
          {/* Logo */}
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src="/images/logo_2.png"
                alt="Business logo"
                className="logo"
              />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* LEFT NAV */}
            <Nav className="me-auto">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-active" : ""}`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-active" : ""}`
                }
              >
                About
              </NavLink>

              <NavDropdown title="Cakes" id="cakes-dropdown">
                <LinkContainer to="/prebaked">
                  <NavDropdown.Item>Prebaked Cakes</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/ready-to-bake">
                  <NavDropdown.Item>Ready-to-Bake Cakes</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>

            {/* RIGHT NAV */}
            <Nav>
              {userInfo ? (
                <NavDropdown title={userInfo.name || "User"} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  {userInfo.isAdmin && (
                    <>
                      <NavDropdown.Divider />

                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
