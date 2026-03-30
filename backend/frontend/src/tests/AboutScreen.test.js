import AboutScreen from "../screens/AboutScreen.js";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

// need fake router to run full screens like AboutScreen
import { MemoryRouter } from "react-router";

// == no mock env needed here, only fake router ==//

// First test

test.only("screen displays title", () => {
    
    render(<AboutScreen />);

    const title = screen.getByText(/about the bakehouse/i);

    expectExport(title).toBeTruthy;
})
