
import http from "../http-common";
import IUser from "../types/user.type";
import IUserRole from "../types/IUserRole";
import authHeader from "./auth-header";

// Obtiene todos los usuarios
const getAll = () => {
  return http.get<IUser[]>("/user", { headers: authHeader() });
};

// Obtiene un usuario por ID
const get = (id: number) => {
  return http.get<IUser>(`/user/${id}`, { headers: authHeader() });
};

// Actualiza un usuario por ID
const update = (id: number, user: IUser) => {
  return http.put(`/user/${id}`, user);
};

const updateUserRole = (userId: number, userRole: IUserRole) => 
  { return http.put(`/user/user-roles/${userId}`, userRole, { headers: authHeader() }); };

// Obtiene todos los roles de usuario
const getAllUserRoles = () => {
  return http.get<IUserRole[]>("/user/user-roles", { headers: authHeader() });
};

const changePassword = (id: number, oldPassword: string, newPassword: string) => {
  return http.put(`/user/${id}/change-password`, { oldPassword, newPassword });
};

// Exporta los métodos del servicio
const UserService = {
  getAll,
  get,
  update,
  updateUserRole,
  getAllUserRoles,
  changePassword
};

export default UserService;
