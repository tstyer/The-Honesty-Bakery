import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

export default function ProductEditScreen() {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [productType, setProductType] = useState('PREBAKED')

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product = {} } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } =
    productUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else if (!product.name || product._id !== productId) {
      dispatch(listProductDetails(productId))
    } else {
      setName(product.name || '')
      setPrice(product.price ?? '')
      setImage(product.image || '')
      setCategory(product.category || '')
      setCountInStock(product.countInStock ?? '')
      setDescription(product.description || '')
      setProductType(product.productType || 'PREBAKED')
    }
  }, [dispatch, navigate, productId, product, successUpdate])

  const uploadFileHandler = (e) => {
    const chosenFile = e.target.files?.[0]
    if (!chosenFile) return
    setImage(`/uploads/${chosenFile.name}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        countInStock,
        description,
        productType,
      })
    )
  }

  return (
    <>
      <h1>Edit Product</h1>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="price" className="my-2">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="number"
              placeholder="Type price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="image" className="my-2">
            <Form.Label>Image Path</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type image path"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="image-file" className="my-2">
            <Form.Label>Select Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {uploading && <Loader />}
          </Form.Group>

          <Form.Group controlId="category" className="my-2">
            <Form.Label>Product Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="productType" className="my-2">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="PREBAKED">PREBAKED</option>
              <option value="READY_TO_BAKE">READY_TO_BAKE</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Type stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="my-2">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Type description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="secondary" className="my-3">
            Save Changes
          </Button>
        </Form>
      )}
    </>
  )
}