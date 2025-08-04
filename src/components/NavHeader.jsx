import React, { useContext } from 'react'
import { Navbar } from 'react-bootstrap';
import { HouseFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/TokenContext';
import { useMediaQuery } from 'react-responsive';

const NavHeader = () => {
    const navigate = useNavigate();
    const { token } = useContext(TokenContext);
    let mobil = '';
    if (useMediaQuery({ maxWidth: 500 }))
        mobil = '480px';
    return (
        <Navbar bg="primary" variant="dark" fixed='top' className="justify-content-center"
            style={{ maxWidth: {mobil}, margin: '0 auto', }}>
            <Navbar.Brand>
                {token ? "" :
                    <HouseFill size={24} onClick={() => navigate('/')}
                        className="position-absolute start-0 ms-3" style={{ cursor: 'pointer' }} />
                }

                <span className="fw-bold">Envios todo Santiago</span>
            </Navbar.Brand>
        </Navbar>
    )
}

export default NavHeader;