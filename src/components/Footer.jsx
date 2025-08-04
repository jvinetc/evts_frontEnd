import { Container, Row, Col, Image } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row className="footer-row">
          <Col md={6} className="footer-contact">
            <p className="footer-title">Contacto</p>
            <p className="footer-text">+56 9 1234 5678</p>
            <p className="footer-text">contacto@empresa.com</p>
          </Col>
          <Col md={6} className="footer-social">
            <p className="footer-title">Síguenos en redes</p>
            <div className="footer-icons">
              <Image src="/imgs/Logo-facebook.png" width={30} height={30} alt="Red 1" />
              <Image src="/imgs/Logo-instagram.png" width={30} height={30} alt="Red 2" />
              <Image src="/imgs/Logo-linkedin.png" width={30} height={30} alt="Red 3" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="footer-copy">
            <p>© Todos los derechos reservados</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;