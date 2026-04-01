import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import OrderListScreen from '../screens/OrderListScreen'
import { listOrders } from '../actions/orderActions'

// mock redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

// mock action
jest.mock('../actions/orderActions', () => ({
  listOrders: jest.fn(),
}))

// mock Loader + Message so tests stay simple
jest.mock('../components/Loader', () => () => <div>Loading...</div>)
jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)

describe('OrderListScreen', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    listOrders.mockReturnValue({ type: 'ORDER_LIST_REQUEST' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test.only('renders loading state', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        orderList: { loading: true, error: null, orders: [] },
        userLogin: { userInfo: { isAdmin: true } },
      })
    )

    render(
      <MemoryRouter>
        <OrderListScreen />
      </MemoryRouter>
    )

    expect(screen.getByText(/orders/i)).toBeInTheDocument()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('renders error message', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        orderList: { loading: false, error: 'Something went wrong', orders: [] },
        userLogin: { userInfo: { isAdmin: true } },
      })
    )

    render(
      <MemoryRouter>
        <OrderListScreen />
      </MemoryRouter>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  test('renders order data in the table', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        orderList: {
          loading: false,
          error: null,
          orders: [
            {
              _id: '123',
              user: { name: 'Travis' },
              createdAt: '2026-04-01T12:00:00.000Z',
              totalPrice: 49.99,
              isPaid: true,
              paidAt: '2026-04-02T12:00:00.000Z',
              isDelivered: false,
              deliveredAt: '',
            },
          ],
        },
        userLogin: { userInfo: { isAdmin: true } },
      })
    )

    render(
      <MemoryRouter>
        <OrderListScreen />
      </MemoryRouter>
    )

    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('Travis')).toBeInTheDocument()
    expect(screen.getByText('2026-04-01')).toBeInTheDocument()
    expect(screen.getByText('£49.99')).toBeInTheDocument()
    expect(screen.getByText(/details/i)).toBeInTheDocument()
  })
})