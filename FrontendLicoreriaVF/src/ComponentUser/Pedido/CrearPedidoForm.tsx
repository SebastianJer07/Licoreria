import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarritoService from '../../services/carritoservice';
import PedidoProService from '../../services/pedidopro.service';
import PedidoService from '../../services/pedido.service';
import Pedido, { EstadoPedido } from '../../types/Pedido';
import PedidoPro from '../../types/Pedidopro';
import IUser from '../../types/user.type';
import { getCurrentUser } from '../../services/auth.service';
import Carrito from '../../types/Carrito';
import "./CrearPedidoForm.css"

const CrearPedidoForm: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [tipoEntrega, setTipoEntrega] = useState<'delivery' | 'recoger'>('recoger');
  const [lugar, setLugar] = useState<string>(''); // Estado para el lugar de recogida
  const [pedidos, setPedidos] = useState<PedidoPro[]>([]);
  const [error, setError] = useState<string | null>(null); // Estado para el mensaje de error

  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const fetchUserAndCarritos = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const carritosData = await CarritoService.getCarritosByCoduser(currentUser.id);
        setCarritos(carritosData);

        const subtotalCalculado = carritosData.reduce((acc:number, carrito:Carrito) => acc + carrito.cantidad * carrito.preciounitario, 0);
        setSubtotal(subtotalCalculado);

        let totalCalculado = subtotalCalculado;
        if (tipoEntrega === 'delivery') {
          totalCalculado += 20; // Costo adicional por delivery
        }
        setTotal(totalCalculado);
      }
    };

    fetchUserAndCarritos();
  }, [tipoEntrega]);

  useEffect(() => {
    // Recuperar el último pedido guardado en localStorage
    const pedidoGuardado = localStorage.getItem('pedido');
    if (pedidoGuardado) {
      const pedido: Pedido = JSON.parse(pedidoGuardado);
      setTipoEntrega(pedido.tipoent as 'delivery' | 'recoger');
      // Si es necesario, establecer otros valores en el estado.
      // Esto es útil si el lugar también se guarda en el pedido.
      // setLugar(pedido.lugar || ''); 
    }
  }, []);

  const handleTipoEntregaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoEntrega(event.target.value as 'delivery' | 'recoger');
  };

  const handleLugarChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLugar(event.target.value);
  };

  const guardarPedidos = async () => {
    if (!user) return;

    // Validación para el tipo de entrega y lugar
    if (tipoEntrega === 'recoger' && !lugar) {
      setError('Por favor, selecciona el lugar de recogida.');
      return;
    }

    // Crear el pedido con tipo de entrega
    const nuevoPedido: Pedido = {
      codpedido: 0,
      coduser: user.id,
      fechaped: new Date().toISOString().split('T')[0],
      tipoent: tipoEntrega,
      estado: EstadoPedido.Pendiente,
      subtotal: subtotal,
      total: total,
      // Puedes incluir el lugar aquí si tu backend lo soporta, de lo contrario lo puedes usar solo en la interfaz
    };

    try {
      const pedidoCreado = await PedidoService.create(nuevoPedido);

      const promises = carritos.map((carrito) => {
        const nuevoPedidopro: PedidoPro = {
          codpepro: 0,
          codped: pedidoCreado.data.codpedido,
          codprov: carrito.codprov,
          nompro: carrito.nombre,
          preciounitario: carrito.preciounitario,
          cantidad: carrito.cantidad,
        };
        return PedidoProService.crearPedidoPro(nuevoPedidopro);
      });

      const responses = await Promise.all(promises);
      const pedidosGuardados = responses.map(response => response.data);
      setPedidos([...pedidos, ...pedidosGuardados]);
      // Guardar el pedido en localStorage
      localStorage.setItem('pedido', JSON.stringify(nuevoPedido));
      navigate('/compra/paso-2');

      console.log('Pedidos guardados:', pedidosGuardados);
    } catch (error) {
      console.error('Error al guardar los pedidos:', error);
    }
  };

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="container">
      <h2>Crear Pedido</h2>
      <div>
        <label>Tipo de entrega:</label>
        <select value={tipoEntrega} onChange={handleTipoEntregaChange}>
          <option value="recoger">Recoger en tienda</option>
          <option value="delivery">Delivery (+S/20)</option>
        </select>
      </div>
      {tipoEntrega === 'recoger' && (
        <div>
          <label>Selecciona el lugar de recogida:</label>
          <select value={lugar} onChange={handleLugarChange}>
            <option value="">Selecciona una tienda</option>
            <option value="tienda Lince">Tienda Lince</option>
            <option value="tienda La Victoria">Tienda La Victoria</option>
            <option value="tienda Centro de Lima">Tienda Centro de Lima</option>
          </select>
          {error && <p className="error">{error}</p>}
        </div>
      )}
      <ul>
        {carritos.map((carrito) => (
          <li key={carrito.codcar}>
            <div>
              <h3>{carrito.nombre} - {carrito.cantidad} - S/{carrito.preciounitario}</h3>
            </div>
            <h4>Subtotal: S/{carrito.cantidad * carrito.preciounitario}</h4>
          </li>
        ))}
      </ul>
      <div className="total">Total S/{total}</div>
      <div className="button-container">
        <button type="button" onClick={() => navigate('/compra/paso-1')}>
          Retroceder
        </button>
        <button onClick={guardarPedidos}>Seguiente</button>
      </div>
    </div>
  );
};

export default CrearPedidoForm;
