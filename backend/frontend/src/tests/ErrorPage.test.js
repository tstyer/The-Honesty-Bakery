import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ErrorScreen from "../screens/ErrorScreen.js";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// must import user events if testing when the user does something 
import userEvent from '@testing-library/user-event';

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
    const titleDisplays = screen.getByText(/Page Not found/i);

    // What I expect this variable to do/be/etc... 
    expect(titleDisplays).toBeInTheDocument();
});

// Second
test("Back Home Button Renders", () => {
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    // use getByRole instead of getByText for buttons/links
    const goBackDisplay = screen.getByRole('link', {name: /back home/i});

    expect(goBackDisplay).toBeInTheDocument();
})

// Third - behaviour test to see if when button clicked, used is  navigated to correct page
test("Clicking 'back home' renders home screen", async () => {
    render(
        // the initial entries sets the starting url - I am starting at the error page, testing to see it goes to home
        <MemoryRouter initialEntries={['/error']}>
            <Routes>
                <Route path="/error" element={<ErrorScreen/>} />
                <Route path="/" element={<h2>Fresh Cakes</h2>} />
            </Routes>
        </MemoryRouter>
    );

    const button = screen.getByRole('link', ({name: /back home/i}));

    // wait for user to click the button to render expected screen text
    await userEvent.click(button);

    // after clicking, the new page should have this h2 text
    expect(screen.getByText(/Fresh Cakes/i)).toBeInTheDocument();
});

// Fourth - simple message renders
test("Simple message renders", () => {
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    //Not including full message because that will make it too fragile - will have to be exact. 
    const message = screen.getByText(/oops!/i);

    expect(message).toBeInTheDocument();
});

//5th - Checking Back Home has the href attribute set to '/' (home)
test("Back home has correct destination", () => {
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    const link = screen.getByRole('link', {name: /back home/i});

    expect(link).toHaveAttribute('href', '/');
});

// 6th - footer
test.only("Footer renders text", () => {
  render(<Footer />);

  const footerText = screen.getByText(/honesty bakehry/i);

  expect(footerText).toBeInTheDocument();
});
