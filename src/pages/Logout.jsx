import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { TokenContext } from '../context/TokenContext';
import { AdminContext } from '../context/AdminContext';

const Logout = () => {
    const navigate = useNavigate();
    const {setUsuario} = useContext(AuthContext);   
    const {setToken}= useContext(TokenContext); 
    const {setAdmin} = useContext(AdminContext)
    useEffect(()=>{
        const logout=()=>{
            sessionStorage.removeItem('token');
            setUsuario('');
            setToken('')
            setAdmin(false)
            navigate('/');
        }
        logout();
    },[])
  return (
    <></>
  )
}
export default Logout