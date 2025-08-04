import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-stars';
import { ENDPOINT } from '../util/values';
import '../styles/Interaction.css';
import { Carousel } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Comments from '../components/Comments';

function Interaction() {
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [service, setService] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [stars, setStars] = useState();
  const [images, setImages] = useState();
  const { usuario } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { id } = useParams();
  const token = sessionStorage.getItem('token');
  useEffect(() => {
    axios.get(`${ENDPOINT}/services/${id}`)
      .then(({ data }) => {
        setService(data);
        setComentarios(data.comments);
        setStars(data.stars);
        setImages(data.images);
        setIsLoad(true);
      })
      .catch(err => {
        console.log(err);
      });
  }, [stars]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (comentario.trim() !== '') {
      const data = {
        comment: comentario,
        user_id: usuario.id,
        service_id: service.id
      }
      const Authorization = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios.post(`${ENDPOINT}/comments`,
        data,
        Authorization
      )
        .then(({ data }) => {
          const commentAndUser = {
            comment: data,
            user: { name: usuario.name, last_name: usuario.last_name }
          }
          setComentarios([...comentarios, commentAndUser]);
        })
        .catch(err => console.log(err));

      setComentario('');
    }
  }

  const handleChangeStars = (e) => {
    const data = {
      stars: Number(stars),
      newStars: e
    }
    axios.put(`${ENDPOINT}/services/${id}`, data)
      .then(({ status, data }) => {
        if (status == 200) {
          setModalMessage(`Gracias por calificar nuestro sercicio de :\n${service.name.toUpperCase()}`)
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 2000);
          setStars(data.stars);
        }
      })
      .catch((error) => {
        console.error("Error al cargar servicios:", error);
      });
  }

  return (
    <div className="interaction-background">
      <div >
        <Card className="interaction-card" >
          <Card.Img className="interaction-img" variant="top" src={(usuario) ? `${ENDPOINT}/uploads/${usuario.image}` : "/imgs/Perfil.png"} />
          <Card.Body />
          <ListGroup className="list-group-flush">
            {usuario && token ?
              <>
                <ListGroup.Item className="interaction-item">{`${usuario.name} ${usuario.last_name}`}</ListGroup.Item>
                <ListGroup.Item className="interaction-item">{usuario.phone}</ListGroup.Item>
                <ListGroup.Item className="interaction-item">{usuario.email}</ListGroup.Item>
              </>
              :
              <>
                <ListGroup.Item className="interaction-item">Invitado</ListGroup.Item>
              </>
            }
          </ListGroup>
        </Card>
      </div>
      {!isLoad ?
        <div className="interaction-load">
          Cargando Servicio...
        </div>
        :
        <div className="interaction-form">
          <div className="mb-4">
            <Form onSubmit={handleSubmit}>
              <p className="interaction-title-describe">{service.name}</p>
              <Carousel data-bs-theme="dark" className="interaction-carousel" >
                {images ?
                  images.map((image, key) => (
                    <Carousel.Item key={key}>
                      <img
                        className="interaction-carousel-img"
                        src={`${ENDPOINT}/uploads/${image.sample_image}`}
                        alt={image.sample_image}
                      />
                    </Carousel.Item>
                  ))
                  :
                  <Carousel.Item>
                    <img
                      className="interaction-carousel-img"
                      src="/imgs/Limpieza.png"
                      alt="Sin imagenes para el servicio"
                    />
                    <Carousel.Caption>
                      <h5>Imagen de muestra</h5>
                      <p>Aun no se han cargado imagenes para este servicio</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                }
              </Carousel>
              <p><ReactStars
                count={5}
                value={service.stars}
                size={15}
                color2={'#ffd700'} edit={false} /></p>
              <p><strong>Precios desde: </strong>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(service.price)}</p>
              <p><strong>Autor: </strong>{`${service.userService.name} ${service.userService.last_name}`}</p>
              <p className="interaction-describe">
                {service.description}
              </p>
              {token && usuario ?
                <>
                  <h5>Calificar Servicio:</h5>
                  <ReactStars
                    count={5}
                    onChange={handleChangeStars}
                    size={24}
                    color2={'#ffd700'} />
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="textarea"
                      placeholder="Escribe un comentario"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)} />
                  </Form.Group>

                  <div className="d-flex justify-content-center">
                    <Button variant="primary" type="submit" className="interaction-button">
                      Comentar
                    </Button>
                  </div>
                </>
                :
                ""
              }
            </Form>
          </div>

          {comentarios.length > 0 ? (
            <Comments comments={comentarios} limit={2} style={"mt-4"} origin={"interaction"} userService={service.userService}/>
          ) :
            <h5>Aun no hay comentarios para esta publicacion</h5>
          }

          {/*comentarios.length > 0 && (
              <div className="mt-4">
                <h5>Comentarios:</h5>
                <ul className="interaction-coment-list">
                  {comentarios.map((c) => (
                    <li
                      className="interaction-coment-item"
                      key={c.comment.id}>
                      <div className="interaction-coment-box">
                        <p
                          className="interaction-coment-text"
                          variant='light'>
                          {`${c.user.name} ${c.user.last_name}`}:
                        </p>
                        <p>{c.comment.comment}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )*/}
        </div>
      }
      {modalMessage && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body className="text-center">
            <p>{modalMessage}</p>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Interaction;