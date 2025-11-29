import React from 'react'
import { Container } from 'react-bootstrap'

function Header() {
  return (
    <header>
      <Container>
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              (include an image here - logo)
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarColor01"
              aria-controls="navbarColor01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    Home <span className="visually-hidden">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/about">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    <i className='fas fa-user'></i>Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/cart">
                    <i className='fas fa-shopping-cart'></i>Cart
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
