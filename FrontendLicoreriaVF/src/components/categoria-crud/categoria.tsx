import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import CategoriaService from "../../services/categoria.service";
import ICategorias from "../../types/categorias";
import "./categoria.css";

const CategoriaComponent: React.FC = () => {
  const initialCategoriaState: ICategorias = { codcat: 0, nomcat: "" };

  const [categorias, setCategorias] = useState<Array<ICategorias>>([]);
  const [currentCategoria, setCurrentCategoria] = useState<ICategorias>(initialCategoriaState);
  const [message, setMessage] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");

  useEffect(() => {
    retrieveCategorias();
  }, []);

  useEffect(() => {
    if (message || successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setMessage("");
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, successMessage, errorMessage]);

  const retrieveCategorias = () => {
    CategoriaService.getAll()
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Error al cargar las categorías.");
      });
  };

  const abrirModalCrear = () => {
    setCurrentCategoria(initialCategoriaState);
    setModalTitle("Crear Nueva Categoría");
    setMostrarModal(true);
  };

  const abrirModalEditar = (categoria: ICategorias) => {
    setCurrentCategoria(categoria);
    setModalTitle("Editar Categoría");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFieldError(""); // Limpiar errores del campo al cerrar el modal
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentCategoria({ ...currentCategoria, [name]: value });
  };

  const categoriaNombreExiste = (nombre: string, excludeId?: number): boolean => {
    return categorias.some(categoria => 
      categoria.nomcat.toLowerCase() === nombre.toLowerCase() && categoria.codcat !== excludeId
    );
  };

  const saveCategoria = (event: FormEvent) => {
    event.preventDefault();

    if (categoriaNombreExiste(currentCategoria.nomcat, currentCategoria.codcat)) {
      setFieldError("¡El nombre de la categoría ya existe!");
      return;
    }
  
    setFieldError(""); // Limpiar mensaje de error del campo

    if (currentCategoria.codcat === 0) {
      CategoriaService.create(currentCategoria)
        .then(() => {
          setSuccessMessage("¡La categoría fue creada exitosamente!");
          cerrarModal();
          retrieveCategorias();
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Error al crear la categoría.");
        });
    } else {
      CategoriaService.update(currentCategoria.codcat, currentCategoria)
        .then(() => {
          setSuccessMessage("La categoría fue actualizada con éxito");
          cerrarModal();
          retrieveCategorias();
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Error al actualizar la categoría.");
        });
    }
  };

  const deleteCategoria = (id: number | undefined) => {
    if (id !== undefined) {
      CategoriaService.remove(id)
        .then(() => {
          setSuccessMessage("La categoría fue eliminada con éxito");
          retrieveCategorias();
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Error al eliminar la categoría.");
        });
    } else {
      console.error("ID de categoría no definido");
      setErrorMessage("ID de categoría no definido.");
    }
  };

  return (
    <div className="categorias-container">
      <h1>Gestión de Categorías</h1>
      <div className="actions-container">
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          Crear Nueva Categoría
        </button>

        <div className="notifications">
          {successMessage && (
            <div className="success-notification">
              <small>{successMessage}</small>
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger">
              <small>{errorMessage}</small>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && (
        <div className="categoria-modal">
          <div className="categoria-modal-content">
            <span className="categoria-close" onClick={cerrarModal}>&times;</span>
            <h2>{modalTitle}</h2>
            <form onSubmit={saveCategoria} className="form-categoria">
              <div className="form-group">
                <label htmlFor="nomcat">Nombre de la Categoría</label>
                <input
                  type="text"
                  id="nomcat"
                  name="nomcat"
                  value={currentCategoria.nomcat}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
                {fieldError && <div className="field-error mt-2">{fieldError}</div>}
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

      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.codcat}>
                <td>{categoria.codcat}</td>
                <td>{categoria.nomcat}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-warning" onClick={() => abrirModalEditar(categoria)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteCategoria(categoria.codcat)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriaComponent;
