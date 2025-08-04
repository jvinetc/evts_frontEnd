import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import '../styles/Configuration.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ENDPOINT } from '../util/values';
import { PencilFill } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

function Configuration() {
  const { usuario, setUsuario } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: usuario.name || "",
    last_name: usuario.last_name || "",
    age: usuario.age || 0,
    email: usuario.email || "",
    phone: usuario.phone || "",
    username: usuario.username || "",
    password: "",
  });
  const [file, setFile] = useState([]);
  const [isEdit, setIsEdit] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile([...e.target.files]);
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== "") {
      if (!confirm("Va a modificar su password, desae continuar?")) {
        alert("Operacion cancelada");
        return;
      }
    }
    axios.put(`${ENDPOINT}/users/up/${usuario.id}`, formData)
      .then((response) => {
        console.log(response);
        if (file.length > 0) {
          saveImage(usuario.id);
        } else {
          console.log("sin archivos");
          setUsuario({
            id: usuario.id,
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            age: formData.age,
            registration_date: usuario.registration_date,
            state: usuario.state,
            username: formData.username,
            phone: formData.phone,
            stars: usuario.stars,
            image: usuario.image
          })
          setIsEdit(true);
          setModalMessage("Perfil actualizado correctamente");
          setShowModal(true);
          setTimeout(()=>{
            setShowModal(false);
            setModalMessage("");
            navigate('/configuration');
        }, 2000);
        }

      })
      .catch((error) => {
        console.log(error);
        return;
      })

  };

  const saveImage = (id) => {
    const formD = new FormData();
    formD.append("file", file[0]);

    axios.post(`${ENDPOINT}/images/user/${id}`, formD, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(({ data }) => {
        setUsuario({
          id: usuario.id,
          name: formData.name,
          last_name: formData.last_name,
          email: formData.email,
          age: formData.age,
          registration_date: usuario.registration_date,
          state: usuario.state,
          username: formData.username,
          phone: formData.phone,
          stars: usuario.stars,
          image: data.image.sample_image
        })
        setIsEdit(true);
      })
      .catch((error) => {
        console.log(error);
        return "";
      })
  }
  console.log(usuario);
  return (
    <div className="configuration-background">
      <div  >
        <Card className="configuration-card">
          <Card.Img className="configuration-img" variant="top"
            src={`${ENDPOINT}/uploads/${(usuario.image) ? usuario.image : ""}`} />
          <ListGroup className="list-group-flush">
            <ListGroup.Item className="configuration-item">{`${usuario.name || ""} ${usuario.last_name}`}</ListGroup.Item>
            <ListGroup.Item className="configuration-item">{usuario.phone || ""}</ListGroup.Item>
            <ListGroup.Item className="configuration-item">{usuario.email || ""}</ListGroup.Item>
          </ListGroup>
        </Card>
      </div>
      <div className="register-form">
        <h2 className="register-title">
          Informacion del Usuario <PencilFill title="Editar" size={12} onClick={() => setIsEdit(false)} />
        </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Control
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
              readOnly={isEdit}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Apellidos"
              value={formData.last_name}
              onChange={handleChange}
              required
              readOnly={isEdit}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAge">
            <Form.Control
              type="number"
              name="age"
              placeholder="Edad"
              value={formData.age}
              onChange={handleChange}
              required
              min={18}
              readOnly={isEdit}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPhone">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Telefono"
              value={formData.phone}
              onChange={handleChange}
              required
              readOnly={isEdit}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
              readOnly={isEdit}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              name="email"
              placeholder="Correo electronico"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={isEdit}
            />
          </Form.Group>
          {!isEdit ?
            <>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  readOnly={isEdit}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="file" name="file" placeholder="Agrege sus archivos"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button className="register-button"
                  type="submit"
                >
                  Guardar cambios
                </Button>
              </div>
            </>
            :
            ""
          }
        </Form>
      </div>
        {modalMessage && (
          <Modal show={showModal} onHide={() => setShowModal(false)} centerd>
            <Modal.Body className="tex-center">
              <p>{modalMessage}</p>
            </Modal.Body>
          </Modal>
        )}
    </div>
  )
}

export default Configuration;