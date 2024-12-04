import React, { useState } from 'react';
import ListarCategorias from '../listarcategoria/listarcategoria';
import { getCurrentUser } from '../../services/auth.service';
import Carrito from '../../types/Carrito';
import IUser from '../../types/user.type';
import ListadoLicoresComponent from '../listarproducto/listarproductocomponent';
import styles from './ProductoVenta.module.css'; // Importar el módulo CSS
import ProductosV from '../../types/productosV';

const ProductoVenta: React.FC = () => {
  const [categoriaId, setCategoriaId] = useState<number>(0);
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [productosBusqueda, setProductosBusqueda] = useState<ProductosV[]>([]); // Nuevo estado para productos de búsqueda

  // Simula obtener el usuario actual
  const currentUser = getCurrentUser();
  const userId: number = currentUser ? currentUser.id : 0;

  const usuario: IUser = {
    id: userId,
    username: '',
    email: '',
    password: ''
  };

  const handleCategoriaChange = (categoriaId: number) => {
    setCategoriaId(categoriaId);
  };

  return (
    <div className={styles.productoVentaContainer}>
      <div className={styles.sidebar}>
        <ListarCategorias onCategoriaChange={handleCategoriaChange} />
      </div>
      <div className={styles.mainContent}>
        <ListadoLicoresComponent
          categoriaId={categoriaId}
          setCarrito={setCarrito}
          carrito={carrito}
          userId={userId}
          usuario={usuario}
          productosBusqueda={productosBusqueda} // Pasar productos de búsqueda
        />
      </div>
    </div>
  );
};

export default ProductoVenta;
