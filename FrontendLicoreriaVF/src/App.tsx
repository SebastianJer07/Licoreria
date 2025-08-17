import React, { useState, useEffect } from "react";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import * as AuthService from "./services/auth.service";
import IUser from './types/user.type';

import RouteAdmin from "./Routers/RouteAdmin/routeAdmin";
import RouteUser from "./Routers/RouteUser/routeUser";

import EventBus from "./common/EventBus";

const App: React.FC = () => {
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false); // Inicializado como false
  const [currentUser, setCurrentUser] = useState<IUser | boolean>(true); // Inicializado como null

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user.roles.includes("ROLE_USER")); 
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN")); // Establece showAdminBoard según el rol del usuario
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut= () => {
    AuthService.logout();
    setCurrentUser(true); // Limpia currentUser al cerrar sesión
    setShowAdminBoard(false); // Oculta el panel de administrador al cerrar sesión
  };

  return (
    <>
      {currentUser && (
        <>
          <RouteUser/>
        </>
      )}
      <div className="d-flex">
        {showAdminBoard && (
          <>
            <RouteAdmin />
          </>
        )}
      </div>
      
    </>
  );
};

export default App;
