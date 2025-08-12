import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Button, Card, Dropdown, Form, Modal, SplitButton, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import DinamicTable from '../components/DinamicTable';
import ModalCreateStop from '../components/ModalCreateStop';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from '../context/LoadingContext';
import { AdminContext } from '../context/AdminContext'

const Stops = () => {

    const url = import.meta.env.VITE_SERVER;
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
        confirmDelete: false,
        confirmMessage: "",
        actionToConfirm: null
    });
    const token = sessionStorage.getItem('token');
    const { usuario } = useContext(AuthContext);
    const [comunas, setComunas] = useState();
    const [stops, setStops] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const { isLoading, setLoading } = useContext(LoadingContext);
    const { isAdmin } = useContext(AdminContext);
    const [nombreComuna, setNombreComuna] = useState('');
    const [nombreServicio, setNombreServicio] = useState('');
    const [rates, setRates] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    const [createStop, setCreateStop] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const loadStops = () => {
            if (!usuario) {
                navigate('/');
            }

            setLoading(true);
            try {
                axios.get(`${url}/rate`)
                    .then(({ data }) => {
                        setRates(data);
                    })
                    .catch(({ response }) => {
                        console.error(response);
                        showModal(response.data.message);
                    });
                const api = usuario.Role.name === 'admin' ? `${url}/stop/` : `${url}/stop/${usuario.Sells[0].id}`
                axios.get(api)
                    .then(({ data }) => {
                        const stps = data.data;
                        const stopsNormalized = Array.isArray(stps) ? stps : [stps]
                        setStops(stopsNormalized);
                        showModal(data.message)
                    })
                    .catch(({ response }) => {
                        console.error(response);
                        showModal(response.data.message);
                    })
                loadComunas();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }

        }
        loadStops();
    }, [createStop]);

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
        formData.buyOrder=`BO-${Date.now()}`;
        confirmModal("¿Quieres guardar tu delivery con los siguientes datos?", () => {
            axios.post(`${url}/stop`, formData, Authorization)
                .then(({ status }) => {
                    if (status === 201) showModal("Delivery guardado exitosamente");
                    resetForm();
                    setIsCreate(false);
                })
                .catch(({ response }) => {
                    console.log(response);
                    showModal(response.data.message);
                })
                .finally(() => {
                    setCreateStop(true);
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
                })
                .catch(({ response }) => {
                    console.log(response);
                    showModal(response.data.message);
                })
                .finally(() => setCreateStop(true));
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
        showModal("Se cancelo la accion");
        resetForm();
    };
    const confirmModalDelete = (message, action) => {
        setModals(prev => ({ ...prev, confirmMessage: message, confirmDelete: true, actionToConfirm: action }));
    };

    const cancelConfirmDelete = () => {
        setModals(prev => ({ ...prev, confirmDelete: false, confirmMessage: "", actionToConfirm: null }));
        showModal("Se cancelo la accion");
    };

    const handleConfirmDelete = () => {
        if (modals.actionToConfirm) modals.actionToConfirm();
        setModals(prev => ({ ...prev, confirmDelete: false, confirmMessage: "", actionToConfirm: null }));
    };

    const deleteStop = (stop) => {
        const data = {
            id: stop.id
        }
        confirmModalDelete(`Vas a eliminar tu delivery con destino a ${stop.addres}.`, () => {
            axios.put(`${url}/stop/disable`, data)
                .then(({ status }) => {
                    if (status === 200) showModal("Delivery eliminado exitosamente");
                })
                .catch(({ response }) => {
                    console.log(response);
                    showModal(response.data.message);
                })
                .finally(() => setCreateStop(true));
        });
    }

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
    const handleSelect = ({ addres, comuna, lat, lng }) => {
        const {id}= comunas.find(comun=> comun.name.trim()=== comuna.trim());
        formData.comunaId=id;
        formData.addresPickup=addres;
        formData.lat=lat;
        formData.lng=lng;
    };
    return (
        <>
            <Card className="shadow-lg p-4 mx-auto" style={{ width: '100%', marginTop: '1rem' }}>
                <Card.Body style={{ padding: '1.5rem 0.01rem' }}>
                    {!isLoading &&
                        <DinamicTable stops={stops} viewModal={viewModal} setFormData={setFormData}
                            setNombreComuna={setNombreComuna} setNombreServicio={setNombreServicio} setIsUpdate={setIsUpdate}
                            deleteStop={deleteStop} isLoading={isLoading} setLoading={setLoading} isAdmin={isAdmin}
                            comunas={comunas} showModal={showModal} usuario={usuario} setCreateStop={setCreateStop} />}
                </Card.Body>
            </Card>
            <Modal show={modals.showSuccess} onHide={() => setModals(prev => ({ ...prev, showSuccess: false }))} centered>
                <Modal.Body className="text-center">
                    <p>{modals.message}</p>
                </Modal.Body>
            </Modal>
            <ModalCreateStop show={isCreate} formData={formData} handleChange={handleChange} handleSelectRate={handleSelectRate}
                handleSubmit={handleSubmit} filteredComunas={filteredComunas} searchTerm={searchTerm} nombreServicio={nombreServicio}
                setSearchTerm={setSearchTerm} rates={rates} resetForm={resetForm} handleSelectComuna={handleSelectComuna} nombreComuna={nombreComuna}
                isUpdate={isUpdate} handleUpdate={handleUpdate} onSelect={handleSelect} showModal={showModal} />

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
            <Modal show={modals.confirmDelete} onHide={cancelConfirm} centered>
                <Modal.Body className="text-center">
                    <p>{modals.confirmMessage}</p>
                    <Button variant="danger" className="me-2" onClick={handleConfirmDelete}>Aceptar</Button>
                    <Button variant="secondary" onClick={cancelConfirmDelete}>Cancelar</Button>
                </Modal.Body>
            </Modal>
        </>

    )
}

export default Stops