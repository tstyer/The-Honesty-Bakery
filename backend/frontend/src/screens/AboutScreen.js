import React from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AboutScreen() {
  return (
    <Container className="py-5">
      <h1>About Our Bakehouse</h1>

      <Row className="mb-4 text-center">
        <Col>
          <p className="mt-2 lead">
            Honestly baked small-batch cakes, shared locally.
          </p>
        </Col>
      </Row>

      <Row className="align-items-center justify-content-center g-4">
        <Col md={6} className="about-left">
          <p className="about-text">
            The Honesty Bakehouse began as a small local project in Seabrook,
            growing from one honesty box into something shared with the community.
          </p>

          {/* second paragraph still removed on purpose */}

          <div className="about-bee-wrap">
            <img
              className="about-bee"
              src="/images/bee-about.png"
              alt="bee illustration"
            />
          </div>

          <div className="about-cta">
            <Link to="/" className="text-decoration-none">
              <Button variant="outline-dark">Back Home</Button>
            </Link>
          </div>
        </Col>

        <Col md={6} className="about-right">
          <img
            className="about-image"
            src="/images/mum_shmee.jpg"
            alt="Bakehouse board"
          />
        </Col>
      </Row>
    </Container>
  )
}