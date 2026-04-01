import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import { toast } from 'react-toastify'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { search } = useLocation()

  const redirect = new URLSearchParams(search).get('redirect') || '/'

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  useEffect(() => {
    if (userInfo) {
      alert('Logged in successfully')
      setTimeout(() => {
        navigate(redirect)
      }, 500)
    }
  }, [userInfo, navigate, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={6}>
        <h1>Sign In</h1>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Changed label text */}
          <Form.Group controlId="password" className="my-2">
            <Form.Label>User Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {/* Changed button text */}
          <Button type="submit" variant="primary" className="my-3">
            Log Me In
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New here?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>
              Create Account
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}