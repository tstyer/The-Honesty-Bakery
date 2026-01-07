import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

export default function ProfileScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success, error: errorUpdate, loading: loadingUpdate } =
    userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      return
    }

    if (!user || !user.name || success) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET })
      dispatch(getUserDetails()) 
    } else {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [dispatch, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      setMessage(null)
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          password,
        })
      )
    }
  }

  return (
    <Row>
      <Col md={6}>
        <h2>User Profile</h2>

        {message && <Message variant="danger">{message}</Message>}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}

        {loadingUpdate && <Loader />}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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
              Update
            </Button>
          </Form>
        )}
      </Col>
    </Row>
  )
}
