import React, { useEffect, useMemo, useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Message from '../components/Message'
import { savePaymentMethod, setPaymentResult } from '../actions/cartActions'

export default function PaymentScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const stripe = useStripe()
  const elements = useElements()

  const cart = useSelector((state) => state.cart)
  const { cartItems, paymentMethod, paymentResult } = cart

  const hasMadeToOrder = useMemo(
    () => cartItems?.some((item) => item.isPrebaked === false),
    [cartItems]
  )

  const allowedMethods = hasMadeToOrder ? ['Card'] : ['Cash']

  const [method, setMethod] = useState(
    allowedMethods.includes(paymentMethod) ? paymentMethod : allowedMethods[0]
  )

  const [paying, setPaying] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) navigate('/cart')
  }, [cartItems, navigate])

  useEffect(() => {
    // keep method valid if cart composition changes
    if (!allowedMethods.includes(method)) setMethod(allowedMethods[0])
  }, [allowedMethods, method])

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // CASH FLOW (prebaked only)
    if (method === 'Cash') {
      dispatch(savePaymentMethod('Cash'))
      dispatch(setPaymentResult(null))
      navigate('/placeorder')
      return
    }

    // CARD FLOW (Stripe pay now)
    if (!stripe || !elements) {
      setErrorMsg('Payments are still loading. Try again in a moment.')
      return
    }

    try {
      setPaying(true)

      // Create PaymentIntent on backend (authenticated)
      const { data } = await axios.post(
        '/api/payments/create-payment-intent/',
        {
          cartItems: cartItems.map((i) => ({ product: i.product, qty: i.qty })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const clientSecret = data.clientSecret

      const cardElement = elements.getElement(CardElement)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (result.error) {
        setErrorMsg(result.error.message || 'Payment failed.')
        setPaying(false)
        return
      }

      if (result.paymentIntent?.status !== 'succeeded') {
        setErrorMsg('Payment did not complete. Please try again.')
        setPaying(false)
        return
      }

      // Save success
      dispatch(savePaymentMethod('Card'))
      dispatch(
        setPaymentResult({
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        })
      )

      navigate('/placeorder')
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || err.message || 'Payment failed.')
    } finally {
      setPaying(false)
    }
  }

  const cardPaid = paymentResult?.status === 'succeeded'

  return (
    <div>
      <h1>Payment</h1>

      {hasMadeToOrder && (
        <Message variant="info">
          Your cart includes made-to-order items. Card payment is required before we start baking.
        </Message>
      )}

      {errorMsg && <Message variant="danger">{errorMsg}</Message>}

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

        {method === 'Card' && (
          <div className="my-3">
            <Form.Label>Card details</Form.Label>
            <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: 6 }}>
              <CardElement />
            </div>

            {cardPaid && (
              <div className="mt-2">
                <small>Payment completed ✔</small>
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="my-3" disabled={paying}>
          {method === 'Card' ? (paying ? 'Processing…' : 'Pay & Continue') : 'Continue'}
        </Button>
      </Form>
    </div>
  )
}
