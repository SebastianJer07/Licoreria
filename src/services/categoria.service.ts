import http from "../http-common";
import authHeader from "./auth-header";
import ICategorias from "../types/categorias";

const getAll = () => {
  return http.get<Array<ICategorias>>("/categorias");
};

const get = (id: number) => {
  return http.get<ICategorias>(`/categorias/${id}`);
};

const create = (data: ICategorias) => {
  return http.post<ICategorias>("/categorias/crear", data, { headers: authHeader() });
};

const update = (codcat: number, data: ICategorias) => {
  return http.put<ICategorias>("/categorias", data, { headers: authHeader() });
};

const remove = (id: number) => {
  return http.delete(`/categorias/${id}`, { headers: authHeader() });
};

const CategoriaService = {
  getAll,
  get,
  create,
  update,
  remove
};

export default CategoriaService;
