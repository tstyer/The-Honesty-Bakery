import Footer from '../components/Footer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'; 


// Test 1 - socials render
test.only("socials render in footer", () => {
    render(
        <Footer />
    );

    const socialText = screen.getByText(/socials/i);

    expect(socialText).toBeInTheDocument(); 
});

