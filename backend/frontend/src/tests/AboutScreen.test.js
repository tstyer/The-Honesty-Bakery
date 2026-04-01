import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AboutScreen from '../screens/AboutScreen'

test('about page heading renders', () => {
  render(
    <MemoryRouter>
      <AboutScreen />
    </MemoryRouter>
  )

  expect(
    screen.getByRole('heading', { name: /about.*bakehouse/i })
  ).toBeInTheDocument()
})

test('intro text about honest small-batch cakes renders', () => {
  render(
    <MemoryRouter>
      <AboutScreen />
    </MemoryRouter>
  )

  expect(
    screen.getByText(/small-batch cakes/i)
  ).toBeInTheDocument()

  expect(
    screen.getByText(/honest|honestly/i)
  ).toBeInTheDocument()
})

test('bee image renders', () => {
  render(
    <MemoryRouter>
      <AboutScreen />
    </MemoryRouter>
  )

  expect(
    screen.getByAltText(/bee/i)
  ).toBeInTheDocument()
})

test('home button renders', () => {
  render(
    <MemoryRouter>
      <AboutScreen />
    </MemoryRouter>
  )

  expect(
    screen.getByRole('button', { name: /home/i })
  ).toBeInTheDocument()
})

test('home button links to homepage', () => {
  render(
    <MemoryRouter>
      <AboutScreen />
    </MemoryRouter>
  )

  const homeLink = screen.getByRole('link', { name: /home/i })
  expect(homeLink).toHaveAttribute('href', '/')
})