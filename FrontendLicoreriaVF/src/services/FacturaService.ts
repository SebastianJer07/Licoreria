import axios from 'axios';
import authHeader from './auth-header';
import factura from '../types/Factura';

const apiUrl = 'http://localhost:8080/api/factura';

const listarFacturas = async () => {
  return await axios.get(apiUrl, { headers: authHeader() });
};

const agregarFactura = async (formData: FormData) => {
  return await axios.post(apiUrl, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const descargarArchivoPDF = async (id: number) => {
  const url = `${apiUrl}/${id}/archivopdf`;
  return await axios.get(url, {
    headers: authHeader(),
    responseType: 'blob',
  });
};


const actualizarFactura = async (id: number, factura: FormData) => {
  const url = `${apiUrl}/${id}`;
  try {
    const response = await axios.put(url, factura, {
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

const eliminarFacturaPorId = async (id: number) => {
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
  listarFacturas,
  agregarFactura,
  descargarArchivoPDF,
  actualizarFactura,
  eliminarFacturaPorId

};
