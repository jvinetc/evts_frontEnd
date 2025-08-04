import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Button, Dropdown, Form, SplitButton, Modal } from "react-bootstrap";
import { ENDPOINT, MOBILPOINT } from "../util/values";
import { isMobile } from 'react-device-detect';
import '../styles/Profile.css';
import ProfileOptions from "../components/ProfileOptions";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const { usuario, setUsuario } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [comunas, setComunas] = useState();
  const [sell, setSell] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const url = isMobile ? MOBILPOINT : ENDPOINT;

  const [modals, setModals] = useState({
    showSuccess: false,
    message: "",
    confirmDelete: false,
    confirmUnfav: false,
    confirmMessage: "",
    actionToConfirm: null
  });
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const getData = async () => {

      if (!usuario)
        return navigate('/');
      try {
        await axios.get(`${url}/sell/${usuario.id}`)
          .then(({ data }) => {
            setSell(data);
          })
          .catch(({ response }) => {
            if (usuario.Role.name !== 'admin') {
              showModal(response.data.message);
            }
          });
        const { data } = await axios.get(`${url}/comuna`);
        setComunas(data);
        setIsLoad(true);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [isLoad]);


  const showModal = (message) => {
    setModals(prev => ({ ...prev, message, showSuccess: true }));
    setTimeout(() => setModals(prev => ({ ...prev, showSuccess: false, message: "" })), 2000);
  };

  const handleConfirm = () => {
    if (modals.actionToConfirm) modals.actionToConfirm();
    setModals(prev => ({ ...prev, confirmDelete: false, confirmMessage: "", actionToConfirm: null }));
  };

  const cancelConfirm = () => {
    setModals(prev => ({ ...prev, confirmDelete: false, confirmMessage: "", actionToConfirm: null }));
    showModal("Eliminación cancelada");
  };

  let filteredComunas = [];
  if (comunas) {
    filteredComunas = comunas.filter((comuna) =>
      comuna.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return (
    <div className="profile-background">
      {usuario && token && isLoad ? (
        <ProfileOptions usuario={usuario} sell={sell}
          filteredComunas={filteredComunas} setUsuario={setUsuario}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm} showModal={showModal} setIsload={setIsLoad} />
      ) : (
        <h1 className="profile-title-unauthorized">Estas en una seccion no autorizada</h1>
      )}

      <Modal show={modals.showSuccess} onHide={() => setModals(prev => ({ ...prev, showSuccess: false }))} centered>
        <Modal.Body className="text-center">
          <p>{modals.message}</p>
        </Modal.Body>
      </Modal>

      <Modal show={modals.confirmDelete} onHide={cancelConfirm} centered>
        <Modal.Body className="text-center">
          <p>{modals.confirmMessage}</p>
          <Button variant="danger" className="me-2" onClick={handleConfirm}>Aceptar</Button>
          <Button variant="secondary" onClick={cancelConfirm}>Cancelar</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
