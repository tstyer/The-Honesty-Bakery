import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ErrorScreen from "../screens/ErrorScreen.js";
import { MemoryRouter } from "react-router";
import Footer from "../components/Footer.js";

// Tests to include:
// 1. Page not found message
// 2. 'Go Back' button
// 3. A helpfull message
// 4. A logic test on a simple function
// 5. A footer render and action test

// First Tes
test("Page Title Loads", () => {
    // I first render the screen I want to use in the test
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    // I then create a variable with the data that needs to be tested
    const titleDisplays = screen.findByText(/Page Not found/i);

    // What I expect this variable to do/be/etc... 
    expect(titleDisplays).toBeInDocument;
});

// Second
test("Go Back Button Renders", () => {
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    // more specific to use getByRole instead of getByText for buttons/links
    const goBackDisplay = screen.getByRole('button', {name: /go back/i});

    expect(goBackDisplay).toBeInDocument;
})

// Third - behaviour test to see if when button clicked, used is  navigated to correct page

