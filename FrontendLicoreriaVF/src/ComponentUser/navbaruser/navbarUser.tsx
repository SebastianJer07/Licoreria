import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Importar Font Awesome
import * as AuthService from "../../services/auth.service";
import EventBus from "../../common/EventBus";
import IUser from '../../types/user.type';
import './navbaruser.css';

const NavbarUser = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const navigate = useNavigate(); // Hook para redirección


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
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-orange navbar-user-custom">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-store"></i> Liquor Store
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="fas fa-home"></i> Inicio
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/nosotros" className="nav-link">
                <i className="fas fa-users"></i> Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacto" className="nav-link">
                <i className="fas fa-envelope"></i> Contáctanos
              </Link>
            </li>
            <div className="navbar-right d-flex align-items-center ms-auto">
              <Link to="/carrito" className="nav-link ms-3">
                <i className="fas fa-shopping-cart"></i>
              </Link>
              <div className="navbar-user d-flex align-items-center ms-3">
                {currentUser ? (
                  <>
                    <div className="navbar-cart me-2">
                      <Link to="/perfil" className="nav-link">
                        <i className="fas fa-user"></i>
                      </Link>
                    </div>
                    <div className="navbar-cart">
                      <Link to="/login" className="nav-link" onClick={logOut}>
                        <i className="fas fa-sign-out-alt"></i>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="navbar-cart me-2">
                      <Link to="/login" className="nav-link">
                        <i className="fas fa-sign-in-alt"></i>
                      </Link>
                    </div>
                    <div className="navbar-cart">
                      <Link to="/register" className="nav-link">
                        <i className="fas fa-user-plus"></i>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ul>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;
