import { useContext, useEffect, useState } from 'react';
import Gallery from '../components/Gallery';
import { Container, Row, Col, Form, ListGroup, FormControl, Button, SplitButton, Dropdown, FormGroup, CloseButton } from 'react-bootstrap';
import axios from 'axios';
import Paginator from '../components/Pagination';
import { ENDPOINT } from '../util/values';
import '../styles/Publications.css';
import { BookmarkPlus, BookmarkCheckFill } from 'react-bootstrap-icons';
import { TokenContext } from "../context/TokenContext";
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

function Publications() {
  const [servicios, setServicios] = useState();
  const [count, setCount] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState();
  const [order, setOrder] = useState({
    texto: 'inicial',
    value: 'id_ASC'
  });
  const { token } = useContext(TokenContext);
  const { usuario } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => {
    const us_id = usuario ? `&user_id=${usuario.id}` : '';
    let cat = "";
    if (category && !categoria) {
      cat = `&category=${category}`;
    } else if (!category && categoria) {
      cat = `&category=${categoria}`;
      setCategory(categoria);
    } else if (category && categoria) {
      navigate('/publications');
    }
    const seek = search ? `&search=${search}` : "";
    const queryParams = `?limit=${limit}&page=${page}&order=${order.value}${us_id}${cat}${seek}`;
    axios
      .get(`${ENDPOINT}/services${queryParams}`)
      .then(({ data }) => {
        setServicios(data.response);
        setCount(data.count);
        setIsLoad(true);
      })
      .catch((error) => {
        console.error("Error al cargar servicios:", error);
      });
  }, [page, isLoad, category, order, limit, search]);

  const categorys = [
    {
      value: 'fontaneria',
      texto: 'Fontanería'
    },
    {
      value: 'electricidad',
      texto: 'Electricidad'
    },
    {
      value: 'limpieza',
      texto: 'Limpieza'
    },
    {
      value: 'construccion y montaje',
      texto: 'Construcción y montaje'
    },
  ];
  const orders = [
    {
      texto: 'Peor calificados',
      value: 'stars_DESC'
    },
    {
      texto: 'Mejor calificados',
      value: 'stars_ASC'
    },
    {
      texto: 'Recientes',
      value: 'creation_ASC'
    },
    {
      texto: 'Antiguos',
      value: 'creation_DESC'
    },
    {
      texto: 'Mayor precio',
      value: 'price_ASC'
    },
    {
      texto: 'Menor precio',
      value: 'price_DESC'
    }
  ];

  const showModalMessage = (msg) => {
    setModalMessage(msg);
    setShowModal(true);
    setTimeout(()=> {
      setShowModal(false);
      setModalMessage("");
    },2000);
  };


  const addFavorite = (service_id) => {
    const data = {
      user_id: usuario.id,
      service_id
    }
    axios.post(`${ENDPOINT}/favorites`, data)
      .then(({ data }) => {
        if (data) {
          showModalMessage("Servicio agregado a favoritos");
        }
        setIsLoad(false);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  const deleteFavorite = (service_id) => {
    const queryParams = `?user_id=${usuario.id}&service_id=${service_id}`
    axios.delete(`${ENDPOINT}/favorites${queryParams}`)
      .then(({ data }) => {
        if (data.message === 'eliminado') {
          showModalMessage(`Servicio ${data.message} de favoritos`);
        }
        setIsLoad(false);
      })
      .catch(err => {
        console.log(err.message);
      });
  }
  const handleChange = (e) => {
    if (e.target.value.length >= 3) {
      setSearch(e.target.value)
    } else {
      setSearch('');
    }
  };

  const setParam = () => {
    setCategory('');
    navigate('/publications');
  }

  return (
    <div className="publications-background">
      <h1 className="publications-title">
        Galeria de Publicaciones
      </h1>
      <Form className="publications-form">
        <div className='publications-search w-100'>
          <FormControl
            type="search"
            placeholder="Buscar"
            className="me-2 w-50"
            aria-label="Buscar"
            onChange={handleChange}
          />
          <Button
            className="button-nav"
            variant="outline-primary">Buscar</Button>
        </div>
        <div className='publications-filters-group'>
          <Form.Group className="mb-3">
            <SplitButton
              key='Info'
              id={`dropdown-split-variants-info`}
              variant='custom'
              title='Categorias'
              onSelect={(e) => setCategory(e)}
              size='sm'
              className="publications-filters"
            >
              {categorys.map((option, key) => (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item key={key} eventKey={option.value}>{option.texto}</Dropdown.Item>
                </>
              ))}
            </SplitButton>
          </Form.Group>
          <Form.Group className="mb-3">
            <SplitButton
              key='Info'
              id={`dropdown-split-variants-info`}
              variant='custom'
              title="Ordenado Por"
              onSelect={(e) => {setOrder(orders[e])}}
              size='sm'
              className="publications-filters"
            >
              {orders.map((option, key) => (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item key={key} eventKey={key}>{option.texto}</Dropdown.Item>
                </>
              ))}
            </SplitButton>
          </Form.Group>
          <Form.Group className="mb-3">
            <SplitButton
              key='Info'
              id={`dropdown-split-variants-info`}
              variant='custom'
              title="Cantidad por pagina"
              onSelect={(e) => setLimit(e)}
              size='sm'
              className="publications-filters"
            >
              {[6, 7, 8, 9, 10].map((option, key) => (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item key={key} eventKey={option}>{option}</Dropdown.Item>
                </>
              ))}
            </SplitButton>
          </Form.Group>
        </div>
        <FormGroup className='mb-3 w-100'>
          <table className='publications-active-filters'>
            <tr className='publications-table-filters'>
              <th className='publications-title-table'>Filtros:</th>
              {category ?
                <th>
                  <p className='publications-button'>&nbsp;{category}<CloseButton className="publications-close-button" onClick={() => !categoria ? setCategory('') : setParam()} /></p>
                </th>
                :
                ''
              }
              {order.value !== 'id_ASC' ?
                <th>
                  <p className='publications-button'>&nbsp;{order.texto}<CloseButton className="publications-close-button" 
                  onClick={() => setOrder({texto: 'inicial', value: 'id_ASC'})} /></p>
                </th>
                :
                ''
              }
              {limit !== 5 ?
                <th>
                  <p className='publications-button'>&nbsp;{`${limit} registros p/p`}<CloseButton className="publications-close-button" onClick={() => setLimit(5)} /></p>
                </th>
                :
                ''
              }
            </tr>
          </table>

        </FormGroup>
      </Form>
      {!isLoad ?
        <h1 className="publications-title">Cargando Servicios....</h1>
        :
        <Container className="my-4">
          <Row className="g-4 justify-content-center">
            {!count ?
              <h1 className="publications-title">No existen registros para esta busqueda</h1>
              :
              servicios.map((servicio, index) => (

                <Col key={index} xs={12} sm={6} md={4}>
                  <Gallery
                    title={servicio.name}
                    text={servicio.description}
                    image={`${ENDPOINT}/uploads/${(servicio.images.length !== 0) ? servicio.images[0].sample_image : ""}`}
                    buttonText={'Ver mas...'}
                    id={servicio.id}
                    author={`${servicio.user.name} ${servicio.user.last_name}`}
                    phone={servicio.user.phone}
                    stars={servicio.stars}
                    category={servicio.category}
                    price={new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(servicio.price)}
                    icon={token ? servicio.isFav ?
                      <>
                        <BookmarkCheckFill size={18} onClick={() => deleteFavorite(servicio.id)} />
                      </>
                      :
                      <BookmarkPlus size={18} onClick={() => addFavorite(servicio.id)} />
                      : ""}
                  />
                </Col>
              ))
            }
          </Row>
          <Paginator count={count} limit={limit} page={page} setPage={setPage} />
        </Container>

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

export default Publications;