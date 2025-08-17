import http from "../http-common";
import authHeader from "./auth-header";
import Proveedor from '../types/proveedores';

const getAllProveedores = () => {
  return http.get<Proveedor[]>("/proveedores", { headers: authHeader() });
};

const crearProveedor = (proveedor: Proveedor) => {
  return http.post<Proveedor>(`/proveedores/crear`, proveedor, { headers: authHeader() });
};

const actualizarProveedor = (id: number, proveedor: Proveedor) => {
  return http.put<any>(`/proveedores/${id}`, proveedor, { headers: authHeader() });
};

const deleteProveedor = (id: number) => {
  return http.delete(`/proveedores/${id}`, { headers: authHeader() });
};

const getProveedorById = (id: number) => {
  return http.get<Proveedor>(`/proveedores/${id}`, { headers: authHeader() });
};

const buscarProveedoresPorNomprove = (nomprove: string) => {
  return http.get<Proveedor[]>(`/proveedores/buscar?nomprove=${nomprove}`, { headers: authHeader() });
};

const ProveedorService = {
  getAllProveedores,
  crearProveedor,
  actualizarProveedor,
  deleteProveedor,
  getProveedorById,
  buscarProveedoresPorNomprove
};

export default ProveedorService;
