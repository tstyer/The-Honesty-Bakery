/* Adds extra DOM matchers like toBeInTheDocument() */
import '@testing-library/jest-dom'

/* Render puts components into a fake DOM so I can test what appears on screen */
import { render, screen } from '@testing-library/react'

/* 
  First we need to mock the Redux environment, because tests do not use
  the real Redux store or <Provider>.

  Here, I tell Jest to use a mock version of react-redux.
  In that mock environment, I provide fake versions of:
  - useDispatch
  - useSelector
*/
jest.mock('react-redux', () => ({
  /* useDispatch normally returns a dispatch function.
     Here we return a fake function that does nothing,
     but Jest can track if it was called. */
  useDispatch: () => jest.fn(),

  /* useSelector normally receives Redux state.
     For tests, we return the shape HomeScreen expects. */
  useSelector: () => ({
    loading: false,
    error: null,
    products: [],
  }),
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

/* 
  Test: check that the main heading text renders on the homepage
*/
test('renders the homepage heading', () => {
  render(<HomeScreen />)

  expect(
    screen.getByRole('heading', { name: /thoughtfully baked/i })
  ).toBeInTheDocument()
})