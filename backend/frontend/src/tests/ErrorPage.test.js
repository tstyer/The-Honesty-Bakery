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
    render(
        <MemoryRouter>
            <ErrorScreen />
        </MemoryRouter>
    );

    const titleDisplays = screen.findByText(/Page Not found/i);

    expectExport(titleDisplays).toBeInDocument;
});


