import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetailsById } from '../actions/userActions'

export default function UserEditScreen() {
  const dispatch = useDispatch()
  const { id } = useParams()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  useEffect(() => {
    dispatch(getUserDetailsById(id))
  }, [dispatch, id])

  return (
    <>
      <h1>Edit User</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
        </div>
      )}
    </>
  )
}
