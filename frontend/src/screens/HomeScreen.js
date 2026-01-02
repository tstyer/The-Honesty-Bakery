import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'  // Importing the action to fetch products

function HomeScreen() {
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())  // Dispatching the action to fetch products when component mounts

  }, [])

  return (
    <div>
      <h1>Honestly Delicious</h1>
      {loading ? <Loader />
      : error ? <Message variant="danger">{error}</Message> :
        <Row>
          {products.map(product => ( /* This arrow function will loop through each product within products, and deliver the info in Col */
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} /> {/* Accessing the individual product inside prod. component */}
              </Col>
        ))}
      </Row>
      }
    </div>
  )

export default HomeScreen
