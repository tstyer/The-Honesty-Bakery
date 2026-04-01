import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
    enquiryType: "general",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const subjectText =
      formData.subject.trim() ||
      (formData.enquiryType === "general"
        ? "General enquiry"
        : "Personalised cake order");

    const bodyText = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Enquiry type: ${
        formData.enquiryType === "general"
          ? "General enquiry"
          : "Personalised order"
      }`,
      "",
      formData.message,
    ].join("\n");

    const mailtoLink = `mailto:hello@honestybakery.com?subject=${encodeURIComponent(
      subjectText
    )}&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoLink;
  };

  return (
    <Container className="py-4">
      <h1 className="text-center">Contact Me</h1>

      <p className="text-muted text-center mb-4 lead">
        Got a question, or would like to place a custom / personlised order?
        Let me know and I’ll get back to you as soon as possible.
      </p>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={changeHandler}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={changeHandler}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Enquiry type</Form.Label>
          <Form.Select
            name="enquiryType"
            value={formData.enquiryType}
            onChange={changeHandler}
          >
            <option value="general">General enquiry</option>
            <option value="personalised">Personalised order</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            placeholder="e.g. Custom Order Enquiry"
            value={formData.subject}
            onChange={changeHandler}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="message"
            placeholder="Ask me about my services, what cake you want, date needed, servings, and any flavours/allergies…"
            value={formData.message}
            onChange={changeHandler}
            required
          />
        </Form.Group>

        <Button type="submit" variant="outline-dark" className="add-to-cart">
          Send
        </Button>
      </Form>
    </Container>
  );
}