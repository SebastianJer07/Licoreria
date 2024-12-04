// ComprobanteService.ts

import http from '../http-common';
import Comprobante from '../types/comprobante'; // Asegúrate de tener este modelo definido

const getAll = () => {
  return http.get('/comprobantes/todos');
};

const create = (data: Comprobante) => {
  return http.post('/comprobantes/guardar', data);
};

const get = (id: number) => {
  return http.get(`/comprobantes/${id}`);
};

const getUltimoComp = async (): Promise<{ data: Comprobante }> => {
  return http.get<Comprobante>("/comprobantes/ultimo");
};

const ComprobanteService = {
  getAll,
  create,
  get,
  getUltimoComp
};

export default ComprobanteService;
