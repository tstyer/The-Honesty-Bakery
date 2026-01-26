import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [enquiryType, setEnquiryType] = useState("general");

  const submitHandler = (e) => {
    e.preventDefault();

    const subjectToUse =
      subject ||
      (enquiryType === "general"
        ? "General enquiry"
        : "Personalised cake order");

    const bodyToUse = `Name: ${name}
Email: ${email}
Enquiry type: ${enquiryType === "general" ? "General enquiry" : "Personalised order"}

${message}`;

    // For now: open the user's email app with the details pre-filled
    const mailto = `mailto:hello@honestybakery.com?subject=${encodeURIComponent(
      subjectToUse
    )}&body=${encodeURIComponent(bodyToUse)}`;

    window.location.href = mailto;
  };

  return (
    <Container className="py-4">
      <h1 className="prebaked-title py-4">Contact Me</h1>
      <p className="text-muted mb-4">
        Got a question, or would like to place a custom / personlised order? Let
        me know and I’ll get back to you as soon as possible.
      </p>

      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* dropdown */}
        <Form.Group controlId="enquiryType" className="mb-3">
          <Form.Label>Enquiry type</Form.Label>
          <Form.Select
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value)}
          >
            <option value="general">General enquiry</option>
            <option value="personalised">Personalised order</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="subject" className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Ready-to-bake kit enquiry"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="message" className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Tell me what cake you want, date needed, servings, and any flavours/allergies…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="add-to-cart" variant="outline-dark">
          Send
        </Button>
      </Form>
    </Container>
  );
}
