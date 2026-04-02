import React, { useEffect } from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

export default function ProductListScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const { success: successDelete } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const { success: successCreate, product: createdProduct } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    const isAdminUser = userInfo?.isAdmin === true

    if (!isAdminUser) {
      navigate('/login')
      return
    }

    if (successCreate && createdProduct?._id) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      navigate(`/admin/product/${createdProduct._id}/edit`)
      return
    }

    dispatch(listProducts())
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct])

  const deleteHandler = (id) => {
    if (window.confirm('Delete this item?')) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h2>All Bakery Items</h2>
        </Col>

        <Col className="text-end">
          {userInfo && userInfo.isAdmin && (
            <Button
              variant="dark"
              className="my-3"
              onClick={() => navigate('/admin/product/new')}
            >
              Add Item
            </Button>
          )}
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`}>
                    <Button variant="secondary" className="btn-sm mx-2">
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="warning"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}