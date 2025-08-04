import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavHeader from "../components/NavHeader";
import { Container } from "react-bootstrap";
import { TokenContext } from "../context/TokenContext";
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
function Layout() {
    const { token } = useContext(TokenContext);
    let mobil='';
    if(useMediaQuery({ maxWidth: 500 })) 
        mobil='480px';
    return (      
        <Container fluid className="p-0" style={{ maxWidth: {mobil}, margin: '0 auto', backgroundColor: '#eaeaea', height: '100vh' }}>
            <NavHeader />
            { token?
            <Navbar/>:"" }
            <Outlet />
        </Container>
    )
};

export default Layout;