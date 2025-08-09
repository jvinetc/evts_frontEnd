import React, { useContext, useEffect, useState } from 'react'
import { LoadingContext } from '../context/LoadingContext';

const Payment = ({ stops }) => {

    const [total, setTotal] = useState();
    const {setLoading} = useContext(LoadingContext);

    useEffect(() => {
        const calcTotal = async () => {
            setLoading(true);
            try {                
                let subTotal=0;
                stops.map(stop=>{
                    subTotal += Number(stop.Rate.price);
                })
                setTotal(subTotal);
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        calcTotal();
    }, []);


    const onPagar = async () => {
        console.log(total);
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