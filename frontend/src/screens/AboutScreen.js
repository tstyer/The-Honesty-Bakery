import React from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function aboutScreen() {
    return (
        <Container className='py-5'>
            {/* Title */}
            <Row className='mb-4 text-center'>
                <Col>
                    <h1>About The Bakehouse</h1>
                    <p className='mt-2 lead'>
                        Small-batch cakes, baked honestly and shared locally.
                    </p>
                </Col>
            </Row>

            {/* Image and Text */}
            <Row>
                {/* col=md6 so image and text beside each other on large screens */}
                <Col md={6}>
                    <p>
                        The Honesty Bakehouse started as a small, local project in Seabrook.
                        What began with a single honesty box has grown into a way of sharing
                        homemade cakes with the community. <br />

                        Every bake is made in small batches, using simple ingredients and a
                        lot of care. We believe good food should feel personal, familiar,
                        and a little bit special. <br />

                        Whether you’re picking up a cake for yourself, a friend, or your
                        dog, we hope our bakes bring a moment of comfort to your day.
                    </p>
                </Col>

                <Col md={6}>
                    <img 
                    className='about-image'
                    src="/images/honesty_sign.jpg"
                    alt='Image of the honesty bakehouse sign'
                    >
                    </img>
                </Col>
            </Row>

        </Container>
    )
}