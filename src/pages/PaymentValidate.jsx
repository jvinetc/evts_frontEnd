import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
const urlApi = import.meta.env.VITE_SERVER;

const PaymentValidate = () => {
    const location = useLocation();
    const [datosPago, setDatosPago] = useState(null)
    const navigate = useNavigate();
    useEffect(() => {
        const loadNotification = async () => {
            const params = new URLSearchParams(location.search);
            if (!params) {
                console.log("no existen parametros");
                return;
            }
            const authorization_code = params.get('authorization_code');
            try {
                const {data} = await axios.get(`${urlApi}/payments/${authorization_code}`);
                setDatosPago(data);
            } catch (error) {
                console.log(error);
            }
        }
        loadNotification();
    }, [location]);

    if (!datosPago) return <p>Cargando resultado del pago...</p>;
    return (
        <div style={{ padding: '4rem' }}>
            <h2>✅ Pago Exitoso</h2>
            <p><strong>Estado:</strong> {datosPago.status}</p>
            <p><strong>Monto:</strong> ${datosPago.amount}</p>
            <p><strong>Orden de compra:</strong> {datosPago.buy_order}</p>
            <p><strong>Autorización:</strong> {datosPago.authorization_code}</p>
            <p><strong>Tarjeta:</strong> **** **** **** {datosPago.card_detail?.slice(-4)}</p>
            <p><strong>Fecha:</strong> {datosPago.createAt}</p>

            <button onClick={()=>navigate('/')}>Volver al inicio</button>
        </div>
    )
}

export default PaymentValidate