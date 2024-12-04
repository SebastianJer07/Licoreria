
import http from "../http-common";
import Pedido from "../types/Pedido";

const create = (data: Pedido) => {
    return http.post<Pedido>("/pedidos", data);
};

const getAll = () => {
    return http.get<Array<Pedido>>("/pedidos");
};

const getUltimoPedido = async (): Promise<{ data: Pedido }> => {
    return http.get<Pedido>("/pedidos/ultimo");
  };

const getPedidosByCoduser = async (coduser: number) => {
    try {
      const response = await http.get(`/pedidos/user/${coduser}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pedidos by coduser', error);
      throw error;
    }
};

// Método para actualizar un pedido existente
const update = async (id: number, data: Pedido) => {
  try {
      const response = await http.put<Pedido>(`/pedidos/${id}`, data);
      return response.data;
  } catch (error) {
      console.error('Error updating pedido', error);
      throw error;
  }
};



export default {
    create,
    getAll,
    getUltimoPedido,
    getPedidosByCoduser,
    update
   
};

