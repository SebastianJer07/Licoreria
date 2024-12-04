import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaEdit, FaTrash, FaFileDownload } from 'react-icons/fa';
import CotizacionService from '../../services/cotizacion.service';
import ProveedorService from '../../services/proveedor.services';
import './cotizacion.css';

const CotizacionComponent: React.FC = () => {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [cotizacionesOriginales, setCotizacionesOriginales] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [codprove, setCodprove] = useState<number | string>('');
  const [producto, setProducto] = useState('');
  const [fecha, setFecha] = useState('');
  const [archivoPdf, setArchivoPdf] = useState<File | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState<boolean>(false);
  const [mostrarModalActualizar, setMostrarModalActualizar] = useState<boolean>(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<any | null>(null);

  useEffect(() => {
    listarCotizaciones();
    listarProveedores();
  }, []);

  const listarCotizaciones = async () => {
    try {
      const response = await CotizacionService.listarCotizaciones();
      if (Array.isArray(response.data)) {
        setCotizaciones(response.data);
        setCotizacionesOriginales(response.data);
      } else {
        console.error('Error: La respuesta no contiene una lista de cotizaciones.');
      }
    } catch (error) {
      console.error('Error al listar cotizaciones:', error);
    }
  };

  const listarProveedores = async () => {
    try {
      const response = await ProveedorService.getAllProveedores();
      if (Array.isArray(response.data)) {
        setProveedores(response.data);
      } else {
        console.error('Error: La respuesta no contiene una lista de proveedores.');
      }
    } catch (error) {
      console.error('Error al listar proveedores:', error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoPdf(e.target.files[0]);
    }
  };

  const getNombreProveedor = (codprove: number | undefined) => {
    const proveedor = proveedores.find(prov => prov.codprove === codprove);
    return proveedor ? proveedor.nomprove : 'Proveedor desconocido';
  };

  const agregarCotizacion = async (e: FormEvent) => {
    e.preventDefault();
    if (!archivoPdf) {
      alert('Por favor, selecciona un archivo PDF');
      return;
    }

    const formData = new FormData();
    formData.append('codprove', codprove.toString());
    formData.append('producto', producto);
    formData.append('fecha', fecha);
    formData.append('archivopdf', archivoPdf);

    try {
      await CotizacionService.agregarCotizacion(formData);
      listarCotizaciones();
      setCodprove('');
      setProducto('');
      setFecha('');
      setArchivoPdf(null);
      setMostrarModalAgregar(false);
    } catch (error) {
      console.error('Error al agregar cotización:', error);
    }
  };

  const actualizarCotizacion = async (e: FormEvent) => {
    e.preventDefault();
    if (!archivoPdf && !cotizacionSeleccionada) {
      alert('Por favor, selecciona un archivo PDF o elige una cotización para actualizar');
      return;
    }

    const formData = new FormData();
    formData.append('codprove', codprove.toString());
    formData.append('producto', producto);
    formData.append('fecha', fecha);
    if (archivoPdf) {
      formData.append('archivopdf', archivoPdf);
    }

    try {
      await CotizacionService.actualizarCotizacion(cotizacionSeleccionada.codcotiz, formData);
      listarCotizaciones();
      setCodprove('');
      setProducto('');
      setFecha('');
      setArchivoPdf(null);
      setCotizacionSeleccionada(null);
      setMostrarModalActualizar(false);
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
    }
  };

  const eliminarCotizacion = async (id: number) => {
    try {
      await CotizacionService.eliminarCotizacionPorId(id);
      listarCotizaciones();
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
    }
  };

  const descargarPDF = async (id: number) => {
    try {
      const response = await CotizacionService.descargarPDF(id);
      const url = window.URL.createObjectURL(new Blob([response]));
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setBusqueda(searchTerm);
    filtrarCotizaciones(searchTerm);
  };

  const filtrarCotizaciones = (terminoBusqueda: string) => {
    if (terminoBusqueda.trim() === '') {
      setCotizaciones(cotizacionesOriginales);
    } else {
      const resultadosBusqueda = cotizacionesOriginales.filter((cotizacion) => {
        return (
          getNombreProveedor(cotizacion.codprove).toLowerCase().includes(terminoBusqueda) ||
          cotizacion.producto.toLowerCase().includes(terminoBusqueda)
        );
      });
      setCotizaciones(resultadosBusqueda);
    }
  };

  const abrirModalActualizar = (cotizacion: any) => {
    setCotizacionSeleccionada(cotizacion);
    setCodprove(cotizacion.codprove);
    setProducto(cotizacion.producto);
    setFecha(cotizacion.fecha);
    setMostrarModalActualizar(true);
  };

  return (
    <div className="cotizacion-container">
      <h1>Administrar Cotizaciones</h1>

      <div className="search-container">
        <input
          className="form-control input-buscar"
          value={busqueda}
          placeholder="Buscar por proveedor o producto"
          onChange={handleSearchChange}
        />
      </div>

      <button className="btn btn-primary" onClick={() => setMostrarModalAgregar(true)}>Agregar Cotización</button>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Producto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.length > 0 ? (
              cotizaciones.map((cotizacion, index) => (
                <tr key={index}>
                  <td>{getNombreProveedor(cotizacion.codprove)}</td>
                  <td>{cotizacion.producto}</td>
                  <td>{cotizacion.fecha}</td>
                  <td>
                    <div className="acciones-container">
                      <button 
                        onClick={() => abrirModalActualizar(cotizacion)} 
                        className="btn btn-warning"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => eliminarCotizacion(cotizacion.codcotiz)} 
                        className="btn btn-danger"
                      >
                        <FaTrash />
                      </button>
                      <button 
                        onClick={() => descargarPDF(cotizacion.codcotiz)} 
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
                <td colSpan={4}>No se encontraron cotizaciones</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModalAgregar && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setMostrarModalAgregar(false)}>&times;</span>
            <h2>Agregar Cotización</h2>
            <form onSubmit={agregarCotizacion}>
              <div className="form-group">
                <label>Proveedor:</label>
                <select value={codprove} onChange={(e) => setCodprove(Number(e.target.value))} required>
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.codprove} value={proveedor.codprove}>
                      {proveedor.nomprove}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Producto:</label>
                <input
                  type="text"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
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
              <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {mostrarModalActualizar && cotizacionSeleccionada && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setMostrarModalActualizar(false)}>&times;</span>
            <h2>Actualizar Cotización</h2>
            <form onSubmit={actualizarCotizacion}>
              <div className="form-group">
                <label>Proveedor:</label>
                <select value={codprove} onChange={(e) => setCodprove(Number(e.target.value))} required>
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.codprove} value={proveedor.codprove}>
                      {proveedor.nomprove}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Producto:</label>
                <input
                  type="text"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
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
                <label>Archivo PDF (opcional):</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Actualizar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotizacionComponent;
