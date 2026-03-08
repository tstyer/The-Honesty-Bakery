import React from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Card, ListGroup, Row, Col, Button } from 'react-bootstrap'
import Message from '../components/Message'

export default function OrderScreen() {
  const location = useLocation()
  const orderData = location.state
  const { id } = useParams()

  const orderItems = orderData?.orderItems || []
  const paymentMethod = orderData?.paymentMethod
  const paymentResult = orderData?.paymentResult
  const itemsPrice = orderData?.itemsPrice || 0
  const totalPrice = orderData?.totalPrice || 0

  // If user refreshes this page, order data may be missing
  // because orders are not being stored in the backend yet
  if (!orderData || !orderItems || orderItems.length === 0) {
    return (
      <Message variant='info'>
        No order data found (cart is empty).{' '}
        <Link to='/cart'>Go back to cart</Link>
      </Message>
    )
  }

  return (
    <div>
      <h1>Order Confirmed</h1>
      <p>
        <strong>Order ID:</strong> {id}
      </p>

      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <h2>Collection</h2>
              <p>
                <strong>Pickup only.</strong>
              </p>
              <p>
                Collection address: <strong>Honesty Bakehouse, Seabrook, CT21 5RB</strong>
              </p>
              <p>
                Estimated ready time: <strong>We’ll confirm by email/text</strong>
              </p>
              <p>Please bring your order ID when collecting.</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h2>Items</h2>
              <ListGroup variant='flush'>
                {orderItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col>{item.name}</Col>
                      <Col className='text-end'>
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
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col className='order_confirmed_text'>Payment</Col>
                  <Col className='text-end'>{paymentMethod || 'Not selected'}</Col>
                </Row>
              </ListGroup.Item>

              {paymentMethod === 'Card' && paymentResult?.status && (
                <ListGroup.Item>
                  <Row>
                    <Col className='order_confirmed_text'>Card Status</Col>
                    <Col className='text-end'>{paymentResult.status}</Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col className='order_confirmed_text'>Items</Col>
                  <Col className='text-end'>${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col className='order_confirmed_text'>Total</Col>
                  <Col className='text-end'>${totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button as={Link} to='/' className='btn-block cta-btn' variant='outline-dark'>
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