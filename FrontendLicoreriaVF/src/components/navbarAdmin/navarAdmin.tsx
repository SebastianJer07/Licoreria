import { Link, NavLink } from "react-router-dom";
import "./navarAdmin.css";

import { useState, useEffect } from "react";
import EventBus from "../../common/EventBus";
import * as AuthService from "../../services/auth.service";

import IUser from "../../types/user.type";

const NavbarAdmin = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Licoreria</h2>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink to="/categoria" className="nav-link">
            <i className="fas fa-list-alt"></i> Categoría
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/producto" className="nav-link">
            <i className="fas fa-box"></i> Producto
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cotizacion" className="nav-link">
            <i className="fas fa-file-invoice-dollar"></i> Cotización
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/orden" className="nav-link">
            <i className="fas fa-receipt"></i> Orden de Compra
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/factura" className="nav-link">
            <i className="fas fa-file-invoice"></i> Factura
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/usuario" className="nav-link">
            <i className="fas fa-users"></i> Usuarios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/detallcomp" className="nav-link">
            <i className="fas fa-chart-line"></i> Ventas
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/guiasal" className="nav-link">
            <i className="fas fa-file-alt"></i> Guía Salida
          </NavLink>
        </li>


        <li className="nav-item">
          <NavLink to="/contactolist" className="nav-link">
            <i className="fas fa-reply"></i> Contacto
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/proveedor" className="nav-link">
            <i className="fas fa-truck"></i> Proveedor
          </NavLink>
        </li>
      </ul>

      {currentUser ? (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              <i className="fas fa-user"></i> {currentUser.username}
            </Link>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-link" onClick={logOut}>
              <i className="fas fa-sign-out-alt"></i> LogOut
            </a>
          </li>
        </ul>
      ) : (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              <i className="fas fa-user-plus"></i> Sign Up
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default NavbarAdmin;
