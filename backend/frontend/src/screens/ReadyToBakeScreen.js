import React, { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function ReadyToBakeScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts('', '', 'READY_TO_BAKE'))
  }, [dispatch])

  return (
    <Container className="py-4">
      <h1 className="prebaked-title py-4">Personalised Cakes</h1>

      <h3 className="prebaked-sub pb-4">
        Browse some of my personalised cake designs below. These cakes are made
        to order and are not available to purchase directly through the website.
        Please get in touch to discuss your design, flavours, size, and date.
      </h3>

      <div className="honey-div">
        <img
          src="/images/honey-prebaked.png"
          alt="Cartoon honey pot"
          className="honey-pot-prebaked"
        />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found</Message>
      ) : (
        products.map((product) => (
          <Row key={product._id} className="align-items-center mb-4 cake-card">
            <Col xs={12} md={4}>
              <div className="prebaked-image-wrap">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="prebaked-image"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/images/placeholder.jpg'
                    }}
                  />
                </Link>
              </div>
            </Col>

            <Col xs={12} md={8}>
              <h3>{product.name}</h3>
              <p className="text-muted">{product.description}</p>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="fw-bold">From £{product.price}</span>

                <Button
                  className="add-to-cart"
                  variant="outline-dark"
                  onClick={() => navigate('/contact')}
                >
                  Enquire Now
                </Button>
              </div>
            </Col>
          </Row>
        ))
      )}
    </Container>
  )
}