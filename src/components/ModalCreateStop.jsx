import { Modal, Button, Form, Dropdown, InputGroup } from 'react-bootstrap';
import AutoCompleteDirection from './AutoCompleteDirection';

const ModalCreateStop = ({ show, formData, handleChange, nombreServicio, rates, handleSubmit, handleSelectRate,onSelect, 
    /* filteredComunas, searchTerm, setSearchTerm, */ resetForm, showModal,/* handleSelectComuna, nombreComuna, */ isUpdate, handleUpdate }) => {

    return (
        <Modal show={show} onHide={resetForm} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-info fw-bold">Crear nuevo stop</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit} className="register-form">
                    <Form.Floating className="mb-3">
                        <Form.Control
                            type="text"
                            name="addresName"
                            placeholder="Nombre del destinatario"
                            value={formData.addresName}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="formBasicName">Nombre del destinatario</label>
                    </Form.Floating>

                    <Form.Floating className="mb-3">
                        {/* <Form.Control
                            type="text"
                            name="addres"
                            placeholder="Direccion"
                            value={formData.addres}
                            onChange={handleChange}
                            required
                        /> */}
                        <AutoCompleteDirection modoEdicion={true} onSelect={onSelect} showModal={showModal}/>
                        <label htmlFor="formBasicLastName">Direccion</label>
                    </Form.Floating>

                    {/* <Form.Floating className="mb-3">
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-comuna" style={{ width: '100%' }}>
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
                    </Form.Floating> */}
                    <Form.Floating className="mb-3">
                        <Dropdown>
                            <Dropdown.Toggle variant="info" id="dropdown-comuna" style={{ width: '100%' }}>
                                {!nombreServicio ? 'Buscar Servicio' : nombreServicio}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
                                {rates && rates.length === 0 && (
                                    <Dropdown.Item disabled>No se encontraron coincidencias</Dropdown.Item>
                                )}
                                {rates && rates.map((rate) => (
                                    <Dropdown.Item key={rate.id} eventKey={rate.id} onClick={() => handleSelectRate(rate)}>
                                        {`${rate.nameService}......$${rate.price}.-`}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
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
                            name="notes"
                            placeholder="Ej: casa esquina, reja azul"
                            value={formData.notes}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="formBasicPhone">Ej: casa esquina, reja azul</label>
                    </Form.Floating>
                    {!isUpdate ?
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2"
                            style={{ fontWeight: 'bold', fontSize: '1.1rem' }}                        >
                            Crear Pedido
                        </Button> :
                        <Button
                            variant="success"
                            className="w-100 py-2"
                            onClick={handleUpdate}
                            style={{ fontWeight: 'bold', fontSize: '1.1rem' }}                        >
                            Editar pedido
                        </Button>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalCreateStop