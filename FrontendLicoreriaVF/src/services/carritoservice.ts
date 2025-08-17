import http from '../http-common';
import Carrito from '../types/Carrito';
import authHeader from "./auth-header"; // Asegúrate de importar la cabecera de autenticación


const listarCarritos = async (): Promise<Carrito[]> => {
  const response = await http.get<Carrito[]>('/carritos');
  return response.data;
};

const guardarCarrito = async (carrito: Carrito): Promise<Carrito> => {
  const response = await http.post<Carrito>('/carritos', carrito);
  return response.data;
};

const actualizarCarrito = async (id: number, carrito: Carrito): Promise<Carrito> => {
  const response = await http.put<Carrito>(`/carritos/${id}`, carrito);
  return response.data;
};

const eliminarCarrito = (id: number) => {
  return http.delete(`/carritos/${id}`, { headers: authHeader() });
};

const getCarritosByCoduser = async (coduser: number) => {
  try {
    const response = await http.get(`/carritos/user/${coduser}`);
    console.log('Datos obtenidos:', response.data); // Verifica la estructura
    return response.data;
  } catch (error) {
    console.error('Error fetching carritos by coduser', error);
    throw error;
  }
};


const CarritoService = {
  listarCarritos,
  guardarCarrito,
  actualizarCarrito, // Aquí está la función correcta para actualizar un carrito
  eliminarCarrito,
  getCarritosByCoduser
};

export default CarritoService;
