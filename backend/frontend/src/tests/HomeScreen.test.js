/* Adds extra DOM matchers like toBeInTheDocument() */
import '@testing-library/jest-dom'

/* Render puts components into a fake DOM so I can test what appears on screen */
import { render, screen } from '@testing-library/react'

/* 
  First, I need to mock the Redux environment, because tests do not use
  the real Redux store or <Provider>.

  Here, I tell Jest to use a mock version of react-redux.
  In that mock environment, I provide fake versions of:
  - useDispatch
  - useSelector
*/
const mockUseSelector = jest.fn()
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  /* useDispatch normally returns a dispatch function.
     Here it returns a fake function that does nothing,
     but Jest can track if it was called. */
  useDispatch: () => mockDispatch,

  /* useSelector normally receives Redux state.
     Here it uses a mock function so each test can return different state. */
  useSelector: (selectorFn) => mockUseSelector(selectorFn),
}))

/*
  Mock productActions so Jest never imports axios.
  Only need HomeScreen to render, not to really fetch products.
*/
jest.mock('../actions/productActions', () => ({
  listProducts: () => ({ type: 'PRODUCT_LIST_REQUEST' }),
}))

/* 
  Mock react-router-dom.
  Only mock the parts HomeScreen actually uses.

  - useLocation is mocked so the component can read `search`
  - Link is replaced with a simple wrapper so JSX does not crash
*/
jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    search: '',
  }),

  /* Replace <Link> with a simple component that just renders children */
  Link: ({ children }) => <div>{children}</div>,
}))

/* 
  HomeScreen must be imported AFTER the mocks,
  so it uses the mocked Redux and Router hooks.
*/
import HomeScreen from '../screens/HomeScreen'

beforeEach(() => {
  mockUseSelector.mockReset()
  mockDispatch.mockClear()
})

/* 
  Test: check that the main heading text renders on the homepage
*/
test('renders the homepage heading', () => {
  mockUseSelector.mockReturnValue({
    loading: false,
    error: null,
    products: [],
  })

  render(<HomeScreen />)

  expect(
    screen.getByRole('heading', { name: /thoughtfully baked/i })
  ).toBeInTheDocument()
})

/*
  See if the loading component works
*/
test('shows loader when page is loading', () => {
  mockUseSelector.mockReturnValue({
    loading: true,
    error: null,
    products: [],
  })

  render(<HomeScreen />)

  expect(screen.getByRole('status')).toBeInTheDocument()
})