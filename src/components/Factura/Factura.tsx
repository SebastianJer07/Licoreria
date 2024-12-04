import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import FacturaService from "../../services/FacturaService";
import ProveedorService from '../../services/proveedor.services';
import { FaEdit, FaTrash, FaFileDownload } from 'react-icons/fa';
import './factura.css';
import Proveedor from '../../types/proveedores';

const FacturaComponent: React.FC = () => {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [codprove, setCodprove] = useState<number>(0);
  const [numfact, setNumfact] = useState<string>("");
  const [fecha, setFecha] = useState<string>('');
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [archivoPdf, setArchivoPdf] = useState<File | null>(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState<boolean>(false);
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState<boolean>(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any | null>(null);


  useEffect(() => {
    listarFacturas();
  }, []);

  const listarFacturas = async () => {
    try {
      const response = await FacturaService.listarFacturas();
      setFacturas(response.data);
    } catch (error) {
      console.error('Error al listar facturas:', error);
    }
  };

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await ProveedorService.getAllProveedores();
        setProveedores(response.data);
      } catch (error) {
        console.error('Error fetching proveedores', error);
      }
    };

    fetchProveedores();
  }, []);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoPdf(e.target.files[0]);
    }
  };

  const obtenerNombreProveedor = (codprove: number) => {
    const proveedor = proveedores.find(p => p.codprove === codprove);
    return proveedor ? proveedor.nomprove : 'Desconocido';
  };

  const agregarFactura = async (e: FormEvent) => {
    e.preventDefault();
    if (!archivoPdf) {
      alert('Por favor, selecciona un archivo PDF');
      return;
    }

    const formData = new FormData();
    formData.append('codprove', codprove.toString());
    formData.append('numfact', numfact);
    formData.append('fecha', fecha);
    formData.append('archivopdf', archivoPdf);

    try {
      await FacturaService.agregarFactura(formData);
      listarFacturas();
      setCodprove(0);
      setNumfact("");
      setFecha('');
      setArchivoPdf(null);
      setMostrarModalAgregar(false);
    } catch (error) {
      console.error('Error al agregar factura:', error);
    }
  };

  const actualizarFactura = async (e: FormEvent) => {
    e.preventDefault();
    if (!facturaSeleccionada) {
      alert('Por favor, selecciona una factura para actualizar');
      return;
    }

    const formData = new FormData();
    formData.append('codprove', codprove.toString());
    formData.append('numfact', numfact.toString());
    formData.append('fecha', fecha);
    if (archivoPdf) {
      formData.append('archivopdf', archivoPdf);
    }

    try {
      await FacturaService.actualizarFactura(facturaSeleccionada.codfact, formData);
      listarFacturas();
      setCodprove(0);
      setNumfact("");
      setFecha('');
      setArchivoPdf(null);
      setFacturaSeleccionada(null);
      setMostrarModalActualizar(false);
    } catch (error) {
      console.error('Error al actualizar factura:', error);
    }
  };

  const eliminarFactura = async (id: number) => {
    try {
      await FacturaService.eliminarFacturaPorId(id);
      listarFacturas();
    } catch (error) {
      console.error('Error al eliminar factura:', error);
    }
  };

  const descargarPDF = async (id: number) => {
    try {
      const response = await FacturaService.descargarArchivoPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  const abrirModalActualizar = (factura: any) => {
    setFacturaSeleccionada(factura);
    setCodprove(factura.codprove);
    setNumfact(factura.numfact);
    setFecha(factura.fecha);
    setMostrarModalActualizar(true);
  };

  return (
    <div className="factura-container">
      <h1>Listado de Facturas</h1>
      <button className="btn btn-primary" onClick={() => setMostrarModalAgregar(true)}>Agregar Factura</button>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Número de Factura</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length > 0 ? (
              facturas.map((factura, index) => (
                <tr key={index}>
                  <td>{obtenerNombreProveedor(factura.codprove)}</td>
                  <td>{factura.numfact}</td>
                  <td>{factura.fecha}</td>
                  <td>
                    <div className="acciones-container">
                      <button
                        onClick={() => abrirModalActualizar(factura)}
                        className="btn btn-warning"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => eliminarFactura(factura.codfact)}
                        className="btn btn-danger"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => descargarPDF(factura.codfact)}
                        className="btn btn-success"
                      >
                        <FaFileDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-results-message">No se encontraron facturas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModalAgregar && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setMostrarModalAgregar(false)}>&times;</span>
            <h2>Agregar Factura</h2>
            <form onSubmit={agregarFactura}>
              <div className="form-group">
                <label>Proveedor:</label>
                <select
                  value={codprove}
                  onChange={(e) => setCodprove(Number(e.target.value))}
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.codprove} value={proveedor.codprove}>
                      {proveedor.nomprove}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Número de Factura:</label>
                <input
                  type="text"
                  value={numfact}
                  onChange={(e) => setNumfact(e.target.value)}
                  required
                  />
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Archivo PDF:</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Agregar Factura</button>
            </form>
          </div>
        </div>
      )}

      {mostrarModalActualizar && facturaSeleccionada && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setMostrarModalActualizar(false)}>&times;</span>
            <h2>Actualizar Factura</h2>
            <form onSubmit={actualizarFactura}>
            <div className="form-group">
                <label>Proveedor:</label>
                <select
                  value={codprove}
                  onChange={(e) => setCodprove(Number(e.target.value))}
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.codprove} value={proveedor.codprove}>
                      {proveedor.nomprove}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Número de Factura:</label>
                <input
                    type="number"
                    value={numfact}
                    onChange={(e) => setNumfact(e.target.value)}
                    required
                  />
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Archivo PDF:</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-success">Actualizar Factura</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturaComponent;
