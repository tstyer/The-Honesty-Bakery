import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'

import { listProducts } from '../actions/productActions'

function HomeScreen({ category }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { search } = location

  const [bannerMessage, setBannerMessage] = useState('')

  const pageNumber = new URLSearchParams(search).get('page') || 1
  const successMessage = location.state?.successMessage

  const productList = useSelector((state) => state.productList)
  const { loading, error } = productList

  useEffect(() => {
    dispatch(listProducts(pageNumber, category))
  }, [dispatch, pageNumber, category])

  useEffect(() => {
    if (successMessage) {
      setBannerMessage(successMessage)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [successMessage, navigate, location.pathname])

  return (
    <div>
      {bannerMessage && (
        <Message variant="success">{bannerMessage}</Message>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="home-sign">
            <img
              src="/images/toffee_swirl.jpg"
              alt=""
              aria-hidden="true"
              className="home-sign__accent home-sign__accent--left"
            />

            <div className="home-sign__main">
              <div
                className="home-sign__hanger"
                aria-hidden="true"
              />

              <img
                src="/images/honesty_sign.jpg"
                alt="Welcome to The Honesty Bakehouse – restoring faith one bite at a time"
                className="home-sign__image"
              />
            </div>

            <img
              src="/images/coffee_cookie.jpg"
              alt=""
              aria-hidden="true"
              className="home-sign__accent home-sign__accent--right"
            />
          </div>

          <img
            src="/images/bee_2.png"
            alt="Flying bee illustration"
            className="bee-2"
          />

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mb-4">
            <Link
              to="/prebaked"
              className="w-100 w-md-auto cta-link text-decoration-none"
            >
              <Button
                className="cta-btn"
                size="md"
                variant="outline-dark"
              >
                Shop Prebaked Cakes
              </Button>
            </Link>

            <Link
              to="/ready-to-bake"
              className="w-100 w-md-auto cta-link text-decoration-none"
            >
              <Button
                className="cta-btn"
                size="md"
                variant="outline-dark"
              >
                Shop Personalised Cakes
              </Button>
            </Link>
          </div>

          <div className="home-subtext">
            <h2>
              Fresh Cakes{' '}
              <img
                src="/images/spoon.png"
                alt="black baking spoon"
                aria-hidden="true"
                className="home-spoon"
              />{' '}
              Sweet Treats
            </h2>

            <img
              src="/images/logo_2.png"
              alt="The Honesty Bakehouse logo"
              className="logo"
            />

            <div className="text-wrap align-items-center">
              <p className="home-p mt-4 mx-auto">
                <strong>If you're strolling through Seabrook,</strong>{' '}
                you might bump into our honesty box. Inside, you'll find all our
                prebaked cakes. They're truly one-of-a-kind. It's open to all and
                also serves doggy treats. If you'd like to find out more, simply
                send me a message right{' '}
                <a href="/contact">here</a>.
              </p>
            </div>
          </div>
        </>
      )}

      <img
        src="/images/bee_2.png"
        alt="Flying bee illustration"
        aria-hidden="true"
        className="home-bee"
      />
    </div>
  )
}

export default HomeScreen