import http from "../http-common";
import ProductosV from "../types/productosV";
import authHeader from "./auth-header";

const getAll = () => {
  return http.get<ProductosV []>("/productosv");
};


const get = (id: number) => {
  return http.get<ProductosV >(`/productosv/${id}`);
};

const create = (data: ProductosV ) => {
  return http.post<ProductosV >("/productosv/crear", data, { headers: authHeader() });
};

const update = (id: number, data: ProductosV) => {
  return http.put<any>(`/productosv/${id}`, data, { headers: authHeader() });
};

const remove = (id: number) => {
  return http.delete(`/productosv/${id}`, { headers: authHeader() });
};

const findByName = (nombre: string) => {
  return http.get<ProductosV[]>(`/productosv/buscar/${nombre}`);
};

const updateStockByName = (nombre: string, nuevoStock: number) => {
  return http.put<string>(`/productosv/update-stock?nombre=${nombre}&nuevoStock=${nuevoStock}`, null, { headers: authHeader() });
};

// Método para listar productos vencidos
const listarProductosVencidos = () => {
  return http.get<ProductosV[]>("/productosv/vencidos");
};

// Método para listar productos con stock bajo
const obtenerProductosConStockBajo = () => {
  return http.get<ProductosV[]>("/productosv/stock");
};


// Método para generar y descargar la guía de salida en PDF
const generarGuiaDeSalida = (
  nombreResponsable: string, 
  cargoResponsable: string, 
  telefonoResponsable: string, 
  correoResponsable: string,
  numeroGuia: string, 
  fechaSalida: string,
  motivo: string,
  productoIds: number[],
) => {
  // Configuración de parámetros para la solicitud
  const params = {
    nombreResponsable,
    cargoResponsable,
    telefonoResponsable,
    correoResponsable,
    numeroGuia,
    fechaSalida,
    motivo,
    productoIds: productoIds.join(',')
  };

  // Realizar la solicitud GET con parámetros y manejar la respuesta como un blob
  return http.get("/productosv/generar", {
    headers: authHeader(),
    params: params,
    responseType: 'blob'
  }).then((response) => {
    // Crear un enlace de descarga para el archivo PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'guia_salida.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
};


const ProductoVService = {
  getAll,
  get,
  create,
  update,
  remove,
  findByName,
  updateStockByName,
  listarProductosVencidos,
  generarGuiaDeSalida,
  obtenerProductosConStockBajo
};

export default ProductoVService;
