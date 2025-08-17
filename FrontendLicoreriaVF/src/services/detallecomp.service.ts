import { AxiosResponse } from 'axios';
import http from '../http-common';
import DetalleComp from '../types/DetalleComp'; // Verifica que esta ruta sea correcta
import authHeader from "./auth-header";


// Guardar un detalle de comprobante
const guardarDetalleComprobante = (detalleComprobante: DetalleComp) => {
    return http.post(`/detallecomprobantes/guardar`, detalleComprobante);
};

// Generar y descargar un PDF
const generarYDescargarPDF = async (codcomp: number): Promise<AxiosResponse> => {
    return http.get(`/detallecomprobantes/generar-pdf/${codcomp}`, {
        responseType: 'arraybuffer' // Asegúrate de que el tipo de respuesta sea adecuado para manejar archivos binarios
    });
};

const getUltimoDetalle = async (): Promise<{ data: DetalleComp }> => {
    return http.get<DetalleComp>("/detallecomprobantes/ultimo");
  };

const obtenerTodosLosDetalles = async (): Promise<AxiosResponse<DetalleComp[]>> => {
    return http.get<DetalleComp[]>('/detallecomprobantes', { headers: authHeader() });
};

const getDetallesPorUsuario = async (coduser: number): Promise<AxiosResponse<DetalleComp[]>> => {
    return http.get<DetalleComp[]>(`/detallecomprobantes/${coduser}`,{ headers: authHeader() });
};

const DetalleCompService = {
    guardarDetalleComprobante,
    generarYDescargarPDF,
    getUltimoDetalle,
    obtenerTodosLosDetalles,
    getDetallesPorUsuario
};
  
export default DetalleCompService;
