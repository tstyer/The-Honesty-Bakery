import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FeaturedCarousel from '../components/FeaturedCarousel'
import Footer from '../components/Footer'

import { listProducts } from '../actions/productActions'

function HomeScreen({ category }) {
  const dispatch = useDispatch()
  const { search } = useLocation()

  const pageNumber = new URLSearchParams(search).get('page') || 1

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts(pageNumber, category))
  }, [dispatch, pageNumber, category])

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Image as header / title */}
          <div className="home-sign">
  <img
    src="/images/toffee_swirl.jpg"
    alt=""
    aria-hidden="true"
    className="home-sign__accent home-sign__accent--left"
  />

  <div className="home-sign__main">
    <div className="home-sign__hanger" aria-hidden="true" />
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


          {/* CTA buttons */}
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
                Shop Ready-to-Bake Cakes
              </Button>
            </Link>
          </div>

          {/* Supporting copy */}
          <div className="home-subtext">
            <h2>
              Thoughtfully Baked{' '}
              <img
                src="/images/spoon.png"
                alt=""
                className="home-spoon"
              />{' '}
              Honestly Delicious
            </h2>

            <img
              src="/images/logo_2.png"
              alt="Business logo"
              className="logo"
            />

            <div className="text-wrap align-items-center">
              <p className="general-p mt-4 mx-auto">
                <strong>If you're strolling through Seabrook,</strong> you might
                bump into our honesty box. Inside, you'll find all our prebaked
                cakes. They're truly one-of-a-kind. It's open to all and also
                serves doggy treats. If you'd like to find out more, simply send
                me a message, right <a href="/contact">here</a>.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default HomeScreen
