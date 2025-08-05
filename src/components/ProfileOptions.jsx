import { Container, Card, Button, Form } from 'react-bootstrap';
import FormSell from './FormSell';
import { useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

const ProfileOptions = ({ usuario, filteredComunas, searchTerm, setSearchTerm, showModal, setLoading, sell, setUsuario }) => {
    const [datos, setDatos] = useState(usuario);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [file, setFile] = useState('');
    const token = sessionStorage.getItem('token');
    const url = import.meta.env.VITE_SERVER;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => setFile([...e.target.files]);

    const saveImage = (id) => {
        const formData = new FormData();
        file.forEach(f => formData.append("file", f));
        axios.post(`${url}/image/user/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(({ data, status }) => {
                if (status === 201) {
                    datos.Images[0].name = data.image.name;
                }
            })
            .catch(console.log);
    };

    const guardarCambios = () => {
        setLoading(true);
        if (datos.firstName === "" || datos.lastName === "" ||
            datos.email === "" || datos.phone === ""
        ) {
            showModal('Todos los campos deben ser llenados');
            return;
        }
        if (datos.password !== '' && datos.confirmPass !== datos.password) {
            showModal('Los password no son iguales');
            return;
        }
        const Authorization = { headers: { Authorization: `Bearer ${token}` } };
        axios.put(`${url}/user`, datos, Authorization)
            .then(({ data, status }) => {
                if (status === 200) {
                    setModoEdicion(false);
                    setDatos(data);
                    saveImage(datos.id);
                    setUsuario(datos);
                    showModal('Datos del usuario actualizados con exito');
                }
            })
            .catch(({ response }) => {
                showModal(response.data.message)
                console.log(response.data.message);
            })
            .finally(() => setLoading(false));
    };
    let mobil = '';
    if (useMediaQuery({ maxWidth: 500 }))
        mobil = '480px';
    return (
        <Container style={{ maxWidth: {mobil}, paddingBottom: '65px' }} className="my-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-3">👤 Perfil de Usuario</Card.Title>
                    {<Form.Group className="mb-3 text-center">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={datos.Images.length > 0 ? `${url}/uploads/${datos.Images[0].name}` : 'https://tse2.mm.bing.net/th/id/OIP.VQeCBzJyv7dwSqO9T3IR4QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'}
                                alt="Foto de perfil"
                                className="rounded-circle border"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            {modoEdicion && (
                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{
                                        position: 'absolute',
                                        bottom: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '120px',
                                    }}
                                />
                            )}
                        </div>
                    </Form.Group>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={datos.firstName}
                                onChange={handleChange}
                                readOnly={!modoEdicion}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={datos.lastName}
                                onChange={handleChange}
                                readOnly={!modoEdicion}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type="test"
                                name="username"
                                value={datos.username}
                                onChange={handleChange}
                                readOnly={!modoEdicion}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={datos.email}
                                onChange={handleChange}
                                readOnly={!modoEdicion}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={datos.phone}
                                onChange={handleChange}
                                readOnly={!modoEdicion}
                            />
                        </Form.Group>
                        {modoEdicion &&
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={datos.password}
                                        onChange={handleChange}
                                        readOnly={!modoEdicion}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confimar Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPass"
                                        value={datos.confirmPass}
                                        onChange={handleChange}
                                        readOnly={!modoEdicion}
                                    />
                                </Form.Group>
                            </>}


                        {modoEdicion ? (
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setModoEdicion(false)}>Cancelar</Button>
                                <Button variant="info" onClick={guardarCambios}>Guardar</Button>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-end">
                                <Button variant="primary" onClick={() => setModoEdicion(true)}>Editar perfil</Button>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            {/* 🏪 Zona para completar tienda y otros datos */}
            {usuario && usuario.Role.name === 'client' ?
                <FormSell filteredComunas={filteredComunas} usuario={usuario} sell={sell}
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm} showModal={showModal} setLoading={setLoading} /> :
                ''}
        </Container>
    )
}

export default ProfileOptions