import React, { useEffect } from 'react' 
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

export default function CartScreen({ match, location, history }) {
  const productId = match.params.id
  // This will show the actual quantity in the console, was a string, but num is needed
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)
  const { cartItems } = cart
  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }
  
  console.log('Quantity:', cartItems)

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  return (
    <div>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {/* First check if cart is empty */}
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <>
              {/* variant flush removes border */}
              <ListGroup variant='flush'>
                {cartItems.map(item => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>

                      <Col md={3}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>

                      <Col md={2}>
                        ${item.price}
                      </Col>

                      <Col md={3}>
                        <Form.Control
                          as='select'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(addToCart(item.product, Number(e.target.value)))
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>

                      {/* Trash can to remove items from basket */}    
                      <Col md={1}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => dispatch(removeFromCart(item.product))}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  {/* reduce calcs to total, acc (accumulator), item.qty adds the total of an item, starts at 0 */}
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                </h2>
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}{cartItems}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  /* If cart is empty, disable button */
                  disabled={cartItems.length === 0}
                  onClick={() => history.push('/login?redirect=shipping')}>
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup> 
          </Card>
          
        </Col>
      </Row>
    </div>
  )
}
