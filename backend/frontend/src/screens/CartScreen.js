import React, { useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

export default function CartScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: productId } = useParams()
  const location = useLocation()

  // Read qty from URL and clamp between 1 and 3
  const rawQty = Number(new URLSearchParams(location.search).get('qty')) || 1
  const qty = Math.min(Math.max(rawQty, 1), 3)

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/payment')
    } else {
      navigate('/login?redirect=/payment')
    }
  }

  console.log('cartItems:', cartItems)

  return (
    <div>
      <h1 className='title_cart'>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush" className='light_border'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <div className="cart-image-wrap">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-image"
                        />
                      </div>
                    </Col>

                    <Col md={3}>
                      <Link to={`/product/${item.product}`} className='product-link'>
                        {item.name} x {item.qty || 1}
                      </Link>
                    </Col>

                    <Col md={2}>£{item.price}</Col>

                    <Col md={3}>
                      <Form.Select
                        value={item.qty || 1}
                        onChange={(e) =>
                          dispatch(addToCart(item.product, Number(e.target.value)))
                        }
                      >
                        {[...Array(Math.min(item.countInStock ?? 3, 3)).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Col>

                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => dispatch(removeFromCart(item.product))}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4} className="subtotal-col">
          <Card className="flex-fill border-0 bg-transparent">
            <ListGroup variant="flush" className='light_border'>
              <ListGroup.Item>
                <h2>
                  Subtotal (
                  {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)})
                  items
                </h2>
                £
                {cartItems
                  .reduce((acc, item) => acc + (item.qty || 1) * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block cta-btn"
                  variant='outline-dark'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
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