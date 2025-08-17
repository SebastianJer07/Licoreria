import axios from 'axios';
import authHeader from './auth-header';
import Cotizacion from '../types/Cotizacion';

const apiUrl = 'http://localhost:8080/api/cotizaciones';

const listarCotizaciones = async () => {
  return await axios.get(apiUrl, { headers: authHeader() });
};

const agregarCotizacion = async (formData: FormData) => {
  return await axios.post(apiUrl, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const descargarPDF = async (id: number) => {
  const url = `${apiUrl}/${id}/archivopdf`;
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
      responseType: 'blob', // Asegura que la respuesta es un blob para descargar archivos
    });
    return response.data;
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    throw error;
  }
};

const actualizarCotizacion = async (id: number, cotizacion: FormData) => {
  const url = `${apiUrl}/${id}`;
  try {
    const response = await axios.put(url, cotizacion, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    throw error;
  }
};

const eliminarCotizacionPorId = async (id: number) => {
  const url = `${apiUrl}/${id}`;
  try {
    await axios.delete(url, {
      headers: authHeader(),
    });
  } catch (error) {
    console.error('Error al eliminar cotización por ID:', error);
    throw error;
  }
};

export default {
  listarCotizaciones,
  agregarCotizacion,
  descargarPDF,
  actualizarCotizacion,
  eliminarCotizacionPorId,
};
