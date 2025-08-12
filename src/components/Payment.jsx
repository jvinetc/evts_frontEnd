import React, { useContext } from 'react'
import { LoadingContext } from '../context/LoadingContext';
import axios from 'axios';

const Payment = ({ stops, sellId, showModal, total }) => {


    const { setLoading } = useContext(LoadingContext);
    const urlApi = import.meta.env.VITE_SERVER;
    const { token } = sessionStorage.getItem('token');


    const onPagar = async () => {
        if (stops === null) {
            showModal('Debe Seleccionar al menos 1 elemento para pagar');
            return;
        };
        const sessionId = `SID-${Date.now()}-${sellId}-${token}`;
        const body = { selectedStops: stops, amount: total, sessionId }
        try {
            setLoading(true);
            const { data } = await axios.post(`${urlApi}/stop/pay`, body);
            const { token, url } = data;
            window.location.href = `${url}?token_ws=${token}`;
            console.log(data);
        } catch (error) {
            console.error(error)
        }finally {
            setLoading(false);
        }
    }
    return (
        <div className="container my-3">
            <div className="row align-items-center bg-light p-3 rounded shadow-sm">
                <div className="col-12 col-md-8 mb-3 mb-md-0">
                    <label className="form-label h5">
                        Total a pagar: <span className="text-success">${total}.-</span>
                    </label>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button
                        className="btn btn-success w-100 w-md-auto"
                        onClick={onPagar}
                    >
                        Pagar ahora
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment