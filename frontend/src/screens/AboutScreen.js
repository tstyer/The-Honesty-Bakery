import React from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AboutScreen() {
  return (
    <Container className="py-5">
      {/* Title */}
      <Row className="mb-4 text-center">
        <Col>
          <h1>About The Bakehouse</h1>
          <p className="mt-2 lead">
            Small-batch cakes, baked honestly and shared locally.
          </p>
        </Col>
      </Row>

      {/* Image and Text */}
      <Row className="align-items-center justify-content-center g-4">
        {/* LEFT: text, bee, CTA */}
        <Col md={6} className="about-left">
          <p className="about-text">
            The Honesty Bakehouse started as a small, local project in Seabrook.
            What began with a single honesty box has grown into a way of sharing
            homemade cakes with the community.
          </p>

          <p className="about-text">
            Every bake is made in small batches, using simple ingredients and a
            lot of care. We believe good food should feel personal, familiar,
            and a little bit special. Whether you’re picking up a cake for
            yourself, a friend, or your dog, we hope our bakes bring a moment of
            comfort to your day.
          </p>

          {/* bee icon */}
          <div className="about-bee-wrap">
            <img
              className="about-bee"
              src="/images/bee-about.png"
              alt="Illustrated bee icon"
            />
          </div>

          {/* CTA */}
          <div className="about-cta">
            <Link to="/" className="text-decoration-none">
              <Button variant="outline-dark">Back Home</Button>
            </Link>
          </div>
        </Col>

        {/* RIGHT: sign image */}
        <Col md={6} className="about-right">
          <img
            className="about-image"
            src="/images/honesty_sign.jpg"
            alt="The Honesty Bakehouse sign"
          />
        </Col>
      </Row>
    </Container>
  )
}
