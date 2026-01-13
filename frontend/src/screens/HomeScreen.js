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
            <Link to="/prebaked" className="w-100 w-md-auto">
              <Button className="w-100 cta-btn" size="lg" variant="outline-dark">
                Shop Prebaked Cakes
              </Button>
            </Link>

            <Link to="/ready-to-bake" className="w-100 w-md-auto">
              <Button className="w-100 cta-btn" size="lg" variant="outline-dark">
                Shop Ready-to-Bake Cakes
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default HomeScreen
