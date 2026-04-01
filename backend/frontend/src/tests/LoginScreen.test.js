import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import LoginScreen from '../screens/LoginScreen'

// mock the login action so Jest does not load the real axios file
jest.mock('../actions/userActions', () => ({
  login: jest.fn(() => ({ type: 'USER_LOGIN_MOCK' })),
}))

const renderWithStore = (state) => {
  const store = createStore(() => state)

  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    </Provider>
  )
}

test('renders Sign In heading', () => {
  renderWithStore({
    userLogin: {},
  })

  expect(screen.getByText(/sign in/i)).toBeInTheDocument()
})

test.only('renders email and password inputs', () => {
  renderWithStore({
    userLogin: {},
  })

  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
})

test('renders sign in button', () => {
  renderWithStore({
    userLogin: {},
  })

  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
})

test('allows user to type into inputs', () => {
  renderWithStore({
    userLogin: {},
  })

  const emailInput = screen.getByLabelText(/email address/i)
  const passwordInput = screen.getByLabelText(/password/i)

  fireEvent.change(emailInput, { target: { value: 'test@email.com' } })
  fireEvent.change(passwordInput, { target: { value: '123456' } })

  expect(emailInput.value).toBe('test@email.com')
  expect(passwordInput.value).toBe('123456')
})