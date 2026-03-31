import Footer from '../components/Footer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'; 


// Test 1 - socials render
test("socials render in footer", () => {
    render(
        <Footer />
    );

    const socialText = screen.getByText(/socials/i);

    expect(socialText).toBeInTheDocument(); 
});

// Test 2: Facebook link
test.only("footer has a facebook link", () => {
  render(<Footer />);

  const facebookLink = screen.getByRole("link", { name: /facebook/i });
  expect(facebookLink).toHaveAttribute("href", "https://www.facebook.com");
});

// Test 3: Instagram Link
test("footer has instagram link", () => {
    render(
        <Footer />
    );

    const instaLink = screen.getByText(/instagram/i);

    expect(instaLink).toHaveAttribute("href", "https://instagram.com");
});
