import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'

export default function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { search } = useLocation()

  const redirect = new URLSearchParams(search).get('redirect') || '/'

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  // because register dispatches LOGIN_SUCCESS too, you may also want to observe userLogin
  const userLogin = useSelector((state) => state.userLogin)
  const loggedInUser = userLogin?.userInfo

  useEffect(() => {
    if (userInfo || loggedInUser) navigate(redirect)
  }, [userInfo, loggedInUser, navigate, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    dispatch(register(name, email, password))
  }

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={6}>
        <h1>Register</h1>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an Account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>
              Login
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
