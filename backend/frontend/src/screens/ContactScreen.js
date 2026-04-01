import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Container className="py-4">
      <h1>Contact Me</h1>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Ask me about my services, what cake you want, date needed, servings, and any flavours/allergies…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>

        <Button type="button">Send</Button>
      </Form>
    </Container>
  );
}