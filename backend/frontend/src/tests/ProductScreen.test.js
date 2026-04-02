import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductScreen from '../screens/ProductScreen'

// mocks
const mockDispatch = jest.fn()
const mockNavigate = jest.fn()

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '123' }),
}))

jest.mock('../actions/productActions', () => ({
  listProductDetails: jest.fn((id) => ({ type: 'LIST_PRODUCT_DETAILS', payload: id })),
  createProductReview: jest.fn((productId, review) => ({
    type: 'CREATE_PRODUCT_REVIEW',
    payload: { productId, review },
  })),
  deleteProductReview: jest.fn((productId, reviewId) => ({
    type: 'DELETE_PRODUCT_REVIEW',
    payload: { productId, reviewId },
  })),
}))

jest.mock('../components/Loader', () => () => <div>Loading...</div>)
jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)
jest.mock('../components/Rating', () => ({ value, text }) => (
  <div>
    Rating: {value} {text}
  </div>
))

const { useSelector } = require('react-redux')
const { createProductReview } = require('../actions/productActions')

const renderWithState = (state) => {
  useSelector.mockImplementation((selectorFn) => selectorFn(state))
  return render(<ProductScreen />)
}

describe('ProductScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders loader while product is loading', () => {
    renderWithState({
      productDetails: {
        loading: true,
        error: null,
        product: {},
      },
      userLogin: {
        userInfo: null,
      },
      productReviewCreate: {},
      productReviewDelete: {},
    })

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('renders product details and navigates to cart with selected quantity', () => {
    renderWithState({
      productDetails: {
        loading: false,
        error: null,
        product: {
          _id: '123',
          name: 'Chocolate Cake',
          image: '/images/cake.jpg',
          rating: 4,
          numReviews: 2,
          price: 15,
          description: 'Rich chocolate cake',
          countInStock: 3,
          reviews: [],
        },
      },
      userLogin: {
        userInfo: null,
      },
      productReviewCreate: {},
      productReviewDelete: {},
    })

    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
    expect(screen.getAllByText(/price:/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/rich chocolate cake/i)).toBeInTheDocument()

    fireEvent.change(screen.getByDisplayValue('1'), {
      target: { value: '2' },
    })

    fireEvent.click(screen.getByRole('button', { name: /add to order/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/cart/123?qty=2')
  })

  test.only('submits a review when logged in user fills out the form', () => {
    renderWithState({
      productDetails: {
        loading: false,
        error: null,
        product: {
          _id: '123',
          name: 'Chocolate Cake',
          image: '/images/cake.jpg',
          rating: 4,
          numReviews: 2,
          price: 15,
          description: 'Rich chocolate cake',
          countInStock: 3,
          reviews: [],
        },
      },
      userLogin: {
        userInfo: {
          _id: 'user1',
          name: 'Travis',
        },
      },
      productReviewCreate: {
        success: false,
        error: null,
        loading: false,
      },
      productReviewDelete: {},
    })

    fireEvent.change(screen.getByLabelText(/rating/i), {
      target: { value: '5' },
    })

    fireEvent.change(screen.getByLabelText(/comment/i), {
      target: { value: 'Amazing cake' },
    })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(createProductReview).toHaveBeenCalledWith('123', {
      rating: 5,
      comment: 'Amazing cake',
    })
  })
})