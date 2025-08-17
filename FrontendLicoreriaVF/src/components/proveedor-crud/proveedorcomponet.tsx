import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import ProveedoresService from '../../services/proveedor.services';
import Proveedor from '../../types/proveedores';
import './proveedor.css';

const ProveedoresComponent: React.FC = () => {
  const initialProveedorState: Proveedor = {
    codprove: 0,
    nomprove: '',
    telprove: '',
    dirprove: "",
    correoprove: ""
  };

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [currentProveedor, setCurrentProveedor] = useState<Proveedor>(initialProveedorState);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = () => {
    ProveedoresService.getAllProveedores()
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error('Error al cargar proveedores:', error);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProveedor({ ...currentProveedor, [name]: value });
  };

  const abrirModalCrear = () => {
    setCurrentProveedor(initialProveedorState);
    setModalTitle('Agregar Proveedor');
    setMostrarModal(true);
  };

  const abrirModalEditar = (proveedor: Proveedor) => {
    setCurrentProveedor(proveedor); 
    setModalTitle("Editar Proveedor");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const handleCrearProveedor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentProveedor.codprove === 0) {
      // Crear nuevo proveedor
      ProveedoresService.crearProveedor(currentProveedor)
        .then(response => {
          setProveedores([...proveedores, response.data]);
          cerrarModal();
        })
        .catch(error => {
          console.error('Error al crear proveedor:', error);
        });
    } else {
      // Actualizar proveedor existente
      ProveedoresService.actualizarProveedor(currentProveedor.codprove, currentProveedor)
        .then(() => {
          cargarProveedores();
          cerrarModal();
        })
        .catch(error => {
          console.error('Error al actualizar proveedor:', error);
        });
    }
  };

  const handleEliminarProveedor = (id: number | undefined) => {
    if (id !== undefined) {
      ProveedoresService.deleteProveedor(id)
        .then(() => {
          cargarProveedores();
        })
        .catch((error) => {
          console.error('Error al eliminar proveedor:', error);
        });
    } else {
      console.error('ID de proveedor no definido');
    }
  };

  return (
    <div className="proveedores-container">
      <h1>Proveedores</h1>
      <button className="btn btn-primary" onClick={abrirModalCrear}>
        Crear Proveedor
      </button>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>&times;</span>
            <h2>{modalTitle}</h2>
            <form onSubmit={handleCrearProveedor} className="form-proveedor">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nomprove"
                  value={currentProveedor.nomprove}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="dirprove"
                  value={currentProveedor.dirprove}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  name="telprove"
                  value={currentProveedor.telprove}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="text"
                  name="correoprove"
                  value={currentProveedor.correoprove}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(proveedor => (
              <tr key={proveedor.codprove}>
                <td>{proveedor.nomprove}</td>
                <td>{proveedor.dirprove}</td>
                <td>{proveedor.telprove}</td>
                <td>{proveedor.correoprove}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => abrirModalEditar(proveedor)}>
                    Actualizar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleEliminarProveedor(proveedor.codprove)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProveedoresComponent;
