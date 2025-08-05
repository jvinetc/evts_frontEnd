import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Dropdown, Form, InputGroup } from 'react-bootstrap'

const FormSell = ({ setSearchTerm, searchTerm, filteredComunas, sell, usuario, showModal, setLoading, setCreated }) => {
    const token = sessionStorage.getItem('token');
    const [nombreComuna, setNombreComuna] = useState(sell.length === 0 ? '' : sell[0].Comuna.name);
    const [modoEdicion, setModoEdicion] = useState(sell.length === 0 ? true : false);
    const [formData, setFormData] = useState(sell.length === 0 ? {
        name: '',
        userId: '',
        comunaId: '',
        addres: '',
        addresPickup: '',
        state: 'activo'
    } : {
        id: sell[0].id,
        name: sell[0].name,
        userId: sell[0].userId,
        comunaId: sell[0].comunaId,
        addres: sell[0].addres,
        addresPickup: sell[0].addresPickup,
        state: 'activo'
    });
    const url = import.meta.env.VITE_SERVER;
    const handleSelectComuna = (drop) => {
        formData.comunaId = drop.id;
        setNombreComuna(drop.name);
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.name === '' || formData.addresPickup === '' || formData.comunaId === '') {
            showModal('Todos los campos deben ser completados');
            return;
        }
        formData.userId = usuario.id;
        const Authorization = { headers: { Authorization: `Bearer ${token}` } };
        axios.post(`${url}/sell`, formData, Authorization)
            .then(({ status,data }) => {
                if (status === 201) {
                    usuario.Sells[0]=data;
                    showModal("La tienda fue creada con exito");
                    setCreated(true);
                }
            })
            .catch(({ response }) => {
                showModal(response.data.message);
                console.error(response.data.message);
            })
            .finally(() => setLoading(false));
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.name === '' || formData.addresPickup === '' || formData.comunaId === '') {
            showModal('Todos los campos deben ser conpletados');
            return;
        }
        const Authorization = { headers: { Authorization: `Bearer ${token}` } };
        axios.put(`${url}/sell`, formData, Authorization)
            .then(({ status }) => {
                if (status === 201) {
                    showModal("La tienda fue actualizada con exito");
                    setModoEdicion(false);
                }
            })
            .catch(({ response }) => {
                showModal(response.data.message);
                console.error(response.data.message);
            })
            .finally(() => setLoading(false));
    }

    return (
        <Card className="shadow-sm mt-4 border-info">
            <Card.Body>
                <Card.Title className="mb-3">🏪 Datos de la tienda</Card.Title>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de la tienda</Form.Label>
                        <Form.Control type="text" name='name' required
                            value={formData.name} onChange={handleChange} placeholder="Ej: Tienda Express San Bernardo"
                            readOnly={!modoEdicion} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dirección de retiro</Form.Label>
                        <Form.Control type="text" required name='addresPickup'
                            value={formData.addresPickup} onChange={handleChange}
                            readOnly={!modoEdicion} placeholder="Ej: Avenida Central 200" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dirección opcional</Form.Label>
                        <Form.Control type="text" name='addres'
                            value={formData.addres} onChange={handleChange} placeholder="Ej: Avenida Central 200"
                            readOnly={!modoEdicion} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-comuna" style={{ width: '100%' }}
                                readOnly={!modoEdicion}>
                                {!nombreComuna ? 'Buscar Comuna' : nombreComuna}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                                <InputGroup className="p-2">
                                    <Form.Control
                                        placeholder="Escribe una comuna..."
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        value={searchTerm}
                                    />
                                </InputGroup>

                                {filteredComunas.map((comuna) => (
                                    <Dropdown.Item key={comuna.id} eventKey={comuna.id} onClick={() => handleSelectComuna(comuna)}>
                                        {comuna.name}
                                    </Dropdown.Item>
                                ))}

                                {filteredComunas.length === 0 && (
                                    <Dropdown.Item disabled>No se encontraron coincidencias</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    {sell.length === 0 ? <Button variant="success" type='submit'>Guardar tienda</Button> :
                        !modoEdicion ?
                            <Button variant="primary" onClick={() => setModoEdicion(true)}>Editar tienda</Button> :
                            <>
                                <Button variant="success" onClick={handleUpdate}>Guardar Cambios</Button>
                                <Button variant="primary" onClick={() => setModoEdicion(false)}>Cancelar Edicion</Button>
                            </>
                    }
                </Form>
            </Card.Body>
        </Card>
    )
}

export default FormSell