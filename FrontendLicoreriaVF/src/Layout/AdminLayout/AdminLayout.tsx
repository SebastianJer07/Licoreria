import React, { ReactNode } from 'react';
import NavbarAdmin from '../../components/navbarAdmin/navarAdmin';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Adminlayout.css"

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <>
      <NavbarAdmin />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1">
            {/* Espacio reservado para el NavbarAdmin */}
          </div>
          <div className="col-md-10 mt-3">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
