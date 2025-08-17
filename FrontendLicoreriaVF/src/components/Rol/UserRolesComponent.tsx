import React, { useState, useEffect, ChangeEvent } from "react";
import UserService from "../../services/usuario.services";
import IUserRole from "../../types/IUserRole";
import styles from "./UserRoles.module.css"; // Importa el CSS Module

const UserRolesComponent: React.FC = () => {
  const [roleOptions, setRoleOptions] = useState<IUserRole[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<IUserRole[]>([]);
  const [usersMap, setUsersMap] = useState<Map<number, string>>(new Map());
  const [message, setMessage] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const roleNames: { [key: number]: string } = {
    1: "Admin",
    2: "User",
  };

  useEffect(() => {
    retrieveUsersWithRoles();
    retrieveRoles();
  }, []);

  const retrieveUsersWithRoles = () => {
    UserService.getAllUserRoles()
      .then((response) => {
        const userRoles = response.data;
        setUsersWithRoles(userRoles);

        UserService.getAll()
          .then((userResponse) => {
            const users = userResponse.data;
            const userMap = new Map<number, string>(users.map(user => [user.id, user.username]));
            setUsersMap(userMap);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const retrieveRoles = () => {
    UserService.getAllUserRoles()
      .then((response) => {
        setRoleOptions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>, userId: number) => {
    const selectedRoleId = parseInt(event.target.value, 10);
    setSelectedRole(selectedRoleId);
    updateUserRole(userId, selectedRoleId);
  };

  const updateUserRole = (userId: number, roleId: number) => {
    const userRole: IUserRole = {
      userId: userId,
      roleId: roleId
    };

    UserService.updateUserRole(userId, userRole)
      .then(() => {
        setMessage("¡Rol del usuario actualizado exitosamente!");
        retrieveUsersWithRoles();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getUserName = (userId: number) => {
    return usersMap.get(userId) || "Usuario desconocido";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gestión de Roles de Usuario</h1>

      {message && <div className={styles.alert}>{message}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID de Usuario</th>
              <th>Nombre</th>
              <th>Rol Actual</th>
              <th>Actualizar Rol</th>
            </tr>
          </thead>
          <tbody>
            {usersWithRoles.map((userRole) => (
              <tr key={userRole.userId}>
                <td>{userRole.userId}</td>
                <td>{getUserName(userRole.userId)}</td>
                <td>{roleNames[userRole.roleId] || "Desconocido"}</td>
                <td>
                  <select
                    value={userRole.roleId}
                    onChange={(e) => handleRoleChange(e, userRole.userId)}
                    className={styles.select}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value={1}>Admin</option>
                    <option value={2}>User</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRolesComponent;
