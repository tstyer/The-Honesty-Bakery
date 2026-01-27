import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card, ListGroup, Row, Col, Button } from 'react-bootstrap'
import Message from '../components/Message'

export default function OrderScreen() {
  const { id } = useParams()
  const cart = useSelector((state) => state.cart)
  const { cartItems, paymentMethod } = cart

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)

  // If user refreshes this page, cart may be empty (because you're not storing orders yet)
  if (!cartItems || cartItems.length === 0) {
    return (
      <Message variant="info">
        No order data found (cart is empty).{' '}
        <Link to="/cart">Go back to cart</Link>
      </Message>
    )
  }

  return (
    <div>
      <h1>Order Confirmed</h1>
      <p><strong>Order ID:</strong> {id}</p>

      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <h2>Collection</h2>
              <p><strong>Pickup only.</strong></p>
              <p>Collection address: <strong>Honesty Bakehouse, Seabrook, CT21 5RB</strong></p>
              <p>Estimated ready time: <strong>We’ll confirm by email/text</strong></p>
              <p>Please bring your order ID when collecting.</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h2>Items</h2>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col>{item.name}</Col>
                      <Col className="text-end">
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Payment</Col>
                  <Col className="text-end">{paymentMethod || 'Not selected'}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col className="text-end">${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button as={Link} to="/" className="btn-block">
                  Back to Home
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
