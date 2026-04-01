import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentScreen from '../screens/PaymentScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import { savePaymentMethod, setPaymentResult } from '../actions/cartActions'

// mocks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

jest.mock('@stripe/react-stripe-js', () => ({
  CardElement: () => <div>Card Element</div>,
  useStripe: jest.fn(),
  useElements: jest.fn(),
}))

jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)

jest.mock('../actions/cartActions', () => ({
  savePaymentMethod: jest.fn(),
  setPaymentResult: jest.fn(),
}))

describe('PaymentScreen', () => {
  const mockDispatch = jest.fn()
  const mockNavigate = jest.fn()

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    useNavigate.mockReturnValue(mockNavigate)
    useStripe.mockReturnValue(null)
    useElements.mockReturnValue(null)

    savePaymentMethod.mockImplementation((method) => ({
      type: 'SAVE_PAYMENT_METHOD',
      payload: method,
    }))

    setPaymentResult.mockImplementation((result) => ({
      type: 'SET_PAYMENT_RESULT',
      payload: result,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders Payment heading and cash option for prebaked-only cart', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        cart: {
          cartItems: [
            { product: '1', qty: 1, isPrebaked: true },
          ],
          paymentMethod: '',
          paymentResult: null,
        },
        userLogin: {
          userInfo: { token: 'abc123' },
        },
      })
    )

    render(<PaymentScreen />)

    expect(screen.getByText(/payment/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/cash on collection \(prebaked items only\)/i)
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/card \(pay now\)/i)).not.toBeInTheDocument()
  })

  test('renders card option for made-to-order items', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        cart: {
          cartItems: [
            { product: '1', qty: 1, isPrebaked: false },
          ],
          paymentMethod: '',
          paymentResult: null,
        },
        userLogin: {
          userInfo: { token: 'abc123' },
        },
      })
    )

    render(<PaymentScreen />)

    expect(screen.getByLabelText(/card \(pay now\)/i)).toBeInTheDocument()
    expect(
      screen.queryByLabelText(/cash on collection \(prebaked items only\)/i)
    ).not.toBeInTheDocument()
  })

  test.only('submitting cash payment dispatches actions and navigates to placeorder', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        cart: {
          cartItems: [
            { product: '1', qty: 1, isPrebaked: true },
          ],
          paymentMethod: 'Cash',
          paymentResult: null,
        },
        userLogin: {
          userInfo: { token: 'abc123' },
        },
      })
    )

    render(<PaymentScreen />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(savePaymentMethod).toHaveBeenCalledWith('Cash')
    expect(setPaymentResult).toHaveBeenCalledWith(null)
    expect(mockDispatch).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/placeorder')
  })
})