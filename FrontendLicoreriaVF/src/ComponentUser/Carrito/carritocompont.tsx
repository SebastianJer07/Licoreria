import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarritoService from '../../services/carritoservice';
import Carrito from '../../types/Carrito';
import { getCurrentUser } from '../../services/auth.service';
import './carrito.css';

const CarritoComponent: React.FC = () => {
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [subtotalTotal, setSubtotalTotal] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id); // Ajusta según cómo se devuelvan los datos
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      const fetchCarrito = async () => {
        try {
          const carritos = await CarritoService.getCarritosByCoduser(userId);
          
          // Asegúrate de que `carritos` es un array
          if (Array.isArray(carritos)) {
            setCarrito(carritos);
          } else {
            console.error('La respuesta de la API no es un array');
          }
        } catch (error) {
          console.error('Error al listar el carrito:', error);
        }
      };

      fetchCarrito();
    }
  }, [userId]);

  useEffect(() => {
    const calcularSubtotalTotal = () => {
      let total = 0;
      carrito.forEach((item) => {
        total += item.cantidad * item.preciounitario;
      });
      setSubtotalTotal(total);
    };

    calcularSubtotalTotal();
  }, [carrito]);

  const actualizarCantidad = async (carritoToUpdate: Carrito, nuevaCantidad: number) => {
    try {
      const updatedCarrito = await CarritoService.actualizarCarrito(carritoToUpdate.codcar, {
        ...carritoToUpdate,
        cantidad: nuevaCantidad,
      });

      setCarrito((prevCarrito) =>
        prevCarrito.map((item) => (item.codcar === carritoToUpdate.codcar ? updatedCarrito : item))
      );
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
    }
  };

  const eliminarProducto = async (carritoToDelete: Carrito) => {
    try {
      await CarritoService.eliminarCarrito(carritoToDelete.codcar);
      setCarrito((prevCarrito) => prevCarrito.filter((item) => item.codcar !== carritoToDelete.codcar));
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const calcularSubtotal = (carritoItem: Carrito): number => {
    return carritoItem.cantidad * carritoItem.preciounitario;
  };

  const handleIrACompra = () => {
    navigate('/compra');
  };

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Carrito de Compras</h2>
      <ul className="cart-list">
        {carrito.length > 0 ? (
          carrito.map((carritoItem) => (
            <li key={carritoItem.codcar} className="cart-item">
              <div className="cart-item-content">
                <div className="cart-item-details">
                  <img src={carritoItem.imagen} alt={carritoItem.nombre} />
                  <div>
                    <p className="cart-item-name">{carritoItem.nombre}</p>
                    <p className="cart-item-price">Precio Unitario: S/{carritoItem.preciounitario}</p>
                    <p className="cart-item-quantity">Cantidad: {carritoItem.cantidad}</p>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => actualizarCantidad(carritoItem, carritoItem.cantidad + 1)}>+</button>
                  <button onClick={() => actualizarCantidad(carritoItem, carritoItem.cantidad - 1)}>-</button>
                  <button onClick={() => eliminarProducto(carritoItem)}>Eliminar</button>
                </div>
              </div>
              <p className="cart-item-total">Subtotal: S/{calcularSubtotal(carritoItem)}</p>
            </li>
          ))
        ) : (
          <li className="cart-item">El carrito está vacío</li>
        )}
      </ul>
      <div className="cart-summary">
        <p className="subtotal-total">Subtotal Total: S/{subtotalTotal}</p>
        <button className="cart-action-button" onClick={handleIrACompra}>Ir a Compra</button>
      </div>
    </div>
  );
};

export default CarritoComponent;
