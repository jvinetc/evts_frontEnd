import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Interaction from "./pages/Interaction";
import Login from "./pages/Login";
import Publications from "./pages/Publications";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Servicios from "./pages/Servicios";
import Profile from "./pages/Profile";
import Configuration from "./pages/Configuration";
import Logout from "./pages/Logout";
import Stops from "./pages/Stops";


function AppRouter() {
  //const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="interaction/:id" element={<Interaction />} />
          <Route path="login" element={<Login />} />
          <Route path="publications" element={<Publications />} />
          <Route path="publications/:categoria" element={<Publications />} />
          <Route path="register" element={<Register />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="configuration" element={<Configuration />} />
          <Route path="logout" element={<Logout />} />
          <Route path="stops" element={<Stops />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
