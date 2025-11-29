import React from 'react'
import products from '../products'
import { Row, Col } from 'react-bootstrap'

function HomeScreen() {
  return (
    <div>
      <h1>Honestly Delicious</h1>
      <Row>
        {products.map(product => ( /* This arrow function will loop through each product within products, and deliver the info in Col */
            <Col sm={12} md={6} lg={4} xl={3}>
                <h3>{product.name}</h3>
            </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomeScreen
