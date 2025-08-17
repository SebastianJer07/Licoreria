import React, { ReactNode } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
//import "./UserLayout.css"; // Asegúrate de que el nombre del archivo CSS coincida con el import

import NavbarUser from '../../ComponentUser/navbaruser/navbarUser';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <>
      <NavbarUser />
      <div className="container-fluid mt-4"> {/* Agregamos un margen top de 4 para separar el Navbar */}
        <div className="row">
          <div className="col-md-1">
            {/* Aquí puedes agregar cualquier componente adicional que desees mostrar en la columna izquierda */}
          </div>
          <div className="col-md-10 mt-3">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
