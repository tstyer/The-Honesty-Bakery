import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails } from '../actions/productActions'

function ProductScreen() 
const [qty, setQty] = useState(1)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(listProductDetails(match.params.id))
    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails
    
  }, [dispatch, match])

  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Go Back</Link>

      {loading ? <Loader /> 
      : error 
      ? <Message variant='danger'>{error}</Message> 
      : (<Row>
        {/* Col 6 takes half width */}
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        { /* col 3 is a quarter */}
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} color='#f8e825' />
            </ListGroup.Item>

            <ListGroup.Item>
              Price: ${product.price}
            </ListGroup.Item>

            <ListGroup.Item>
              Description: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>${product.price}</strong></Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{product.countInStock > 0 ? 'Ready To Bake!' : 'Out of Stock'}</Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty:</Col>
                    <Col xs='auto' className='my-1'>
                      <Form.Control
                        as='select' {/* Type of form is select dropdown */}
                        value={qty}
                        onChange={(e) => setQty(e.target.value)} {/* Update quantity state - value is value I select in dropdown */}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {/* x starts at 0 in arrays so add 1 */}
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>)

              <ListGroup.Item>
                <Button className='btn-block' type='button' disabled={product.countInStock === 0}>
                  Add To Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>)
  }
    </div>
  )
}

export default ProductScreen
