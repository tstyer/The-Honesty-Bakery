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

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin || {}

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
  const [cardComplete, setCardComplete] = useState(false)

  useEffect(() => {
    dispatch(setPaymentResult(null))
  }, [dispatch])

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) navigate('/cart')
  }, [cartItems, navigate])

  useEffect(() => {
    if (!allowedMethods.includes(method)) setMethod(allowedMethods[0])
  }, [allowedMethods, method])

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (method === 'Cash') {
      dispatch(savePaymentMethod('Collection'))
      dispatch(setPaymentResult('reset'))
      navigate('/shipping')
      return
    }

    if (!stripe || !elements) {
      setErrorMsg('Payment system is loading.')
      return
    }

    const accessToken = userInfo?.token || userInfo?.access
    if (!accessToken) {
      setErrorMsg('Please sign in first.')
      return
    }

    try {
      setPaying(true)

      const { data } = await axios.post(
        '/api/payments/create-payment-intent/',
        {
          cartItems: cartItems.map((i) => ({ product: i.product, qty: i.qty })),
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
        setErrorMsg('Card input unavailable.')
        setPaying(false)
        return
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (result.error) {
        setErrorMsg(result.error.message || 'Card payment failed.')
        setPaying(false)
        return
      }

      if (result.paymentIntent?.status !== 'succeeded') {
        setErrorMsg('Payment incomplete.')
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
      <h1 className="text-center">{'Payment'}</h1>

      {errorMsg && <Message variant="danger">{errorMsg}</Message>}

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend" className="payment-text">
            Choose Payment Type
          </Form.Label>

          <Col>
            {allowedMethods.includes('Cash') && (
              <Form.Check
                type="radio"
                label={'Cash on collection (prebaked items only)'}
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
                label="Pay by card now"
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
            <Form.Label className="payment-text">Enter card info</Form.Label>

            {!stripeReady ? (
              <Message variant="info">Card form loading...</Message>
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
                <small className="payment-text">Paid successfully</small>
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="my-3 cta-btn"
          variant="outline-dark"
          disabled={
            paying ||
            (method === 'Card' && (!stripeReady || !cardComplete))
          }
        >
          {method === 'Card'
            ? paying
              ? 'Paying...'
              : 'Review Order'
            : 'Next Step'}
        </Button>
      </Form>
    </div>
  )
}