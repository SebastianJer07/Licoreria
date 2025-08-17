
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "../../components/login/Login";
import Register from "../../components/login/Register";
import BoardAdmin from "../../components/BoardAdmin";
import Profile from "../../components/profile/Profile";
import ProductoVComponent from "../../components/producto-crud/productoV";
import OrdenesCompra from "../../components/OrdenCompra/OrdenCompra";
import CotizacionComponent from "../../components/Cotizacion/Cotizacion";
import AdminLayout from "../../Layout/AdminLayout/AdminLayout";
import FacturaComponent from "../../components/Factura/Factura";
import ProveedoresComponent from "../../components/proveedor-crud/proveedorcomponet";
import CategoriaComponent from "../../components/categoria-crud/categoria";
import AdminPanel from "../../components/UserRol/AdminPanel";
import ListarDetallComprob from "../../components/ListarComprobante/ListarDetallComprob";
import ContactList from "../../components/ContactList/ContactList";
import GuiaDeSalida from "../../components/GuiaSalida/GuiaDeSalida";

export const routeAdmin = () => {
  
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<ProductoVComponent/>} />
                <Route path="/producto" element={<ProductoVComponent />} />
                <Route path="/register" element={<Register />} />
                <Route path="/orden" element={<OrdenesCompra />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<BoardAdmin />} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/factura" element={<FacturaComponent/>}/>
                <Route path="/cotizacion" element={<CotizacionComponent/>}/>
                <Route path="/proveedor" element={<ProveedoresComponent/>}/>
                <Route path="/categoria" element={<CategoriaComponent/>}/>
                <Route path="/detallcomp" element={<ListarDetallComprob/>}/>
                <Route path="/contactolist" element={<ContactList/>}/>
                <Route path="/guiasal" element={<GuiaDeSalida/>}/>
                <Route path="/usuario" element={<AdminPanel/>}/>


                

            </Routes>
        </AdminLayout>
    );
  };
  
  export default routeAdmin;
