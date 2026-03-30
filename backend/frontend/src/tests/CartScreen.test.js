// What is used to test to see it renders is 'render' and 'screen'.
// Testing to see a component renders is usually the first test you do.

import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'

// Memory router is a fake router needed for some unit tests
import { MemoryRouter } from "react-router";
import CartScreen from "../screens/CartScreen"

//== Mock env ==//

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (fn) =>
    fn({
        // An array of fake items as objects
      cart: { cartItems: [{
        product: "1",
        name: "Test Cake" 
      }] },
    }),
}))

// Mock React Router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ search: '' }),
}))

// Mock actions
jest.mock('../actions/cartActions', () => ({
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
}))

// == Tests == //

// First test //
test("H1 displays", () => {
    render(
    <MemoryRouter>
      <CartScreen />
    </MemoryRouter>
  );

    // 'i' means to ignore case
    const h1Text = screen.getByText(/Shopping Cart/i)

    expect(h1Text).toBeInTheDocument();
});

// Second test //
test("Image and alt txt renders", () => {
    render(
        <MemoryRouter>
            <CartScreen />
        </MemoryRouter>
    );

    const image = screen.getByAltText(/test cake/i);

    expect(image).toBeInTheDocument();
});