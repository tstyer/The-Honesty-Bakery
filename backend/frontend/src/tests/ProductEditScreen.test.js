import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductEditScreen from '../screens/ProductEditScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { listProductDetails, updateProduct } from '../actions/productActions'

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}))

jest.mock('../actions/productActions', () => ({
  listProductDetails: jest.fn(),
  updateProduct: jest.fn(),
}))

jest.mock('../components/Loader', () => () => <div>Loading...</div>)
jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)

describe('ProductEditScreen', () => {
  const mockDispatch = jest.fn()
  const mockNavigate = jest.fn()

  const mockProduct = {
    _id: '1',
    name: 'Chocolate Cake',
    price: 15,
    image: '/images/cake.jpg',
    category: 'Cakes',
    countInStock: 8,
    description: 'Rich chocolate sponge',
    productType: 'PREBAKED',
  }

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    useNavigate.mockReturnValue(mockNavigate)
    useParams.mockReturnValue({ id: '1' })

    listProductDetails.mockClear()
    updateProduct.mockClear()
    mockDispatch.mockClear()
    mockNavigate.mockClear()
  })

  test('renders Edit Product heading', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        productDetails: {
          loading: false,
          error: null,
          product: mockProduct,
        },
        productUpdate: {
          loading: false,
          error: null,
          success: false,
        },
        userLogin: {
          userInfo: { isAdmin: true },
        },
      })
    )

    render(<ProductEditScreen />)

    expect(screen.getByText(/edit product/i)).toBeInTheDocument()
  })

  test('loads existing product values into the form', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        productDetails: {
          loading: false,
          error: null,
          product: mockProduct,
        },
        productUpdate: {
          loading: false,
          error: null,
          success: false,
        },
        userLogin: {
          userInfo: { isAdmin: true },
        },
      })
    )

    render(<ProductEditScreen />)

    expect(screen.getByDisplayValue('Chocolate Cake')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15')).toBeInTheDocument()
    expect(screen.getByDisplayValue('/images/cake.jpg')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cakes')).toBeInTheDocument()
    expect(screen.getByDisplayValue('8')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Rich chocolate sponge')).toBeInTheDocument()
    expect(screen.getByLabelText(/product type/i)).toHaveValue('PREBAKED')
  })

  test('dispatches updateProduct with edited form data on submit', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        productDetails: {
          loading: false,
          error: null,
          product: mockProduct,
        },
        productUpdate: {
          loading: false,
          error: null,
          success: false,
        },
        userLogin: {
          userInfo: { isAdmin: true },
        },
      })
    )

    updateProduct.mockReturnValue({ type: 'PRODUCT_UPDATE_REQUEST' })

    render(<ProductEditScreen />)

    fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
      target: { value: 'Vanilla Cake' },
    })

    fireEvent.change(screen.getByPlaceholderText(/enter price/i), {
      target: { value: '20' },
    })

    fireEvent.change(screen.getByPlaceholderText(/enter category/i), {
      target: { value: 'Desserts' },
    })

    fireEvent.change(screen.getByPlaceholderText(/enter stock/i), {
      target: { value: '5' },
    })

    fireEvent.change(screen.getByPlaceholderText(/enter description/i), {
      target: { value: 'Soft vanilla sponge' },
    })

    fireEvent.change(screen.getByLabelText(/product type/i), {
      target: { value: 'READY_TO_BAKE' },
    })

    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    expect(updateProduct).toHaveBeenCalledWith({
      _id: '1',
      name: 'Vanilla Cake',
      price: '20',
      image: '/images/cake.jpg',
      category: 'Desserts',
      countInStock: '5',
      description: 'Soft vanilla sponge',
      productType: 'READY_TO_BAKE',
    })

    expect(mockDispatch).toHaveBeenCalled()
  })
})