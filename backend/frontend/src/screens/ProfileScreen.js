import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')
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

    if (!user || !user._id || success) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET })
      dispatch(getUserDetails())
    } else {
      setFullName('')
      setUserEmail('')
    }
  }, [dispatch, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password === confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      setMessage(null)
      dispatch(
        updateUserProfile({
          id: user._id,
          name: fullName,
          email: userEmail,
          password: '',
        })
      )
    }
  }

  return (
    <Row>
      <Col md={6}>
        <h2>Profile Settings</h2>

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
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Type your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password" className="my-2">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-2">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="secondary" className="my-3">
              Save Changes
            </Button>
          </Form>
        )}
      </Col>
    </Row>
  )
}