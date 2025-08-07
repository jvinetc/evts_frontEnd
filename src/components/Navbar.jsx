import { useContext, /* useEffect, */ useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";
import { AuthContext } from '../context/AuthContext';
import Notifications from "./Notifications"; // ⬅️ asegúrate de tener este componente
//import axios from "axios";
import "../styles/Navbar.css";
import { ENDPOINT } from "../util/values";
import { BoxArrowInLeft, GearFill, HouseFill, PersonFill, Shop, SignStop } from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { AdminContext } from "../context/AdminContext";

function navbar() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { usuario } = useContext(AuthContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {isAdmin} = useContext(AdminContext);
  //const [showNotifications, setShowNotifications] = useState(false);
  // const [unreadCount, setUnreadCount] = useState(0);
  /* useEffect(() => {
    if (token) {
      axios
        .get(`${ENDPOINT}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            const unread = res.data.filter((n) => !n.seen).length;
            setUnreadCount(unread);
          } else {
            console.warn("⚠️ Las notificaciones no son un array:", res.data);
            setUnreadCount(0);
          }
        });
    }
  }, [token, showNotifications]); */
  let mobil = '';
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (useMediaQuery({ maxWidth: 500 }))
    mobil = '480px';
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState("home");
  const url = import.meta.env.VITE_SERVER;
  return (
    <Navbar bg="primary" fixed="bottom" className="justify-content-around border-top" style={{ maxWidth: { mobil }, margin: '0 auto', backgroundColor: '#f8f9fa' }}>
      <Container fluid>

        <Navbar.Toggle aria-controls="navbarResponsive" />

        <Navbar.Collapse id="navbarResponsive">

          <Nav className="w-100 d-flex justify-content-around">
            <Nav.Link as={Link} to="/" className="text-center d-flex flex-column align-items-center">
              <HouseFill size={24} className={`icon-nav ${activeTab === "home" ? "active" : ""}`}
                onClick={() => setActiveTab("home")} />
              <small className="text-muted">Inicio</small>
            </Nav.Link>
            <div className="vr mx-2" />
            <Nav.Link as={Link} to="/profile" className="text-center d-flex flex-column align-items-center">
              {usuario.Images.length === 0 ? <PersonFill size={24} className={`icon-nav ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")} /> :
                <img src={`${url}/uploads/${usuario.Images[0].name}`} className={`avatar icon-nav ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")} />}
              <small className="text-muted">Perfil</small>
            </Nav.Link>
            <div className="vr mx-2" />
            <Nav.Link as={Link} to={usuario.Sells.length === 0 || usuario.Role.name !=='admin' ?'/profile':"/stops"} className="text-center d-flex flex-column align-items-center">
              <SignStop size={24} className={`icon-nav ${activeTab === "stops" ? "active" : ""}`}
                onClick={() =>usuario.Sells.length === 0 || usuario.Role.name !=='admin' ?alert('Primero debes crear una tienda') : setActiveTab("stops")} />
              <small className="text-muted">Puntos</small>
            </Nav.Link>

            {isAdmin && <>
              <div className="vr mx-2" /> < Nav.Link as={Link} to="/sell" className="text-center d-flex flex-column align-items-center">
                <Shop size={24} className={`icon-nav ${activeTab === "sell" ? "active" : ""}`}
                  onClick={() => setActiveTab("sell")} />
                <small className="text-muted">Tiendas</small>
              </Nav.Link></>}
            <div className="vr mx-2" />
            <Nav.Link as={Link} to="/logout" className="text-center d-flex flex-column align-items-center">
              <BoxArrowInLeft size={24} className="icon-nav" />
              <small className="text-muted">Salir</small>
            </Nav.Link>
            {/* 🔔 Ícono de notificaciones */}
            {/* <div
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <span style={{ fontSize: "1.5rem" }}>🔔</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -4,
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "12px",
                    padding: "2px 6px",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div> */}
            {/* 🔽 Notificaciones (Dropdown flotante) */}
            {/* {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  zIndex: 999,
                  width: "300px",
                }}
              >
                <Notifications onClose={() => setShowNotifications(false)} />
              </div>
            )} */}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default navbar;
