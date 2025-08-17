import http from "../http-common";
import Contacto from "../types/Contacto";
import authHeader from "./auth-header";

const getAll = () => {
  return http.get<Contacto[]>("/contactos");
};

const get = (id: number) => {
  return http.get<Contacto>(`/contactos/${id}`);
};

const create = (data: Contacto) => {
  return http.post<Contacto>("/contactos", data);
};


const remove = (id: number) => {
  return http.delete(`/contactos/${id}`, { headers: authHeader() });
};

// No hay búsqueda por nombre en el controlador actual, pero si se necesita, se puede agregar en el backend
// const findByName = (nombre: string) => {
//   return http.get<Contacto[]>(`/api/contactos/buscar/${nombre}`);
// };

// const updateStockByName = (nombre: string, nuevoStock: number) => {
//   return http.put<string>(`/api/contactos/update-stock?nombre=${nombre}&nuevoStock=${nuevoStock}`, null, { headers: authHeader() });
// };

const ContactoService = {
  getAll,
  get,
  create,
  remove,
  // findByName, // Descomentarlo si se agrega en el backend
  // updateStockByName // Descomentarlo si se agrega en el backend
};

export default ContactoService;
