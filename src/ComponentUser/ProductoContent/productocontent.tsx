import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductoVService from '../../services/productov.services';
import CarritoService from '../../services/carritoservice';
import ProductosV from '../../types/productosV';
import Carrito from '../../types/Carrito';
import IUser from '../../types/user.type';
import Categorias from '../../types/categorias';
import styles from './productocontent.module.css'; // Importa los estilos como módulos
import { getCurrentUser } from '../../services/auth.service';
import CategoriaService from '../../services/categoria.service'; 

interface RouteParams {
  id: string;
  [key: string]: string | undefined; // Firma de índice para cualquier otra clave de tipo string opcional
}

const ProductoContent: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [producto, setProducto] = useState<ProductosV | null>(null);
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [categorias, setCategorias] = useState<Categorias[]>([]);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await ProductoVService.get(Number(id));
        if (response && response.data) {
          setProducto(response.data);
        } else {
          console.error('Respuesta vacía o sin datos válidos:', response);
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await CategoriaService.getAll(); // Método para obtener todas las categorías
        if (response && response.data) {
          setCategorias(response.data);
        } else {
          console.error('Respuesta vacía o sin datos válidos de categorías:', response);
        }
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchProducto();
    fetchCategorias();
    setUser(getCurrentUser());

    return () => {
      // Limpieza si es necesaria
    };
  }, [id]);

  const getNombreCategoria = (codcat: number | undefined) => {
    const categoria = categorias.find(cat => cat.codcat === codcat);
    return categoria ? categoria.nomcat : 'Categoría desconocida';
  };

  const calcularPrecioDescuento = (precio: number, descuento: number): number => {
    if (descuento === 0) {
      return precio;
    }
    return precio * (1 - (descuento / 100));
  };

  const agregarAlCarrito = (licor: ProductosV) => {
    const productoExistenteIndex = carrito.findIndex(item => item.codprov === licor.codprov);

    if (productoExistenteIndex !== -1) {
      const carritoActualizado = carrito.map(item =>
        item.codprov === licor.codprov ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setCarrito(carritoActualizado);

      if (user?.id) {
        const productoExistente = carritoActualizado[productoExistenteIndex];
        actualizarCantidad(productoExistente, productoExistente.cantidad);
      }
    } else {
      if (!user) return;

      const carritoNuevo: Carrito = {
        codcar: 0,
        codprov: licor.codprov,
        cantidad: 1,
        preciounitario: licor.precioventa,
        nombre: licor.nombre,
        imagen: licor.imagen.toString(),
        fecha: new Date().toISOString().slice(0, 10),
        coduser: user.id,
      };

      if (user.id) {
        CarritoService.guardarCarrito(carritoNuevo)
          .then(carritoGuardado => {
            console.log('Carrito guardado:', carritoGuardado);
            setCarrito([...carrito, carritoGuardado]);
          })
          .catch(error => console.error('Error al guardar el carrito:', error));
      } else {
        setCarrito([...carrito, carritoNuevo]);
      }
    }
  };

  const actualizarCantidad = async (productoExistente: Carrito, nuevaCantidad: number) => {
    try {
      const updatedCarrito = await CarritoService.actualizarCarrito(productoExistente.codcar, {
        ...productoExistente,
        cantidad: nuevaCantidad,
      });

      setCarrito(prevCarrito =>
        prevCarrito.map(item =>
          item.codcar === productoExistente.codcar ? { ...item, cantidad: updatedCarrito.cantidad } : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
    }
  };

  if (!producto) {
    return <div className={styles.loading}>Cargando...</div>; // Clase de estilo de módulo
  }

  const precioConDescuento = calcularPrecioDescuento(producto.precioventa, producto.promocion || 0); // Calcula el precio con descuento

  return (
    <div className={styles['producto-content']}>
      <div className={styles['producto-header']}>
        <h1 className={styles['producto-titulo']}>{producto.nombre}</h1>
      </div>
      <div className={styles['producto-main']}>
        <div className={styles['producto-imagen-container']}>
          <img src={producto.imagen} alt={producto.nombre} className={styles['producto-imagen']} />
        </div>
        <div className={styles['producto-info']}>
          <h3 className={styles['producto-categoria']}>Categoría: {getNombreCategoria(producto.codcat)}</h3>
          <p className={styles['producto-descripcion']}>Descripción: {producto.prodes}</p>
          {producto.promocion ? (
            <div className={styles['precio-container']}>
              <p className={styles['precio-original']}>S/{producto.precioventa.toFixed(2)}</p>
              <p className={styles['precio-descuento']}>S/{precioConDescuento.toFixed(2)}</p>
            </div>
          ) : (
            <p className={styles['producto-precio']}>S/{producto.precioventa.toFixed(2)}</p>
          )}
          <p className={styles['producto-stock']}>Stock disponible: {producto.stockdisp}</p>
          <button className={styles['producto-comprar-btn']} onClick={() => agregarAlCarrito(producto)}>Comprar Ahora</button>
        </div>
      </div>
    </div>
  );
};

export default ProductoContent;
