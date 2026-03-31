import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ErrorScreen from "../screens/ErrorScreen.js";
import { MemoryRouter, Route, Routes } from "react-router";

// must import user events if testing when the user does something 
import userEvent from '@testing-library/react';

import Footer from "../components/Footer.js";

// First Test
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
    expect(titleDisplays).toBeInDocument();
});

// Second
test("Go Back Button Renders", () => {
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    // use getByRole instead of getByText for buttons/links
    const goBackDisplay = screen.getByRole('button', {name: /go back/i});

    expect(goBackDisplay).toBeInDocument();
})

// Third - behaviour test to see if when button clicked, used is  navigated to correct page
test.only("Clicking 'go back' renders home screen", async () => {
    render(
        // the initial entries sets the starting url - I am starting at the error page, testing to see it goes to home
        <MemoryRouter initialEntries={['/error']}>
            <Routes>
                <Route path="/error" element={<ErrorScreen/>} />
                <Route path="/" element={<h2>Fresh Cakes</h2>} />
            </Routes>
        </MemoryRouter>
    );

    const button = screen.getByRole('button', ({name: /go back/i}));

    // wait for user to click the button to render expected screen text
    await userEvent.click(button);

    // after clicking, the new page should have this h2 text
    expect(screen.getByText(/Fresh Cakes/i)).toBeInDocument();

})
