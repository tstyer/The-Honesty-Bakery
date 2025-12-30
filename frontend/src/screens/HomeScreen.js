import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import axios from 'axios'

function HomeScreen() {
  const [products, setProducts] = useState([])

  useEffect(() => {

    async function fetchProducts() {

    const { data } = await axios.get('http://127.0.0.1:8000/api/products/')

    setProducts(data)
    }

    fetchProducts()

  }, [])

  return (
    <div>
      <h1>Honestly Delicious</h1>
      <Row>
        {products.map(product => ( /* This arrow function will loop through each product within products, and deliver the info in Col */
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} /> {/* Accessing the individual product inside prod. component */}
            </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomeScreen
