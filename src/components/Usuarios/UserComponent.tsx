import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import UserService from "../../services/usuario.services";
import IUser from "../../types/user.type";
import "./user.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const UserComponent: React.FC = () => {
  const initialUserState: IUser = { id: null, username: "", email: "", password: "", roles: [] };
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [currentUser, setCurrentUser] = useState<IUser>(initialUserState);
  const [message, setMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    retrieveUsers();
  }, []);

  const retrieveUsers = () => {
    UserService.getAll()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const abrirModalEditar = (user: IUser) => {
    setCurrentUser(user);
    setModalTitle("Editar Usuario");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPasswordVisible(false); // Reset password visibility when closing modal
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const updateUser = (event: FormEvent) => {
    event.preventDefault();

    UserService.update(currentUser.id as number, currentUser)
      .then(() => {
        setMessage("¡El usuario fue actualizado exitosamente!");
        cerrarModal();
        retrieveUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="users-container">
      <h1>Gestión de Usuarios</h1>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>&times;</span>
            <h2>{modalTitle}</h2>
            <form onSubmit={updateUser} className="form-user">
              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={currentUser.username}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={currentUser.password}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Usuario</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning" onClick={() => abrirModalEditar(user)}>
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && <div className="alert alert-success mt-4">{message}</div>}
    </div>
  );
};

export default UserComponent;
