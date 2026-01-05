import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../actions/cartActions'

export default function PaymentScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { paymentMethod } = cart

  const [method, setMethod] = useState(paymentMethod || 'Cash')

  useEffect(() => {
    // If someone lands here with an empty cart, push them back
    if (!cart.cartItems || cart.cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cart.cartItems, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(method))
    navigate('/placeorder')
  }

  return (
    <div>
      <h1>Payment Method</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>

          <Col>
            <Form.Check
              type='radio'
              label='Cash on collection'
              id='Cash'
              name='paymentMethod'
              value='Cash'
              checked={method === 'Cash'}
              onChange={(e) => setMethod(e.target.value)}
            />
            <Form.Check
              type='radio'
              label='Card (pay on collection)'
              id='Card'
              name='paymentMethod'
              value='Card'
              checked={method === 'Card'}
              onChange={(e) => setMethod(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Button type='submit' className='my-3'>
          Continue
        </Button>
      </Form>
    </div>
  )
}
