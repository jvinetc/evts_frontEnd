import { Link } from 'react-router-dom';
//import { useEffect, useState } from 'react';
//import axios from 'axios';
import { ENDPOINT } from '../util/values';
import '../styles/Home.css';
import { Button, Col, Container, Form, FormControl, Navbar, Row } from 'react-bootstrap';
import Comments from '../components/Comments';
import '../App.css';
import { BoxArrowInRight, ChatDotsFill, LightningFill, PersonAdd, Tools } from 'react-bootstrap-icons';
import NavHeader from '../components/NavHeader';
import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext';

function Home() {
  //const navigate = useNavigate();
  const { token } = useContext(TokenContext);
  /*  const [comments, setComments] = useState();
   const [isLoad, setIsLoad] = useState(false); */

  /* useEffect(() => {
    axios.get(`${ENDPOINT}/comments`)
      .then(({ data }) => {
        setComments(data);
        setIsLoad(true);
      })
      .catch(err => {
        console.log(err);
      });
  }, []) */

  const botones = [
    { label: 'Registrate', icon: <PersonAdd className="animated-icon" />, direct: '/register' },
    { label: 'Iniciar Sesion', icon: <BoxArrowInRight className="animated-icon" />, direct: '/login' },
    { label: 'Comentarios de nuestros clientes', icon: <ChatDotsFill className="animated-icon" />, direct: '#' },
    { label: 'Chatea con nostros', icon: <ChatDotsFill className="animated-icon" />, direct: '#' },
  ];

  return (

    <Container className="p-16" style={{ overflowY: 'auto'/* , height: 'calc(100vh - 112px)' */ }}>
      <Form className="mb-3">
        <FormControl type="search" placeholder="Buscar..." className="me-2" />
      </Form>

      {/* Botones con íconos animados */}
      <Row className="flex-grow-1">
        {botones.map((btn, idx) => (
          (token && btn.direct === '/register' || token && btn.direct === '/login' ? '' : <Col key={idx} xs={6} className="mb-3 d-flex justify-content-center align-items-center">
            <Button as={Link} to={btn.direct} variant="light" className="square-btn w-100 d-flex flex-column align-items-center justify-content-center">
              {btn.icon}
              <span>{btn.label}</span>
            </Button>
          </Col>)
        ))}
      </Row>
    </Container>

  );
}

export default Home;