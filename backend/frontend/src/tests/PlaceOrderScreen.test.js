import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import PlaceOrderScreen from '../screens/PlaceOrderScreen'
import { CART_CLEAR_ITEMS } from '../constants/cartConstants'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderWithStore = (state) => {
  const store = createStore(() => state)
  store.dispatch = jest.fn()

  const view = render(
    <Provider store={store}>
      <MemoryRouter>
        <PlaceOrderScreen />
      </MemoryRouter>
    </Provider>
  )

  return { store, ...view }
}

describe('PlaceOrderScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Storage.prototype.removeItem = jest.fn()
  })

  test('shows empty cart message when there are no cart items', () => {
    renderWithStore({
      cart: {
        cartItems: [],
        paymentMethod: '',
        paymentResult: null,
      },
    })

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go back/i })).toBeInTheDocument()
  })

  test('enables place order button for prebaked items with cash payment', () => {
    renderWithStore({
      cart: {
        cartItems: [
          {
            product: '1',
            name: 'Chocolate Cake',
            image: '/images/cake.jpg',
            price: 10,
            qty: 2,
            isPrebaked: true,
          },
        ],
        paymentMethod: 'Cash',
        paymentResult: null,
      },
    })

    const button = screen.getByRole('button', { name: /place order/i })

    expect(button).toBeEnabled()
    expect(screen.getByText('$20.00')).toBeInTheDocument()
  })

  test.only('dispatches clear cart and navigates when valid order is placed', () => {
    const { store } = renderWithStore({
      cart: {
        cartItems: [
          {
            product: '1',
            name: 'Chocolate Cake',
            image: '/images/cake.jpg',
            price: 15,
            qty: 1,
            isPrebaked: true,
          },
        ],
        paymentMethod: 'Cash',
        paymentResult: null,
      },
    })

    const button = screen.getByRole('button', { name: /place order/i })
    fireEvent.click(button)

    expect(store.dispatch).toHaveBeenCalledWith({ type: CART_CLEAR_ITEMS })
    expect(localStorage.removeItem).toHaveBeenCalledWith('cartItems')
    expect(mockNavigate).toHaveBeenCalled()
  })
})