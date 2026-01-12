import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

function ProductScreen() {
  const [qty, setQty] = useState(1)

  // review form state
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    success: successProductReview,
    error: errorProductReview,
    loading: loadingProductReview,
  } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }

    dispatch(listProductDetails(id))
  }, [dispatch, id, successProductReview])

  // Convert any old Django-ish paths into React public /images/ paths.
  const rawImage = product?.image || ''

  const normalisedImage = rawImage
    ? `/${rawImage}`.replace(/\/+/, '/')
    : ''

  const imageSrc =
    normalisedImage
      .replace(/^\/static\/images\//, '/images/')
      .replace(/^\/media\/images\//, '/images/')
      .replace(/^\/media\//, '/images/')
      .replace(/^\/static\//, '/images/') || '/images/placeholder.jpg'

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const submitReviewHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(product._id, { rating, comment }))
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={imageSrc} alt={product.name} fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>

                <ListGroup.Item>Price: £{product.price}</ListGroup.Item>

                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>£{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'Ready To Bake!' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add To Order
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* REVIEWS */}
          <Row className="mt-4">
            <Col md={6}>
              <h2>Reviews</h2>

              {product.reviews && product.reviews.length === 0 && (
                <Message variant="info">No reviews yet</Message>
              )}

              {product.reviews &&
                product.reviews.map((review) => (
                  <ListGroup variant="flush" key={review._id} className="mb-3">
                    <ListGroup.Item>
                      <strong>{review.name}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating value={review.rating} text="" />
                    </ListGroup.Item>
                    <ListGroup.Item>{review.createdAt?.substring(0, 10)}</ListGroup.Item>
                    <ListGroup.Item>{review.comment}</ListGroup.Item>
                  </ListGroup>
                ))}

              <h2 className="mt-4">Write a Customer Review</h2>

              {successProductReview && <Message variant="success">Review submitted</Message>}
              {loadingProductReview && <Loader />}
              {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}

              {userInfo ? (
                <Form onSubmit={submitReviewHandler}>
                  <Form.Group controlId="rating" className="my-2">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="0">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="comment" className="my-2">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="my-2">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message variant="info">Please log in to write a review</Message>
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default ProductScreen
