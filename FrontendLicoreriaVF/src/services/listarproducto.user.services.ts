
import http from "../http-common";
import ProductosV from "../types/productosV";

const obtenerLicores = (categoriaId?: number) => {
  const url = categoriaId ? `/productosv/categoria/${categoriaId}` : '/productosv';
  return http.get<ProductosV[]>(url);
};

const ListarProductoService = {
  obtenerLicores,
};

export default ListarProductoService;
