// What is used to test to see it renders is 'render' and 'screen'.
// Testing to see a component renders is usually the first test you do.
import { render, screen } from "@testing-library/react"

import CartScreen from "../screens/CartScreen"

test("H1 displays", () => {
    render(CartScreen);

    // 'i' means to ignore case
    const h1Text = screen.getAllByText(/Shopping Cart/i)

    expect(h1Text).toBeInTheDocument();
})