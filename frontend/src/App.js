import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'

function App() {
  const [publishableKey, setPublishableKey] = useState('')
  const [stripeError, setStripeError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/config/stripe/')
        const key = data?.publishableKey || ''

        if (!key) {
          setStripeError(
            'Stripe publishable key is missing. Check your backend env vars.'
          )
          return
        }

        setPublishableKey(key)
      } catch (err) {
        setStripeError('Failed to load Stripe config from backend.')
      }
    }

    load()
  }, [])

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null
    return loadStripe(publishableKey)
  }, [publishableKey])

  return (
    <Router>
      <Header />

      <main className="py-4 navbar">
        <Container className="container-lg">
          <Routes>
            <Route path="/" element={<HomeScreen />} />

            {/* Profile route */}
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/admin/userlist" element={<UserListScreen />} />

            {/* Product routes */}
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route
              path="/admin/product/:id/edit"
              element={<ProductEditScreen />}
            />

            {/* Cart routes */}
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/cart/:id" element={<CartScreen />} />

            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* Payment route */}
            <Route
              path="/payment"
              element={
                stripeError ? (
                  <div>{stripeError}</div>
                ) : stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <PaymentScreen />
                  </Elements>
                ) : (
                  <div>Loading payments…</div>
                )
              }
            />

            {/* Order routes */}
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </Router>
  )
}

export default App
