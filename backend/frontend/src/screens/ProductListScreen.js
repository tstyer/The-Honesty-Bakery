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

    dispatch(listProducts(1))
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct])

  const deleteHandler = (id) => {
    if (window.confirm('Delete this item?')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className="text-end">
          {userInfo?.isAdmin && (
            <Button
              variant="outline-dark"
              className="my-3 create-product cta-btn"
              onClick={createProductHandler}
            >
              <i className="fas fa-plus"></i> Create Product
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
            {products.map(({ _id, name, price, category }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>{`£${price}`}</td>
                <td>{category}</td>
                <td>
                  <Link to={`/admin/product/${_id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(_id)}
                  >
                    <i className="fas fa-trash"></i>
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