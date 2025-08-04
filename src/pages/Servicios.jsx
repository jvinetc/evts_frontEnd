import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { ENDPOINT } from "../util/values";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [file, setFile] = useState([]);
  const { usuario } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  useEffect(() => {
    // API
    axios
      .get(`${ENDPOINT}/services`)
      .then(({ data }) => {
        setServicios(data.slice(0, 5));
      })
      .catch((error) => {
        console.error("Error al cargar servicios:", error);
      });

  }, []);

  const handleFileChange = (e) => {
    setFile([...e.target.files]);
  };
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const service = {
      name: formData.name,
      description: formData.description,
      user_id: usuario[0].id
    }
    const Authorization = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.post(`${ENDPOINT}/services`, service, Authorization)
      .then(({ data }) => {
        saveImage(data.id);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const saveImage = (id) => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("file", file[i]);
    }
    axios.post(`${ENDPOINT}/images/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Servicios Disponibles</h1>
      {servicios.map((servicio) => (
        <div key={servicio.id} className="border p-2 mb-2 rounded">
          <h2 className="font-semibold">{servicio.name}</h2>
          <p>{servicio.description}</p>
          {servicio.images.map((file, index) => (
            <img
              key={index}
              src={`${ENDPOINT}/uploads/${file.sample_image}`}
              alt={file.sample_image}
              width="100"
            />
          ))}
          <div className="d-flex justify-content-center">
            <Button as={Link} to={`/interaction/${servicio.id}`} variant="primary" className="me-2">
              Comentar
            </Button>
          </div>
        </div>
      ))}
      <hr />
      <div
        style={{
          backgroundColor: 'black',
          opacity: 0.7,
          padding: '2rem',
          borderRadius: '15px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "white" }}>Crear servicio</h2>
        {token ?
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Nombre de su servicio</Form.Label>
              <Form.Control type="text" name="name" placeholder="Nombre del servicio"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Agregue una descripcion de su servicio.</Form.Label>
              <Form.Control type="textarea" name="description" placeholder="Descripcion"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>imagenes de su servicio</Form.Label>
              <Form.Control type="file" name="file" placeholder="Agrege sus archivos"
                multiple
                onChange={handleFileChange}
                required />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button style={{ backgroundColor: "#0e2e3c", border: "#0e2e3c", opacity: 1 }} type="submit">
                Grabar servicio
              </Button>
            </div>
          </Form> :
          <h1>Para crear un servicio debes estar registrado</h1>}

      </div>
    </div>
  );
}

export default Servicios;
