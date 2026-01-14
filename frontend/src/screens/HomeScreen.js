import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FeaturedCarousel from '../components/FeaturedCarousel'

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
          <FeaturedCarousel products={products} />

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mb-4">
            <Link to="/prebaked" className="w-100 w-md-auto cta-link text-decoration-none">
              <Button className="cta-btn" size="md" variant="outline-dark">
                Shop Prebaked Cakes
              </Button>
            </Link>

            <Link to="/ready-to-bake" className="w-100 w-md-auto cta-link text-decoration-none">
              <Button className="cta-btn" size="md" variant="outline-dark">
                Shop Ready-to-Bake Cakes
              </Button>
            </Link>
          </div>

          <div className='home-subtext'>
            <h2>We're a small business in Hythe</h2>
            <img
                src="/images/logo_2.png"
                alt="Business logo"
                className="logo"
              />
            <p className='general-p'>
              If you're strolling through Seabrook, you might bump into our Honesty box. Inside, you'll find all our prebaked cakes. <br></br> 
              They're truly one-of-a-kind. It's open to all and also serves doggy treats. <br></br>
              If you'd like to find out more, simply send me a message, right <a href='/contact'>here.</a>  
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default HomeScreen
