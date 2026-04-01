import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../actions/userActions'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))

// 
test('logo renders with correct alt text', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

  const logo = screen.getByAltText(/the honesty bakehouse logo/i)
  expect(logo).toBeInTheDocument()
})

test('rating message renders', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

  expect(screen.getByText(/rated on google & facebook/i)).toBeInTheDocument()
})

test('main navigation links render', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

test('login link renders when no user is logged in', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

  expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
})

test('shows user name when logged in', () => {
  useSelector.mockImplementation((callback) =>
    callback({
      userLogin: { userInfo: { name: 'Travis' } },
      cart: { cartItems: [] },
    })
  )

  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

  expect(screen.getByText(/travis/i)).toBeInTheDocument()
})

// Test section created to test the logout section
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

jest.mock('../actions/userActions', () => ({
  logout: jest.fn(),
}))

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch)
  logout.mockReturnValue({ type: 'USER_LOGOUT' })
})

afterEach(() => {
  jest.clearAllMocks()
})

test.only('shows logout option when user is logged in', () => {
  useSelector.mockImplementation((callback) =>
    callback({
      userLogin: { userInfo: { name: 'Travis' } },
      cart: { cartItems: [] },
    })
  )

  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )

  fireEvent.click(screen.getByText(/travis/i))

  expect(screen.getByText(/logout/i)).toBeInTheDocument();
})