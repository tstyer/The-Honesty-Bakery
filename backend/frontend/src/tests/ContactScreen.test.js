import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ContactScreen from '../screens/ContactScreen'

describe('ContactScreen', () => {

  // 1. Renders heading + button
  test.only('renders contact form heading and send button', () => {
    render(<ContactScreen />)

    expect(screen.getByText(/contact me/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  // 2. User can type into inputs
  test('allows user to type into form fields', () => {
    render(<ContactScreen />)

    const nameInput = screen.getByPlaceholderText(/your name/i)
    const messageInput = screen.getByPlaceholderText(/ask me about my services/i)

    fireEvent.change(nameInput, { target: { value: 'Travis' } })
    fireEvent.change(messageInput, { target: { value: 'I want a cake' } })

    expect(nameInput.value).toBe('Travis')
    expect(messageInput.value).toBe('I want a cake')
  })

  // 3. Form submission triggers mailto redirect
  test('submitting form sets window.location.href', () => {
    delete window.location
    window.location = { href: '' }

    render(<ContactScreen />)

    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'Travis' },
    })

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'test@email.com' },
    })

    fireEvent.change(screen.getByPlaceholderText(/ask me about my services/i), {
      target: { value: 'Hello there' },
    })

    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(window.location.href).toContain('mailto:')
  })

})