import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileScreen from '../screens/ProfileScreen'

// mock redux
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}))

// mock child components
jest.mock('../components/Message', () => ({ children }) => <div>{children}</div>)
jest.mock('../components/Loader', () => () => <div>Loading...</div>)

// mock actions
jest.mock('../actions/userActions', () => ({
  getUserDetails: jest.fn(() => ({ type: 'GET_USER_DETAILS' })),
  updateUserProfile: jest.fn((data) => ({
    type: 'UPDATE_USER_PROFILE',
    payload: data,
  })),
}))

const { useSelector } = require('react-redux')
const { updateUserProfile } = require('../actions/userActions')

describe('ProfileScreen', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    useSelector.mockImplementation((selector) =>
      selector({
        userDetails: {
          loading: false,
          error: null,
          user: {
            _id: '1',
            name: 'Travis',
            email: 'travis@test.com',
          },
        },
        userLogin: {
          userInfo: {
            _id: '1',
            name: 'Travis',
          },
        },
        userUpdateProfile: {
          success: false,
          error: null,
          loading: false,
        },
      })
    )
  })

  test('renders profile form with existing user name and email', () => {
    render(<ProfileScreen />)

    expect(screen.getByText(/user profile/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Travis')).toBeInTheDocument()
    expect(screen.getByDisplayValue('travis@test.com')).toBeInTheDocument()
  })

  test('shows password mismatch message when passwords do not match', () => {
    render(<ProfileScreen />)

    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'abc123' },
    })

    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'different123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  test.only('dispatches updateUserProfile when form is submitted with matching passwords', () => {
    render(<ProfileScreen />)

    fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
      target: { value: 'Updated Travis' },
    })

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'updated@test.com' },
    })

    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'abc123' },
    })

    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'abc123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    expect(updateUserProfile).toHaveBeenCalledWith({
      id: '1',
      name: 'Updated Travis',
      email: 'updated@test.com',
      password: 'abc123',
    })

    expect(mockDispatch).toHaveBeenCalled()
  })
})