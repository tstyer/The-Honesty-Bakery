import React, { useEffect } from 'react'
import { Row, Col, Pagination, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FeaturedCarousel from '../components/FeaturedCarousel'

import { listProducts } from '../actions/productActions'

function HomeScreen({ category }) {
  const dispatch = useDispatch()
  const { search } = useLocation()

  const pageNumber = new URLSearchParams(search).get('page') || 1

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

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
              <Button className="w-100" size="lg" variant="dark">
                Shop Prebaked Cakes
              </Button>
            </Link>

            <Link to="/ready-to-bake" className="w-100 w-md-auto">
              <Button className="w-100" size="lg" variant="outline-dark">
                Shop Ready-to-Bake Cakes
              </Button>
            </Link>
          </div>

          <Row className="g-4 justify-content-center">
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          {pages > 1 && (
            <Pagination className="justify-content-center mt-4">
              {[...Array(pages).keys()].map((x) => (
                <Pagination.Item
                  key={x + 1}
                  active={x + 1 === Number(page)}
                  href={`/?page=${x + 1}`}
                >
                  {x + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}

export default HomeScreen
