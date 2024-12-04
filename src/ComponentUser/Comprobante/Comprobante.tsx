import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComprobanteService from '../../services/comprobanteservice';
import Comprobante from '../../types/comprobante';
import Carrito from '../../types/Carrito';
import { getCurrentUser } from '../../services/auth.service';
import CarritoService from '../../services/carritoservice';
import Pedido from '../../types/Pedido';
import pedidoService from '../../services/pedido.service';
import DetalleComp from '../../types/DetalleComp';
import DetalleCompService from '../../services/detallecomp.service';
import IUser from "../../types/user.type";
import styles from './Comprobante.module.css'; // Importa el módulo CSS

const ComprobanteComponent: React.FC = () => {
  const initialComprobanteState: Comprobante = {
    codcomp: 0,
    tipoc: '',
    nombre: '',
    apellidos: '',
    tipodoc: 'DNI',
    nrodoc: '',
    ruc: '',
    razons: '',
    paisr: '',
    dircalle: '',
    apartamento: '',
    distrito: '',
    telefono: '',
    correo: '',
    fechaemi: '',
    subtotal: 0,
    igv: 0,
    total: 0,
    notas: '',
  };

  const [comprobante, setComprobante] = useState<Comprobante>(initialComprobanteState);
  const [carrito, setCarrito] = useState<Carrito[]>([]);
  const [tipoEntrega, setTipoEntrega] = useState<string>('retiro'); // Valor por defecto
  const [user, setUser] = useState<IUser | null>(null);
  const [telefonoValido, setTelefonoValido] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const fetchUserAndCarritos = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser); // Guarda el usuario actual en el estado
          const carritosData = await CarritoService.getCarritosByCoduser(currentUser.id);
          setCarrito(carritosData);
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario y el carrito:', error);
      }
    };

    const obtenerUltimoPedido = async () => {
      try {
        const response = await pedidoService.getUltimoPedido();
        if (response.data) {
          const ultimoPedido: Pedido = response.data;
          setTipoEntrega(ultimoPedido.tipoent || 'retiro'); // Asignar el tipo de entrega
        }
      } catch (error) {
        console.error("Error al obtener el último pedido:", error);
      }
    };

    fetchUserAndCarritos();
    obtenerUltimoPedido();
      // Cargar comprobante guardado localmente
      const storedComprobante = localStorage.getItem('comprobante');
      if (storedComprobante) {
        setComprobante(JSON.parse(storedComprobante));
      }

  }, []);

  const calcularTotales = (carrito: Carrito[], tipoEntrega: string) => {
    let subtotal = 0;
    carrito.forEach((item) => {
      subtotal += item.cantidad * item.preciounitario;
    });

    const igv = comprobante.tipoc === 'Factura' ? subtotal * 0.18 : 0; // 18% de IGV para facturas
    const total = subtotal + igv + (tipoEntrega === 'delivery' ? 20 : 0); // Añadir 20 soles si el tipo de entrega es delivery
    return { subtotal, igv, total };
  };

  const validarTelefono = (telefono: string): boolean => {
    const telefonoRegex = /^\d{9}$/;
    return telefonoRegex.test(telefono);
  };

  const guardarComprobante = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar teléfono
    if (!validarTelefono(comprobante.telefono)) {
      setTelefonoValido(false);
      setError('El número de teléfono debe tener exactamente 9 dígitos.');
      return;
    } else {
      setTelefonoValido(true);
      setError(null);
    }

    const { subtotal, igv, total } = calcularTotales(carrito, tipoEntrega);

    const nuevoComprobante: Comprobante = {
      ...comprobante,
      subtotal,
      igv,
      total,
      fechaemi: new Date().toISOString().split('T')[0],
    };

    try {
      const comprobanteResponse = await ComprobanteService.create(nuevoComprobante);
      console.log('Comprobante guardado correctamente:', comprobanteResponse.data);

      localStorage.setItem('comprobante', JSON.stringify(nuevoComprobante));

      // Guardar cada detalle del comprobante para cada artículo en el carrito
      for (const item of carrito) {
        const nuevoDetalleComprobante: DetalleComp = {
          codcompd: 0,
          codcomp: comprobanteResponse.data.codcomp,
          coduser: user?.id || 0, // Asegúrate de que el `coduser` del usuario actual se incluya aquí
          nompro: item.nombre,
          cantidad: item.cantidad,
          preciouni: item.preciounitario,
          subtotal: item.cantidad * item.preciounitario // Calcula el subtotal por artícul
        };

        const detalleComprobanteResponse = await DetalleCompService.guardarDetalleComprobante(nuevoDetalleComprobante);
        console.log('Detalle de comprobante guardado correctamente:', detalleComprobanteResponse.data);
      }

      setComprobante(initialComprobanteState);
      navigate('/compra/paso-3');
    } catch (error) {
      console.error('Error al guardar el comprobante o detalle:', error);
    }
  };

  const handleBack = () => {
    navigate('/compra/paso-1');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setComprobante({ ...comprobante, [name]: value });
  };

  const isFactura = comprobante.tipoc === 'Factura';
  
  return (
    <div className={styles.formContainer}>
      <h2>Guardar Comprobante</h2>
      <form onSubmit={guardarComprobante}>
        <div className={styles.formGroup}>
          <label>Tipo de Comprobante:</label>
          <select name="tipoc" value={comprobante.tipoc} onChange={handleInputChange}>
            <option value="Selecciona">Selecciona</option>
            <option value="Factura">Factura</option>
            <option value="Boleta">Boleta</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={comprobante.nombre} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Apellidos:</label>
          <input type="text" name="apellidos" value={comprobante.apellidos} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Tipo de Documento:</label>
          <select name="tipodoc" value={comprobante.tipodoc} onChange={handleInputChange}>
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        
          <div className={styles.formGroup}>
            <label>Número de Documento:</label>
            <input type="text" name="nrodoc" value={comprobante.nrodoc} onChange={handleInputChange} />
          </div>

        {isFactura && (
          <>
            <div className={styles.formGroup}>
              <label>RUC:</label>
              <input type="text" name="ruc" value={comprobante.ruc} onChange={handleInputChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Razón Social:</label>
              <input type="text" name="razons" value={comprobante.razons} onChange={handleInputChange} />
            </div>
          </>
        )}
        
        <div className={styles.formGroup}>
          <label>País o Región:</label>
          <input type="text" name="paisr" value={comprobante.paisr} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Dirección Calle:</label>
          <input type="text" name="dircalle" value={comprobante.dircalle} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Apartamento:</label>
          <input type="text" name="apartamento" value={comprobante.apartamento} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Distrito:</label>
          <input type="text" name="distrito" value={comprobante.distrito} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Teléfono:</label>
          <input
            type="text" name="telefono" value={comprobante.telefono}onChange={handleInputChange} pattern="\d{9}"
            required
          />
          {!telefonoValido && <p className={styles.errorText}>El número de teléfono debe tener exactamente 9 dígitos.</p>}

        </div>

        <div className={styles.formGroup}>
          <label>Correo Electrónico:</label>
          <input type="email" name="correo" value={comprobante.correo} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Notas:</label>
          <textarea name="notas" value={comprobante.notas} onChange={handleInputChange} />
        </div>

        <div className={styles.formButtons}>
          <button type="submit">Guardar Comprobante</button>
          <button type="button" onClick={handleBack}>Volver</button>
        </div>
      </form>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default ComprobanteComponent;
