import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function PrebakedScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Stores selected qty per product id
  const [qtyById, setQtyById] = useState({})

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const addToCartHandler = (id) => {
    const qty = qtyById[id] || 1
    navigate(`/cart/${id}?qty=${qty}`)
  }

  return (
    <Container className="py-4">
      {/* Title */}
      <h1 className="prebaked-title py-4">Prebaked Cakes</h1>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        products.map((product) => (
          <Row key={product._id} className="align-items-center mb-4">
            {/* Product image */}
            <Col xs={12} md={4}>
              <img
                src={product.image}
                alt={product.name}
                className="prebaked-image img-fluid"
              />
            </Col>

            {/* Product content */}
            <Col xs={12} md={8}>
              <h3>{product.name}</h3>
              <p className="text-muted">{product.description}</p>

              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">£{product.price}</span>

                {/* Use Form.Select for dropdown box */}
                <Form.Select
                  value={qtyById[product._id] || 1} /* Original value in dropdown is set to new value OR 1 */
                  onChange={(e) =>
                    setQtyById((prev) => ({
                      ...prev,
                      [product._id]: Number(e.target.value), /* e.target.value is usually a string, so convert to num. */
                    }))
                  }
                  className="w-auto"
                >
                  {[1, 2, 3].map((x) => (
                    <option key={x} value={x}>
                      Qty: {x}
                    </option>
                  ))}
                </Form.Select>

                <Button
                  variant="outline-dark"
                  onClick={() => addToCartHandler(product._id)}
                >
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
