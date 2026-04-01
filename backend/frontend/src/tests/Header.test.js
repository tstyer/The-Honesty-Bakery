import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'

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