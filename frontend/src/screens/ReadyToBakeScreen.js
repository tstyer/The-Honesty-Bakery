import React, { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function ReadyToBakeScreen() {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    // Fetch only Ready-to-bake products
    dispatch(listProducts('', '', 'READY_TO_BAKE'))
  }, [dispatch])

  const contactLink =
    'mailto:hello@honestybakery.com?subject=Ready-to-bake%20cake%20enquiry'

  return (
    <Container className="py-4">
      <h1 className="prebaked-title py-4">Personlised cakes</h1>
      <h3 className="prebaked-sub pb-4">
        Choose a cake kit and I’ll help you get the perfect setup. Once you've got an idea, hit any of the 'contact me' buttons to get started!
      </h3>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} xs={12} md={4} className="mb-4">
              <div className="prebaked-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="prebaked-image"
                />
              </div>

              <h3 className="mt-3">{product.name}</h3>
              <p className="text-muted">{product.description}</p>

              <Button className="add-to-cart" variant="outline-dark" href={contactLink}>
                Contact me
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
