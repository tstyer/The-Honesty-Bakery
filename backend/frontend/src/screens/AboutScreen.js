import React from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AboutScreen() {
  return (
    <Container className="py-5">
      <Row className="mb-4 text-center">
        <Col>
          <h1>About Our Bakehouse</h1>
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

          <p className="about-text">
            Each bake is made in small batches with simple ingredients and real
            care. Whether it is a cake for yourself, someone else, or even your
            dog, we want it to bring a little comfort to the day.
          </p>

          <div className="about-bee-wrap">
            <img
              className="about-bee"
              src="/images/bee-about.png"
              alt="Bee illustration"
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
            alt="Bakehouse sign"
          />
        </Col>
      </Row>
    </Container>
  )
}