import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarritoService from '../../services/carritoservice';
import PedidoService from '../../services/pedido.service';
import ComprobanteService from '../../services/comprobanteservice';
import DetalleCompService from '../../services/detallecomp.service';
import PagoService from '../../services/Pago.service';
import { getCurrentUser } from '../../services/auth.service';
import Pedido ,{ EstadoPedido} from '../../types/Pedido';
import Comprobante from '../../types/comprobante';
import DetalleComp from '../../types/DetalleComp';
import Pago from '../../types/Pago';
import Carrito from '../../types/Carrito';
import IUser from '../../types/user.type';
import styles from './PedidoComprobantePagoComponent.module.css';
import PaymentProcessNavigation from './PaymentProcessNav';

const PedidoComprobantePagoComponent: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [carritos, setCarritos] = useState<Carrito[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [tipoEntrega, setTipoEntrega] = useState<'delivery' | 'recoger'>('recoger');
    const [lugar, setLugar] = useState<string>('');
    const [pedidoLocal, setPedidoLocal] = useState<Pedido | null>(null);
    const [comprobanteLocal, setComprobanteLocal] = useState<Comprobante | null>(null);
    const [pago, setPago] = useState<Pago>({
      codpago: 0,
      coduser: 0,
      fechap: new Date().toISOString().split('T')[0],
      montop: 0,
      metodop: '',
      numtarj: 0,
      cvv: 0,
      fechaven: '',
      nomtit: '',
    });
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserAndCarritos = async () => {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            const carritosData = await CarritoService.getCarritosByCoduser(currentUser.id);
            setCarritos(carritosData);
  
            const subtotalCalculado = carritosData.reduce((acc: number, carrito: { cantidad: number; preciounitario: number; }) => acc + carrito.cantidad * carrito.preciounitario, 0);
            setSubtotal(subtotalCalculado);
  
            let totalCalculado = subtotalCalculado;
            if (tipoEntrega === 'delivery') {
              totalCalculado += 20;
            }
            setTotal(totalCalculado);
  
            setPago(prevPago => ({
              ...prevPago,
              coduser: currentUser.id,
              montop: totalCalculado
            }));
  
            const ultimoPedido = await PedidoService.getUltimoPedido();
            if (ultimoPedido.data) {
              setPedidoLocal(ultimoPedido.data);
  
              // Validar tipoent antes de asignar a setTipoEntrega
              const tipoEntregaValid: 'delivery' | 'recoger' = (ultimoPedido.data.tipoent === 'delivery' || ultimoPedido.data.tipoent === 'recoger') ? ultimoPedido.data.tipoent : 'recoger';
              setTipoEntrega(tipoEntregaValid);
            }
          }
        } catch (error) {
          console.error('Error al cargar datos:', error);
        }
      };
  
      fetchUserAndCarritos();
    }, [tipoEntrega]);
  
    const handleTipoEntregaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTipoEntrega(event.target.value as 'delivery' | 'recoger');
    };
  
    const handleLugarChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setLugar(event.target.value);
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      if (comprobanteLocal) {
        setComprobanteLocal({ ...comprobanteLocal, [name]: value });
      }
    };
  
    const guardarPedido = async () => {
      if (!user) return;
  
      const nuevoPedido: Pedido = {
        codpedido: 0,
        coduser: user.id,
        fechaped: new Date().toISOString().split('T')[0],
        tipoent: tipoEntrega,
        estado: EstadoPedido.Pendiente,
        subtotal,
        total,
      };
  
      setPedidoLocal(nuevoPedido); // Guardar localmente
  
      // Aquí puedes guardar el pedido en la BD si lo prefieres
      // await PedidoService.create(nuevoPedido);
    };
  
    const guardarComprobante = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      if (!comprobanteLocal) return;
  
      const igv = comprobanteLocal.tipoc === 'Factura' ? subtotal * 0.18 : 0;
      const totalCalculado = subtotal + igv + (tipoEntrega === 'delivery' ? 20 : 0);
  
      const nuevoComprobante: Comprobante = {
        ...comprobanteLocal,
        subtotal,
        igv,
        total: totalCalculado,
        fechaemi: new Date().toISOString().split('T')[0],
      };
  
      setComprobanteLocal(nuevoComprobante); // Guardar localmente
  
      // Aquí puedes guardar el comprobante en la BD si lo prefieres
      // await ComprobanteService.create(nuevoComprobante);
    };
  
    const handlePagoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      try {
        await PagoService.createPago(pago);
  
        // Guardar pedido y comprobante en la BD después del pago
        if (pedidoLocal && comprobanteLocal) {
         // Guardar el pedido en la base de datos
          const pedidoCreado = await PedidoService.create(pedidoLocal);

          const comprobanteResponse = await ComprobanteService.create(comprobanteLocal);
          await Promise.all(
            carritos.map((item) => {
              const nuevoDetalle: DetalleComp = {
                codcompd: 0,
                codcomp: comprobanteResponse.data.codcomp,
                coduser: user?.id || 0,
                nompro: item.nombre,
                cantidad: item.cantidad,
                preciouni: item.preciounitario,
                subtotal: item.cantidad * item.preciounitario
              };
              return DetalleCompService.guardarDetalleComprobante(nuevoDetalle);
            })
          );
  
          navigate('/compra/paso-final');
        }
      } catch (error) {
        console.error('Error al procesar el pago:', error);
      }
    };

  if (!user) return <div>Loading user...</div>;

  return (
    <div className={styles.container}>
        <PaymentProcessNavigation />
        <div className={styles.content}>
            <form onSubmit={guardarComprobante}>
                {/* Aquí puedes agregar los campos del comprobante */}
                <button type="submit">Guardar Comprobante</button>
            </form>
            <form onSubmit={handlePagoSubmit}>
                {/* Aquí puedes agregar los campos de pago */}
                <button type="submit">Realizar Pago</button>
            </form>
            <select value={tipoEntrega} onChange={handleTipoEntregaChange}>
                <option value="recoger">Recoger en tienda</option>
                <option value="delivery">Entrega a domicilio</option>
            </select>
        </div>
    </div>
);
};


export default PedidoComprobantePagoComponent;
