import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
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
  const { cartItems, paymentResult } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin || {}

  const [paying, setPaying] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cardComplete, setCardComplete] = useState(false)

  useEffect(() => {
    dispatch(setPaymentResult(null))
  }, [dispatch])

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cartItems, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!stripe || !elements) {
      setErrorMsg('Payments are still loading. Try again in a moment.')
      return
    }

    const accessToken = userInfo?.token || userInfo?.access
    if (!accessToken) {
      setErrorMsg('You must be logged in to pay by card.')
      return
    }

    try {
      setPaying(true)

      const { data } = await axios.post(
        '/api/payments/create-payment-intent/',
        {
          cartItems: cartItems.map((item) => ({
            product: item.product,
            qty: item.qty,
          })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const clientSecret = data.clientSecret
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        setErrorMsg('Card input is not ready yet. Try again in a moment.')
        setPaying(false)
        return
      }

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
  const stripeReady = !!stripe && !!elements

  return (
    <div>
      <h1 className="text-center">Payment</h1>

      {errorMsg && <Message variant="danger">{errorMsg}</Message>}

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend" className="payment-text">
            Add Payment Details
          </Form.Label>
        </Form.Group>

        <div className="my-3">
          <Form.Label className="payment-text">Card details</Form.Label>

          {!stripeReady ? (
            <Message variant="info">Loading secure payment form…</Message>
          ) : (
            <div
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: 6,
              }}
            >
              <CardElement
                onChange={(e) => {
                  setCardComplete(e.complete)

                  if (e.error) {
                    setErrorMsg(e.error.message)
                  } else {
                    setErrorMsg('')
                  }
                }}
              />
            </div>
          )}

          {cardPaid && (
            <div className="mt-2">
              <small className="payment-text">Payment completed ✔</small>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="my-3 cta-btn"
          variant="outline-dark"
          disabled={paying || !stripeReady || !cardComplete}
        >
          {paying ? 'Processing…' : 'Continue'}
        </Button>
      </Form>
    </div>
  )
}