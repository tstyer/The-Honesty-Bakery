import React, { useMemo } from 'react'
import { Button, Card, Col, ListGroup, Row, Image } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'

export default function PlaceOrderScreen() {
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart)
  const { cartItems, paymentMethod } = cart

  const hasMadeToOrder = cartItems.some((item) => item.isPrebaked === false)
  const paymentIsValid = hasMadeToOrder ? paymentMethod === 'Card' : paymentMethod === 'Cash'

  const totals = useMemo(() => {
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    const totalPrice = itemsPrice
    return { itemsPrice, totalPrice }
  }, [cartItems])

  const placeOrderHandler = () => {
    // Later: dispatch(createOrder(...)) and navigate to the real created order id
    const fakeOrderId = Date.now().toString()
    navigate(`/order/${fakeOrderId}`)
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Message>
        Your cart is empty <Link to='/'>Go Back</Link>
      </Message>
    )
  }

  return (
    <div>
      <h1>Place Order</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Collection</h2>
              <p>
                <strong>Pickup only.</strong> You’ll collect your cakes from our location.
              </p>
              <p>
                After payment, you’ll see the collection instructions and estimated ready time.
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod || 'Not selected'}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row className='align-items-center'>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>

                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>

                      <Col md={4}>
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${totals.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totals.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={!paymentMethod || !paymentIsValid}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>

                {!paymentMethod && (
                  <div className='mt-2'>
                    <small>Please select a payment method first.</small>
                  </div>
                )}

                {paymentMethod && !paymentIsValid && (
                  <div className='mt-2'>
                    <small>
                      This cart contains made-to-order items. Card payment is required.
                    </small>
                  </div>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
