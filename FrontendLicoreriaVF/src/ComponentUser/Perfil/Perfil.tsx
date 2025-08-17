import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/usuario.services';
import DetalleCompService from '../../services/detallecomp.service';
import * as AuthService from "../../services/auth.service";
import IUser from '../../types/user.type';
import DetalleComp from '../../types/DetalleComp';
import { getCurrentUser } from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './PerfilComponente.module.css';

type PasswordFields = 'oldPassword' | 'newPassword' | 'confirmPassword';

const PerfilComponente: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || 0;

  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<IUser>({
    id: 0,
    username: '',
    email: '',
    password: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [activeSection, setActiveSection] = useState<'user-details' | 'change-password' | 'purchases'>('user-details');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<DetalleComp[]>([]); // Estado para los detalles de compras


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.get(userId);
        setUser(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Error al cargar el usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (activeSection === 'purchases') {
        try {
          const response = await DetalleCompService.getDetallesPorUsuario(userId);
          setPurchases(response.data);
        } catch (err) {
          setError('Error al cargar el historial de compras.');
        }
      }
    };

    fetchPurchases();
  }, [activeSection, userId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: PasswordFields) => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const logOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await UserService.update(userId, formData);
      setNotification({ message: 'Usuario actualizado exitosamente.', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Error al actualizar el usuario.', type: 'error' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ message: 'La nueva contraseña y la confirmación no coinciden.', type: 'error' });
      return;
    }
    try {
      await UserService.changePassword(userId, passwordData.oldPassword, passwordData.newPassword);
      setNotification({ message: 'Contraseña cambiada exitosamente.', type: 'success' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setNotification(null);
        logOut();
      }, 5000);
    } catch (err) {
      setNotification({ message: 'Error al cambiar la contraseña.', type: 'error' });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <nav className={styles.navbar}>
          <ul>
            <li>
              <a
                href="#user-details"
                onClick={() => setActiveSection('user-details')}
                className={activeSection === 'user-details' ? styles.active : ''}
              >
                <FontAwesomeIcon icon={faUser} className={styles.icon} />
                Perfil de Usuario
              </a>
            </li>
            <li>
              <a
                href="#change-password"
                onClick={() => setActiveSection('change-password')}
                className={activeSection === 'change-password' ? styles.active : ''}
              >
                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                Actualizar Contraseña
              </a>
            </li>
            <li>
              <a
                href="#purchases"
                onClick={() => setActiveSection('purchases')}
                className={activeSection === 'purchases' ? styles.active : ''}
              >
                <FontAwesomeIcon icon={faShoppingCart} className={styles.icon} />
                Historial de Compras
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.content}>
        {activeSection === 'user-details' && (
          <div id="user-details">
            <h2>Detalle del Usuario</h2>
            {user && (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>ID:</label>
                  <span>{user.id}</span>
                </div>
                <div className={styles.formGroup}>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Actualizar</button>
              </form>
            )}
          </div>
        )}

        {activeSection === 'change-password' && (
          <div id="change-password">
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={handleChangePassword}>
              <div className={styles.formGroup}>
                <label>Contraseña Actual:</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword.oldPassword ? 'text' : 'password'}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => togglePasswordVisibility('oldPassword')}
                  >
                    <FontAwesomeIcon icon={showPassword.oldPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Nueva Contraseña:</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword.newPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => togglePasswordVisibility('newPassword')}
                  >
                    <FontAwesomeIcon icon={showPassword.newPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Confirmar Nueva Contraseña:</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    <FontAwesomeIcon icon={showPassword.confirmPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>
              <button type="submit">Cambiar Contraseña</button>
            </form>
          </div>
        )}

        {activeSection === 'purchases' && (
          <div id="purchases">
            <h2>Historial de Compras</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? (
                  purchases.map(purchase => (
                    <tr key={purchase.codcompd}>
                      <td>{purchase.codcompd}</td>
                      <td>{purchase.nompro}</td>
                      <td>{purchase.cantidad}</td>
                      <td>{purchase.preciouni}</td>
                      <td>{purchase.subtotal}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No hay compras registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {notification && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilComponente;
