// PedidoService.ts

import http from '../http-common'; // Importa el cliente HTTP configurado desde http-common.ts
import PedidoPro from '../types/Pedidopro';
import { AxiosResponse } from "axios";


const crearPedidoPro = (data: PedidoPro): Promise<AxiosResponse<PedidoPro>> => {
  return http.post<PedidoPro>("/pedidoproducto", data);
};


const listarPedidos = (): Promise<PedidoPro[]> => {
  return http.get('/pedidoproducto')
    .then(response => response.data)
    .catch(error => {
      console.error('Error al obtener la lista de pedidos:', error);
      throw error;
    });
};

const actualizarPedido = (id: number, pedido: PedidoPro): Promise<PedidoPro> => {
  const url = `'/pedidoproducto'/${id}`;
  return http.put(url, pedido)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error al actualizar el pedido con id ${id}:`, error);
      throw error;
    });
};

const PedidoProService = {
  crearPedidoPro,
  listarPedidos,
  actualizarPedido,
};

export default PedidoProService