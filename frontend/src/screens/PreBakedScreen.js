import React, { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function PrebakedScreen() {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  return (
    <Container className="py-4">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        products.map((product) => (
          <Row
            key={product._id}
            className="align-items-center mb-4"
          >
            {/* IMAGE */}
            <Col xs={12} md={4}>
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded"
              />
            </Col>

            {/* CONTENT */}
            <Col xs={12} md={8}>
              <h3>{product.name}</h3>
              <p className="text-muted">
                {product.description}
              </p>

              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">
                  £{product.price}
                </span>

                <Button variant="outline-dark">
                  Add to Cart
                </Button>
              </div>
            </Col>
          </Row>
        ))
      )}
    </Container>
  )
}
