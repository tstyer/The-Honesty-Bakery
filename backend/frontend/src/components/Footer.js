import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
            <Col className='text-center py-3'>Copyright &copy; Honesty Bakery</Col>
            <Col className='text-center py-3'>Socials: <a href='https://www.facebook.com' rel='noopener noreferrer' target='_blank'><i class="fa-brands fa-facebook-f"></i></a> | <a href='https://www.instagram.com' rel='noopener noreferrer' target='_blank'><i class="fa-brands fa-instagram"></i></a></Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
