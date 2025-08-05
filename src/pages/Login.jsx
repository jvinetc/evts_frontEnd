import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TokenContext } from '../context/TokenContext';
import '../styles/Login.css';
import { LoadingContext } from '../context/LoadingContext';
import { AdminContext } from '../context/AdminContext';

function Login() {
  const url = import.meta.env.VITE_SERVER;;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUsuario } = useContext(AuthContext);
  const { setToken } = useContext(TokenContext);
  const { setLoading } = useContext(LoadingContext);
  const { setAdmin } = useContext(AdminContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${url}/user/login`, formData)
      .then(({ data, status }) => {
        if (status === 401) {
          alert(data.message);
          return;
        }
        let user = data.user;
        if (user.Role.name === 'admin'){
          setAdmin(true);
        }
        setUsuario(user); // ✅ guardamos como objeto
        sessionStorage.setItem("token", data.token); // ✅ persistimos el token
        setToken(data.token); // ✅ actualizamos el contexto
        navigate("/"); // ✅ redirige a otra ruta (perfil o publicaciones)
      })
      .catch(({ response }) => {
        console.error(response.data.message);
        alert(response.data.message);
      }).
      finally(() => setLoading(false));
  };
  return (
    <div className="login-background">
      <div className='login-card'

      >
        <h2 className="text-center mb-4">Inicio de Sesión</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              name="email"
              placeholder="Escribe tu correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button className='login-button' variant="primary" type="submit">
              Ingresar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
