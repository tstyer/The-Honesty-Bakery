import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import PreBakedScreen from '../screens/PreBakedScreen'
import { listProducts } from '../actions/productActions'
import { addToCart } from '../actions/cartActions'

// mock redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

// mock action creators
jest.mock('../actions/productActions', () => ({
  listProducts: jest.fn(),
}))

jest.mock('../actions/cartActions', () => ({
  addToCart: jest.fn(),
}))

// mock child components
jest.mock('../components/Loader', () => () => <div>Loading...</div>)

jest.mock('../components/Message', () => ({ children }) => (
  <div>{children}</div>
))

// mock navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

describe('PrebakedScreen', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useDispatch.mockReturnValue(mockDispatch)

    listProducts.mockReturnValue({ type: 'PRODUCT_LIST_REQUEST' })
    addToCart.mockReturnValue({ type: 'CART_ADD_ITEM' })
  })

  test('renders loader and dispatches listProducts on mount', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        productList: {
          loading: true,
          error: null,
          products: [],
        },
        cart: {
          cartItems: [],
        },
      })
    )

    render(
      <MemoryRouter>
        <PreBakedScreen />
      </MemoryRouter>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(listProducts).toHaveBeenCalledWith('', '', 'PREBAKED')
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('renders error message when product loading fails', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        productList: {
          loading: false,
          error: 'Failed to load cakes',
          products: [],
        },
        cart: {
          cartItems: [],
        },
      })
    )

    render(
      <MemoryRouter>
        <PreBakedScreen />
      </MemoryRouter>
    )

    expect(screen.getByText(/failed to load cakes/i)).toBeInTheDocument()
  })

  test.only('renders products and dispatches addToCart with selected quantity', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        productList: {
          loading: false,
          error: null,
          products: [
            {
              _id: '1',
              name: 'Chocolate Cake',
              description: 'Rich chocolate sponge',
              price: 12,
              image: '/images/cake.jpg',
            },
          ],
        },
        cart: {
          cartItems: [],
        },
      })
    )

    render(
      <MemoryRouter>
        <PreBakedScreen />
      </MemoryRouter>
    )

    expect(screen.getByText(/chocolate cake/i)).toBeInTheDocument()
    expect(screen.getByText(/rich chocolate sponge/i)).toBeInTheDocument()
    expect(screen.getByText(/£12/i)).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' },
    })

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(addToCart).toHaveBeenCalledWith('1', 2)
    expect(screen.getByText(/added!/i)).toBeInTheDocument()
  })
})