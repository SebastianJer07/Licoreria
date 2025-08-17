import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";


import Home from "../../ComponentUser/Home/Home";
import BoardUser from "../../components/BoardUser";
import ProductoVenta from "../../ComponentUser/ProductoVenta/ProductoVenta";
import CarritoComponent from "../../ComponentUser/Carrito/carritocompont";
import CompraNavbar from "../../ComponentUser/CompraNavbar/CompraNavbar";
import ComprobanteComponent from "../../ComponentUser/Comprobante/Comprobante";
import CrearPedidoForm from "../../ComponentUser/Pedido/CrearPedidoForm";
import PagoComponent from '../../ComponentUser/Pago/pagocomponet';
import ProductoContent from '../../ComponentUser/ProductoContent/productocontent';
import EmpresaInfo from '../../ComponentUser/Nosotros/EmpresaInfo';
import CrearContacto from '../../ComponentUser/Contacto/CrearContacto';
import Login from '../../ComponentUser/login/Login';
import Register from '../../ComponentUser/login/Register';
import PerfilComponente from '../../ComponentUser/Perfil/Perfil';
import UserLayout from '../../Layout/UserLayout/Userlayout';

const RouteUser: React.FC = () => {


  return (
      <UserLayout>
        <Routes>
          <Route path="/" element={<ProductoVenta />} />
          <Route path="/productov" element={<ProductoVenta />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<PerfilComponente />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/carrito" element={<CarritoComponent />} />
          <Route path="/compra/*" element={<CompraFlow/>} />
          <Route path="/nosotros" element={<EmpresaInfo />} />
          <Route path="/contacto" element={<CrearContacto />} />
          <Route path="/productos/:id" element={<ProductoContent/>} /> {/* Ruta dinámica con :id */}
        </Routes>
      </UserLayout>

  );
};




const CompraFlow:React.FC = ()  => {

  return (
    <div className="compra-flow">
      <Routes>
        <Route path="/" element={<Navigate to="/compra/paso-1" replace />} />
        <Route path="/paso-1" element={<CompraNavbar pasoActual={1} />} />
        <Route path="/paso-2" element={<CompraNavbar pasoActual={2} />} />
        <Route path="/paso-3" element={<CompraNavbar pasoActual={3} />} />
      </Routes>
      <div className="content-container">
        <Routes>
        <Route path="/paso-1" element={<CrearPedidoForm/>} />
          <Route path="/paso-2" element={<ComprobanteComponent />} />
          <Route path="/paso-3" element={<PagoComponent/>} />

        </Routes>
      </div>
    </div>
  );
};

export default RouteUser;
