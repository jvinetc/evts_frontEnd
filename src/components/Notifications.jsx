import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { ENDPOINT } from "../util/values";
import '../styles/Notifications.css';

const Notifications = ({ onClose }) => {
  const { token } = useContext(TokenContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get(`${ENDPOINT}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res)
        setNotifications(res.data);
      });
  }, [token]);

  const markAllAsRead = () => {
    axios
      .put(
        `${ENDPOINT}/notifications/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      });
  };

  return (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <strong>Notificaciones</strong>
        <button className="notifications-button" onClick={markAllAsRead}>Leer todo</button>
        
      </div>
      <ul className="notifications-list">
        {notifications.map((n, i) => (
          <li key={i} style={{ fontWeight: n.seen ? "normal" : "bold" }}>
            {n.message}
          </li>
        ))}
      </ul>
      <div className="notifications-actions">
        <button className="notifications-button" onClick={onClose}>Cerrar notificaciones</button>
      </div>
    </div>
  );
};

export default Notifications;
