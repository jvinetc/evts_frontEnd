import axios from "axios";
import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';
import Modal from 'react-bootstrap/Modal';
import { Card } from "react-bootstrap";
import { LoadingContext } from "../context/LoadingContext";
import { useMediaQuery } from "react-responsive";

function Register() {
  const { setLoading } = useContext(LoadingContext);
  const url = import.meta.env.VITE_SERVER;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmarPassword: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [menssage, setMenssage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    axios.post(`${url}/user/register`, formData)
      .then(({ data, status }) => {
        if (status !== 201) {
          setMenssage(data.message)
        }
        setMenssage(data.message);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          setMenssage("");
          navigate('/');
        }, 3000);
      })
      .catch(({ response }) => {
        console.log(response.data.message);
        setMenssage(response.data.message);
        setShowModal(true);
      }).finally(() => {
        setLoading(false);
      })
  };
  let mobil = '';
  if (useMediaQuery({ maxWidth: 500 }))
    mobil = '480px';
  return (
    <Card className="shadow-lg p-4 mx-auto register-background" style={{ maxWidth: {mobil}, marginTop: '1rem' }}>
      <Card.Body>
        <h2 className="text-center mb-4 register-title">
          Registrarse
        </h2>
        {menssage && (
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Body className="text-center">
              <p>{menssage}</p>
            </Modal.Body>
          </Modal>
        )}

        <Form onSubmit={handleSubmit} className="register-form">
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicName">Nombre</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicLastName">Apellidos</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              type="number"
              name="age"
              placeholder="Edad"
              value={formData.age}
              onChange={handleChange}
              required
              min={18}
            />
            <label htmlFor="formBasicAge">Edad</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              name="phone"
              placeholder="Telefono"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicPhone">Telefono movil</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicUserName">Nombre de Usuario</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              name="email"
              placeholder="Correo electronico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicEmail">Correo Electronico</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicPassword">Password</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              type="password"
              name="confirmarPassword"
              placeholder="Confirmar password"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="formBasicConfirmPassword">Confirme password</label>
          </Form.Floating>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2"
            style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            Registrarse
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Register;
