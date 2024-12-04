import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListarProductoService from "../../services/listarproducto.user.services";
import ProductosV from '../../types/productosV';
import CarritoService from '../../services/carritoservice';
import Carrito from '../../types/Carrito';
import IUser from '../../types/user.type';
import BuscadorComponent from '../Buscador/buscadorcomponent';
import styles from './ListadoLicoresComponent.module.css';

interface ListadoLicoresComponentProps {
  categoriaId: number;
  setCarrito: React.Dispatch<React.SetStateAction<Carrito[]>>;
  carrito: Carrito[];
  userId: number;
  usuario: IUser;
  productosBusqueda: ProductosV[];
}

const ListadoLicoresComponent: React.FC<ListadoLicoresComponentProps> = ({
  categoriaId,
  setCarrito,
  carrito,
  userId,
  productosBusqueda
}) => {
  const [productos, setProductos] = useState<ProductosV[]>(productosBusqueda);
  const navigate = useNavigate();

  useEffect(() => {
    if (productosBusqueda.length > 0) {
      setProductos(productosBusqueda);
    } else {
      const obtenerLicores = () => {
        ListarProductoService.obtenerLicores(categoriaId)
          .then(response => setProductos(response.data))
          .catch(error => console.error('Error al obtener licores:', error));
      };
      obtenerLicores();
    }
  }, [categoriaId, productosBusqueda]);

  const calcularPrecioDescuento = (precio: number, descuento: number): number => {
    if (descuento === 0) {
      return precio;
    }
    return precio * (1 - (descuento / 100));
  };

  const agregarAlCarrito = (licor: ProductosV, event: React.MouseEvent) => {
    event.stopPropagation();

    const productoExistenteIndex = carrito.findIndex(item => item.codprov === licor.codprov);

    if (productoExistenteIndex !== -1) {
      const carritoActualizado = [...carrito];
      carritoActualizado[productoExistenteIndex].cantidad += 1;
      setCarrito(carritoActualizado);

      if (userId) {
        const productoExistente = carritoActualizado[productoExistenteIndex];
        actualizarCantidad(productoExistente, productoExistente.cantidad);
      }
    } else {
      const carritoNuevo: Carrito = {
        codcar: 0,
        codprov: licor.codprov,
        cantidad: 1,
        preciounitario: licor.precioventa,
        nombre: licor.nombre,
        imagen: licor.imagen.toString(),
        fecha: new Date().toISOString().slice(0, 10),
        coduser: userId,
      };

      if (userId) {
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

  const handleItemClick = (id: number) => {
    navigate(`/productos/${id}`);
  };

  const handleBusqueda = (productos: ProductosV[]) => {
    setProductos(productos);
  };

  return (
    <div className={styles.productosContainer}>
      <div className={styles.buscadorContainer}>
        <BuscadorComponent onBusqueda={handleBusqueda} />
      </div>
      <h1>Listado de Licores</h1>
      <div className={styles.productosList}>
        {productos.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          productos
            .filter((licor) => licor.estado) // Filtra productos con estado true
            .map((licor) => {
              const precioConDescuento = calcularPrecioDescuento(licor.precioventa, licor.promocion || 0); // Calcula el precio con descuento

              return (
                <div key={licor.codprov} className={styles.productoItem} onClick={() => handleItemClick(licor.codprov)}>
                  <img src={licor.imagen.toString()} alt={licor.nombre} className={styles.productoImagen} />
                  <div className={styles.productoInfo}>
                    <h3 className={styles.productoNombre}>{licor.nombre}</h3>
                    {licor.promocion ? (
                      <div className={styles.precioContainer}>
                        <p className={styles.precioOriginal}>S/{licor.precioventa.toFixed(2)}</p>
                        <p className={styles.precioDescuento}>S/{precioConDescuento.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className={styles.productoPrecio}>S/{licor.precioventa.toFixed(2)}</p>
                    )}
                    <button onClick={(event) => agregarAlCarrito(licor, event)} className={styles.btnAgregar}>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default ListadoLicoresComponent;
