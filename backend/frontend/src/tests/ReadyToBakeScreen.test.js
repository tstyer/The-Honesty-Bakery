import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReadyToBakeScreen from '../screens/ReadyToBakeScreen'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'

// mock redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

// mock action
jest.mock('../actions/productActions', () => ({
  listProducts: jest.fn(),
}))

// mock Loader
jest.mock('../components/Loader', () => () => <div>Loading...</div>)

// mock Message
jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)

describe('ReadyToBakeScreen', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    mockDispatch.mockClear()
    listProducts.mockClear()
  })

  test('dispatches listProducts with READY_TO_BAKE on mount', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        productList: {
          loading: false,
          error: null,
          products: [],
        },
      })
    )

    listProducts.mockReturnValue({ type: 'PRODUCT_LIST_REQUEST' })

    render(
      <MemoryRouter>
        <ReadyToBakeScreen />
      </MemoryRouter>
    )

    expect(listProducts).toHaveBeenCalledWith('', '', 'READY_TO_BAKE')
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('shows loader when loading is true', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        productList: {
          loading: true,
          error: null,
          products: [],
        },
      })
    )

    render(
      <MemoryRouter>
        <ReadyToBakeScreen />
      </MemoryRouter>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('renders ready-to-bake products and contact buttons when data loads', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        productList: {
          loading: false,
          error: null,
          products: [
            {
              _id: '1',
              name: 'Vanilla Kit',
              description: 'A simple vanilla cake kit',
              image: '/images/vanilla.jpg',
            },
            {
              _id: '2',
              name: 'Chocolate Kit',
              description: 'A rich chocolate cake kit',
              image: '/images/chocolate.jpg',
            },
          ],
        },
      })
    )

    render(
      <MemoryRouter>
        <ReadyToBakeScreen />
      </MemoryRouter>
    )

    expect(screen.getByText('Vanilla Kit')).toBeInTheDocument()
    expect(screen.getByText('Chocolate Kit')).toBeInTheDocument()
    expect(screen.getByText('A simple vanilla cake kit')).toBeInTheDocument()
    expect(screen.getByText('A rich chocolate cake kit')).toBeInTheDocument()
    expect(screen.getAllByText(/contact me/i)).toHaveLength(2)
  })
})