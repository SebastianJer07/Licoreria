import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PagoService from "../../services/Pago.service";
import PedidoService from "../../services/pedido.service";
import DetalleCompService from "../../services/detallecomp.service";
import ComprobanteService from "../../services/comprobanteservice";
import ProductoVService from "../../services/productov.services";
import CarritoService from "../../services/carritoservice";

import Pago from "../../types/Pago";
import Pedido from "../../types/Pedido";
import DetalleComp from "../../types/DetalleComp";
import IUser from "../../types/user.type";
import { getCurrentUser } from "../../services/auth.service";
import "./Pago.css"
import Comprobante from "../../types/comprobante";
import Carrito from "../../types/Carrito";


const PagoComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [comp, setComp] = useState<Comprobante | null>(null);
  const [carrito, setCarro] = useState<Carrito| null>(null);
  const navigate = useNavigate(); // Hook de navegación
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [detalle, setDetalle] = useState<DetalleComp | null>(null);
  const [pago, setPago] = useState<Pago>({
    codpago: 0,
    coduser: 0,
    fechap: new Date().toISOString().split('T')[0],
    montop: 0,
    metodop: "",
    numtarj: 0,
    cvv: 0,
    fechaven: "",
    nomtit: "",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setPago((prevPago) => ({
            ...prevPago,
            coduser: currentUser.id
          }));
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };


    fetchCurrentUser();
  }, []);

  useEffect(() => {
    
    const obtenerUltimoPedido = async () => {
      try {
        const response = await PedidoService.getUltimoPedido();
        if (response.data) {
          const ultimoPedido: Pedido = response.data;
          setPedido(ultimoPedido);
          setPago((prevPago) => ({
            ...prevPago,
            montop: ultimoPedido.total || 0
          }));
        }
      } catch (error) {
        console.error("Error al obtener el último pedido:", error);
      }
    };
    obtenerUltimoPedido();

  }, []);

  useEffect(() => {
    const fetchUltimoComprobante = async () => {
      try {
        const response = await ComprobanteService.getUltimoComp();
        if (response.data) {
          const ultimoComp: Comprobante = response.data;
          setComp(ultimoComp);
          setPago((prevPago) => ({
            ...prevPago,
            codcomp: ultimoComp.codcomp
          }));
        }
      } catch (error) {
        console.error("Error al obtener el último comprobante:", error);
      }
    };

    fetchUltimoComprobante();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPago((prevPago) => ({
      ...prevPago,
      [name]: name === "numtarj" || name === "cvv" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
        // Validar que todos los campos necesarios estén llenos
      if (!pago.metodop || !pago.numtarj || !pago.cvv || !pago.fechaven || !pago.nomtit) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
      }

      // Validar el número de tarjeta y CVV
      if (pago.numtarj.toString().length !== 14) {
        alert("El número de tarjeta debe tener 14 dígitos.");
        return;
      }

      if (pago.cvv.toString().length !== 4) {
        alert("El CVV debe tener 4 dígitos.");
        return;
      }


    try {
      // Crear el pago
      const response = await PagoService.createPago(pago);
      console.log("Pago creado:", response.data);

      // Eliminar el pedido de localStorage
      localStorage.removeItem('pedido');
      localStorage.removeItem('comprobante'); // Limpiar el comprobante guardado


      // Obtener el último detalle y actualizar el stock
      if (comp) {
        const detalleResponse = await DetalleCompService.getUltimoDetalle();
        if (detalleResponse.data) {
          const ultimoDetalle: DetalleComp = detalleResponse.data;
          setDetalle(ultimoDetalle);

          // Actualiza el stock del producto por nombre
          if (ultimoDetalle.nompro) {
            await ProductoVService.updateStockByName(ultimoDetalle.nompro, ultimoDetalle.cantidad);
          }
        }
      }

    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const carritosData = await CarritoService.getCarritosByCoduser(currentUser.id);
      if (carritosData && carritosData.length > 0) {
        for (const carrito of carritosData) {
          await CarritoService.eliminarCarrito(carrito.codcar);
        }
      }
    }

       
      
      // Generar y descargar el PDF
      if (comp) {
        const pdfResponse = await DetalleCompService.generarYDescargarPDF(comp.codcomp);
        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'detalles_comprobante.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Redireccionar después de crear el pago y descargar el PDF
      navigate('/');
    } catch (error) {
      console.error("Error al crear el pago o generar el PDF:", error);
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-heading">Formulario de Pago</h2>
      <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
          <label htmlFor="metodop">Método de Pago:</label>
          <select
            id="metodop"
            name="metodop"
            value={pago.metodop}
            onChange={handleInputChange}
            required
            className="form-control select-control"
          >
            <option value="">Seleccionar Método de Pago</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="numtarj">Número de Tarjeta:</label>
          <div className="icon-input">
            <input
              type="number"
              id="numtarj"
              name="numtarj"
              value={pago.numtarj}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="Ingrese el número de tarjeta"
              minLength={14}
              maxLength={14}
              pattern="\d{14}" // Validación de 14 dígitos
            />
            <i className="fas fa-credit-card"></i>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV:</label>
          <div className="icon-input">
            <input
              type="number"
              id="cvv"
              name="cvv"
              value={pago.cvv}
              onChange={handleInputChange}
              required
              className="form-control small-cvv" // Aplica la clase para el input más pequeño
              placeholder="Ingrese el CVV"
              maxLength={4} // Limita a cuatro dígitos
            />
            <i className="fas fa-lock"></i>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="fechaven">Fecha de Vencimiento:</label>
          <input
            type="month"
            id="fechaven"
            name="fechaven"
            value={pago.fechaven}
            onChange={handleInputChange}
            required
            className="form-control"
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="nomtit">Nombre del Titular:</label>
          <div className="icon-input">
            <input
              type="text"
              id="nomtit"
              name="nomtit"
              value={pago.nomtit}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="Ingrese el nombre del titular"
            />
            <i className="fas fa-user"></i>
          </div>
        </div>
        <button type="submit" className="btn-submit">
          Crear Pago
        </button>
      </form>
    </div>
  );
};

export default PagoComponent;