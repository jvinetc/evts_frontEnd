import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Button, Card, Dropdown, Form, Modal, SplitButton, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { ENDPOINT, MOBILPOINT } from '../util/values';
import { isMobile } from 'react-device-detect';
import DinamicTable from '../components/DinamicTable';
import ModalCreateStop from '../components/ModalCreateStop';
import { useNavigate } from 'react-router-dom';

const Stops = () => {

    const url = isMobile ? MOBILPOINT : ENDPOINT;
    const [formData, setFormData] = useState({
        addresName: '',
        addres: '',
        comunaId: '',
        notes: '',
        rateId: '',
        phone: ''
    });
    const [modals, setModals] = useState({
        showSuccess: false,
        message: "",
        confirmCreate: false,
        confirmMessage: "",
        actionToConfirm: null
    });
    const token = sessionStorage.getItem('token');
    const { usuario } = useContext(AuthContext);
    const [comunas, setComunas] = useState();
    const [stops, setStops] = useState();
    const [isCreate, setIsCreate] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [nombreComuna, setNombreComuna] = useState('');
    const [nombreServicio, setNombreServicio] = useState('');
    const [rates, setRates] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const loadStops = () => {
            if (!usuario)
                navigate('/');

            try {
                axios.get(`${url}/rate`)
                    .then(({ data }) => {
                        setRates(data);
                    })
                    .catch(({ response }) => {
                        console.error(response);
                        showModal(response.data.message);
                    });
                axios.get(`${url}/stop/${usuario.Sells[0].id}`)
                    .then(({ data }) => {
                        setStops(data);
                        setIsLoad(true);
                    })
                    .catch(({ response }) => {
                        console.error(response);
                        showModal(response.data.message);
                    })
            } catch (error) {
                console.error(error);
            }

        }
        loadStops();
    }, [isLoad]);

    const loadComunas = async () => {
        await axios.get(`${url}/comuna`)
            .then(({ data }) => {
                setComunas(data);
            })
            .catch(({ response }) => {
                console.log(response);
                showModal(response.data.menssage);
            })
    }

    const showModal = (message) => {
        setModals(prev => ({ ...prev, message, showSuccess: true }));
        setTimeout(() => setModals(prev => ({ ...prev, showSuccess: false, message: "" })), 2000);
    };

    const viewModal = () => {
        loadComunas();
        setIsCreate(true);
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectComuna = (drop) => {
        formData.comunaId = drop.id;
        setNombreComuna(drop.name);
    }

    const handleSelectRate = (drop) => {
        formData.rateId = drop.id;
        setNombreServicio(drop.nameService.toUpperCase());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //const service = { ...formData, user_id: usuario.id, category: category.toLocaleLowerCase() };
        const Authorization = { headers: { Authorization: `Bearer ${token}` } };
        formData.userId = usuario.id;
        formData.sellId = usuario.Sells[0].id;
        confirmModal("¿Quieres guardar tu delivery con los siguientes datos?", () => {
            axios.post(`${url}/stop`, formData, Authorization)
                .then(({ status }) => {
                    if (status === 201) showModal("Delivery guardado exitosamente");
                    setIsLoad(false);
                })
                .catch(({ response }) => {
                    console.log(response);
                    showModal(response.data.message);
                });
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        //const service = { ...formData, user_id: usuario.id, category: category.toLocaleLowerCase() };
        const Authorization = { headers: { Authorization: `Bearer ${token}` } };
        formData.userId = usuario.id;
        formData.sellId = usuario.Sells[0].id;
        confirmModal("Vas a actualizar tu delivery con los siguinetes datos.", () => {
            axios.put(`${url}/stop`, formData, Authorization)
                .then(({ status }) => {
                    if (status === 200) showModal("Delivery actualizado exitosamente");
                    resetForm();
                    setIsLoad(false);
                })
                .catch(({ response }) => {
                    console.log(response);
                    showModal(response.data.message);
                });
        });
    };

    const confirmModal = (message, action) => {
        setModals(prev => ({ ...prev, confirmMessage: message, confirmCreate: true, actionToConfirm: action }));
    };

    const handleConfirm = () => {
        if (modals.actionToConfirm) modals.actionToConfirm();
        setModals(prev => ({ ...prev, confirmCreate: false, confirmMessage: "", actionToConfirm: null }));
    };

    const cancelConfirm = () => {
        setModals(prev => ({ ...prev, confirmCreate: false, confirmMessage: "", actionToConfirm: null }));
        showModal("Guardado cancelado");
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            addresName: '',
            addres: '',
            comunaId: '',
            notes: '',
            rateId: '',
            phone: ''
        });
        setNombreComuna('');
        setNombreServicio('');
        setIsCreate(false);
    };
    const [searchTerm, setSearchTerm] = useState('');
    let filteredComunas = [];
    if (comunas) {
        filteredComunas = comunas.filter((comuna) =>
            comuna.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return (
        <Card className="shadow-lg p-4 mx-auto" style={{ maxWidth: '500px', marginTop: '1rem' }}>

            <Card.Body>
                <DinamicTable stops={stops} viewModal={viewModal} isLoad={isLoad} setFormData={setFormData}
                setNombreComuna={setNombreComuna} setNombreServicio={setNombreServicio} setIsUpdate={setIsUpdate}/>
            </Card.Body>
            <Modal show={modals.showSuccess} onHide={() => setModals(prev => ({ ...prev, showSuccess: false }))} centered>
                <Modal.Body className="text-center">
                    <p>{modals.message}</p>
                </Modal.Body>
            </Modal>
            <ModalCreateStop show={isCreate} formData={formData} handleChange={handleChange} handleSelectRate={handleSelectRate}
                handleSubmit={handleSubmit} filteredComunas={filteredComunas} searchTerm={searchTerm} nombreServicio={nombreServicio}
                setSearchTerm={setSearchTerm} rates={rates} resetForm={resetForm} handleSelectComuna={handleSelectComuna} nombreComuna={nombreComuna}
                isUpdate={isUpdate} handleUpdate={handleUpdate} />

            <Modal show={modals.confirmCreate} onHide={cancelConfirm} centered>
                <Modal.Body className="text-center">
                    <p>{modals.confirmMessage}</p>
                    <p>Destinatario: {formData.addresName}</p>
                    <p>Telefono: {formData.phone}</p>
                    <p>Direccion: {formData.addres}</p>
                    <p>Referencias: {formData.notes}</p>
                    <p>Comuna: {nombreComuna}</p>
                    <p>Servicio: {nombreServicio}</p>
                    <Button variant="danger" className="me-2" onClick={handleConfirm}>Aceptar</Button>
                    <Button variant="secondary" onClick={cancelConfirm}>Cancelar</Button>
                </Modal.Body>
            </Modal>
        </Card>
    )
}

export default Stops