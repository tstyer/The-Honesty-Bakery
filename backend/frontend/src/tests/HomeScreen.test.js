import test from "node:test";
import HomeScreen from "../screens/HomeScreen";
/* Render puts query into a fake DOM for testing */
import { render, screen } from '@testing-library/react'


/* First need to mock the Redux environment, as tests don't use it 
   Here, I am telling jest to use the mock version of react-redux.
   And in that react redux env, I want useDispath, useSelector Hooks. 
*/
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(), /* jest.fn is a fake function. does nothing, but jest tracks if it was called */
  useSelector: () => ({
    loading: false,
    error: null,
    products: [],
  }),
}))

/* mosck react router dom, but requires actual one, except what's listed below */
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '',
  }),
}))

test('Tests headings in homepage', () => {
    render(<HomeScreen />)
    expect(
        screen.getByRole('heading', { name: /thoughtfully baked/i})
    ).toBeInTheDocument()
})