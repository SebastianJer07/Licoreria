import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './PaymentProcessNavigation.module.css';

const PaymentProcessNavigation: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink
            to="/cart-review"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            1. Revisión del Carrito
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/shipping-info"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            2. Información de Envío
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/payment"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            3. Pago
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/order-confirmation"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            4. Confirmación de Pedido
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default PaymentProcessNavigation;
