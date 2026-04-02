import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { listProducts } from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function PrebakedScreen() {
  const dispatch = useDispatch()

  const [qtyById, setQtyById] = useState({})
  const [justAddedId, setJustAddedId] = useState(null)

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const addToCartHandler = (id) => {
    const selectedQty = qtyById[id] || 1
    dispatch(addToCart(id, 1))
    setJustAddedId(id)
    setTimeout(() => setJustAddedId(null), 1500)
  }

  return (
    <Container className="py-4">
      <h1 className="prebaked-title py-4">Bakery Items</h1>
      <h3 className="prebaked-sub pb-4">
        Choose from our available cakes and treats.
      </h3>

      <div className="honey-div">
        <img
          src="/images/honey-prebaked.png"
          alt="Picture of cartoon honey pot"
          className="honey-pot-prebaked"
        />
      </div>

      {loading ? (
        <div>Please wait...</div>
      ) : error ? (
        <Message variant="danger">Something went wrong</Message>
      ) : (
        products.map((product) => {
          const cartItem = cartItems.find((item) => item.product === product._id)
          const qtyInCart = cartItem ? cartItem.qty : 0

          return (
            <Row key={product._id} className="align-items-center mb-4 cake-card">
              <Col xs={12} md={4}>
                <div className="prebaked-image-wrap">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="prebaked-image"
                    />
                  </Link>
                </div>
              </Col>

              <Col xs={12} md={8}>
                <h3>{product.name}</h3>
                <p className="text-muted">{product.description}</p>

                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">£{product.price}</span>

                  <Form.Select
                    value={qtyById[product._id] || 1}
                    onChange={(e) =>
                      setQtyById((prev) => ({
                        ...prev,
                        [product._id]: Number(e.target.value),
                      }))
                    }
                    className="w-auto"
                    disabled={qtyInCart >= 3}
                  >
                    {[1, 2, 3].map((x) => (
                      <option key={x} value={x}>
                        Qty: {x}
                      </option>
                    ))}
                  </Form.Select>

                  <Button
                    className="add-to-cart"
                    variant="outline-dark"
                    disabled={qtyInCart >= 3}
                    onClick={() => addToCartHandler(product._id)}
                  >
                    Add Item
                  </Button>

                  {justAddedId === product._id && (
                    <small className="text-success">Done!</small>
                  )}
                </div>
              </Col>
            </Row>
          )
        })
      )}
    </Container>
  )
}