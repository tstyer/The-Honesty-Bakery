import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductListScreen from '../screens/ProductListScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'

// mocks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}))

jest.mock('../components/Loader', () => () => <div>Loading...</div>)
jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)

jest.mock('../actions/productActions', () => ({
  listProducts: jest.fn(),
  deleteProduct: jest.fn(),
  createProduct: jest.fn(),
}))

describe('ProductListScreen', () => {
  const mockDispatch = jest.fn()
  const mockNavigate = jest.fn()

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    useNavigate.mockReturnValue(mockNavigate)

    listProducts.mockReturnValue({ type: 'PRODUCT_LIST_MOCK' })
    deleteProduct.mockReturnValue({ type: 'PRODUCT_DELETE_MOCK' })
    createProduct.mockReturnValue({ type: 'PRODUCT_CREATE_MOCK' })

    jest.clearAllMocks()
  })

  const renderWithState = (state) => {
    useSelector.mockImplementation((callback) => callback(state))
    return render(<ProductListScreen />)
  }

  test.only('renders loader when products are loading', () => {
    renderWithState({
      productList: { loading: true, error: null, products: [] },
      productDelete: { success: false },
      productCreate: { success: false, product: {} },
      userLogin: { userInfo: { isAdmin: true } },
    })

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('redirects non-admin user to login', () => {
    renderWithState({
      productList: { loading: false, error: null, products: [] },
      productDelete: { success: false },
      productCreate: { success: false, product: {} },
      userLogin: { userInfo: null },
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('renders products for admin and dispatches createProduct when button is clicked', () => {
    renderWithState({
      productList: {
        loading: false,
        error: null,
        products: [
          {
            _id: '1',
            name: 'Chocolate Cake',
            price: 12.99,
            category: 'Cake',
          },
        ],
      },
      productDelete: { success: false },
      productCreate: { success: false, product: {} },
      userLogin: { userInfo: { isAdmin: true } },
    })

    expect(screen.getByText(/products/i)).toBeInTheDocument()
    expect(screen.getByText(/chocolate cake/i)).toBeInTheDocument()
    expect(screen.getByText(/£12.99/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /create product/i }))

    expect(createProduct).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PRODUCT_CREATE_MOCK' })
  })
})