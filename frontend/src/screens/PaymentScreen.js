import React, { useState, useEffect, useMemo } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../actions/cartActions'
import Message from '../components/Message'

export default function PaymentScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems, paymentMethod } = cart

  // Determine what’s in the cart
  const hasMadeToOrder = useMemo(() => {
    return cartItems?.some((item) => item.isPrebaked === false)
  }, [cartItems])

  // Allowed methods based on rule
  const allowedMethods = hasMadeToOrder ? ['Card'] : ['Cash']

  const [method, setMethod] = useState(
    allowedMethods.includes(paymentMethod) ? paymentMethod : allowedMethods[0]
  )

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart')
      return
    }

    // If cart changes and previous payment method becomes invalid, reset it
    if (!allowedMethods.includes(method)) {
      setMethod(allowedMethods[0])
    }
  }, [cartItems, navigate, allowedMethods, method])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(method))
    navigate('/placeorder')
  }

  return (
    <div>
      <h1>Payment Method</h1>

      {hasMadeToOrder && (
        <Message variant="info">
          Your cart includes made-to-order items. Card payment is required before we start baking.
        </Message>
      )}

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>

          <Col>
            {allowedMethods.includes('Cash') && (
              <Form.Check
                type="radio"
                label="Cash on collection (prebaked items only)"
                id="Cash"
                name="paymentMethod"
                value="Cash"
                checked={method === 'Cash'}
                onChange={(e) => setMethod(e.target.value)}
              />
            )}

            {allowedMethods.includes('Card') && (
              <Form.Check
                type="radio"
                label="Card (pay now)"
                id="Card"
                name="paymentMethod"
                value="Card"
                checked={method === 'Card'}
                onChange={(e) => setMethod(e.target.value)}
              />
            )}
          </Col>
        </Form.Group>

        <Button type="submit" className="my-3">
          Continue
        </Button>
      </Form>
    </div>
  )
}
