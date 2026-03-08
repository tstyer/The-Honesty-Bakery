import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import {
  listProductDetails,
  createProductReview,
  deleteProductReview,
} from '../actions/productActions'
import {
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_DELETE_REVIEW_RESET,
} from '../constants/productConstants'

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

  const productReviewDelete = useSelector((state) => state.productReviewDelete || {})
  const {
    success: successDeleteReview,
    error: errorDeleteReview,
    loading: loadingDeleteReview,
    } = productReviewDelete

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }

    if (successDeleteReview) {
      dispatch({ type: PRODUCT_DELETE_REVIEW_RESET })
    }

    dispatch(listProductDetails(id))
  }, [dispatch, id, successProductReview, successDeleteReview])

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

  const deleteReviewHandler = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteProductReview(product._id, reviewId))
    }
  }

  return (
    <div>
      <Button
        className="my-3 cta-btn btn-block"
        variant="outline-dark"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid className="product-image" />
            </Col>

            <Col md={3} className="border">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>

                <ListGroup.Item className="product_text">Price: £{product.price}</ListGroup.Item>

                <ListGroup.Item className="product_text">
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3} className="border">
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item className="product_text">
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>£{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className="product_text">
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'Ready To Bake!' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item className="product_text">
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
                      className="btn-block cta-btn product_text"
                      variant="outline-dark"
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
                <Message variant="info" className="product_text">
                  No reviews yet
                </Message>
              )}

              {loadingDeleteReview && <Loader />}
              {errorDeleteReview && <Message variant="danger">{errorDeleteReview}</Message>}

              {product.reviews &&
                product.reviews.map((review) => (
                  <ListGroup variant="flush" key={review._id} className="mb-3">
                    <ListGroup.Item>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{review.name}</strong>

                        {userInfo &&
                          (userInfo.isAdmin ||
                            userInfo._id === review.user ||
                            userInfo.id === review.user) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteReviewHandler(review._id)}
                            >
                              Delete
                            </Button>
                          )}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating value={review.rating} text="" />
                    </ListGroup.Item>
                    <ListGroup.Item>{review.createdAt?.substring(0, 10)}</ListGroup.Item>
                    <ListGroup.Item>{review.comment}</ListGroup.Item>
                  </ListGroup>
                ))}

              <h2 className="mt-4">Write a Review</h2>

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
                      className="product_text"
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
                    <Form.Label className="product_text">Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="my-3 cta-btn btn-block product_text"
                    variant="outline-dark"
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message variant="info" className="product_text">
                  Please log in to write a review
                </Message>
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default ProductScreen