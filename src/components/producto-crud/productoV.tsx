import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import CategoriaService from "../../services/categoria.service";
import ProductosVData from "../../types/productosV";
import styles from "./productosV.module.css"; // Importing CSS module
import ICategorias from "../../types/categorias";
import ProductoVService from "../../services/productov.services";
import 'bootstrap/dist/css/bootstrap.min.css';




const ProductoVComponent: React.FC = () => {
  const initialProductoState: ProductosVData = {
    codprov: 0,
    nombre: "",
    codcat: 0,
    prodes: "",
    precioventa: 0,
    promocion: 0,
    stockdisp: 0,
    estado: false,
    imagen: "",
    fechaven: ""
  };

  const [productos, setProductos] = useState<Array<ProductosVData>>([]);
  const [currentProducto, setCurrentProducto] = useState<ProductosVData>(initialProductoState);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [categorias, setCategorias] = useState<ICategorias[]>([]);
  const [message, setMessage] = useState<string>("");
  const [notifiedProducts, setNotifiedProducts] = useState<Set<number>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string>("");


  useEffect(() => {
    retrieveProductos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    productos.forEach(producto => {
      if (producto.stockdisp < 10 && !notifiedProducts.has(producto.codprov)) {
        alert(`El stock del producto ${producto.nombre} es menor a 10 unidades. Su stock es ${producto.stockdisp}`);
        setNotifiedProducts(prev => new Set(prev).add(producto.codprov));
      }
    });
  }, [productos, notifiedProducts]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const retrieveProductos = () => {
    ProductoVService.getAll()
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const fetchCategorias = async () => {
    try {
      const response = await CategoriaService.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  

  

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const abrirModalCrear = () => {
    setCurrentProducto(initialProductoState);
    setModalTitle("Agregar Producto");
    setMostrarModal(true);
  };

  const abrirModalEditar = (producto: ProductosVData) => {
    setCurrentProducto(producto);
    setModalTitle("Editar Producto");
    setMostrarModal(true);
  };

  const calcularPrecioDescuento = (precio: number, descuento: number): number => {
    return precio * (1 - (descuento / 100));
  };

  const productoExiste = (nombre: string, excludeId?: number): boolean => {
    return productos.some(producto => 
      producto.nombre.toLowerCase() === nombre.toLowerCase() && producto.codprov !== excludeId
    );
  };

  const saveProducto = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    if (productoExiste(currentProducto.nombre) && currentProducto.codprov === 0) {
      setMessage("El producto con este nombre ya existe.");
      return;
    }


    // Calcula el precio con descuento
    const precioConDescuento = calcularPrecioDescuento(currentProducto.precioventa, currentProducto.promocion);

    const productoConDescuento = {
      ...currentProducto,
      precioventa: precioConDescuento
    };

    if (currentProducto.codprov === 0) {
      ProductoVService.create(productoConDescuento)
        .then(response => {
          setProductos([...productos, response.data]);
          setSuccessMessage("Producto creado con éxito.");
          cerrarModal();
          retrieveProductos();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      updateProducto(productoConDescuento);
    }
  };

  const updateProducto = (producto: ProductosVData) => {
    if (productoExiste(producto.nombre, producto.codprov)) {
      setMessage("El producto con este nombre ya existe.");
      return;
    }

    ProductoVService.update(producto.codprov, producto)
      .then(() => {
        setSuccessMessage("Producto actualizado con éxito.");
        retrieveProductos();
        cerrarModal();
      })
      .catch(error => {
        console.error('Error al actualizar producto:', error);
      });
  };


  const deleteProducto = (id: number | undefined) => {
    if (id !== undefined) {
      ProductoVService.remove(id)
        .then(() => {
          setSuccessMessage("Producto eliminado con éxito");
          retrieveProductos();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("ID de producto no definido");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setCurrentProducto({ ...currentProducto, [name]: (event.target as HTMLInputElement).checked });
    } else {
      const updatedValue = name === 'codcat' ? +value : value;
      const updatedProducto = {
        ...currentProducto,
        [name]: name === 'promocion' ? +updatedValue : updatedValue,
        estado: name === 'estado' ? (event.target as HTMLInputElement).checked : currentProducto.estado
      };

      // Recalcula el precio con descuento si la promoción cambia
      if (name === 'promocion') {
        const precioConDescuento = calcularPrecioDescuento(currentProducto.precioventa, +updatedValue);
        updatedProducto.precioventa = precioConDescuento;
      }

      setCurrentProducto(updatedProducto);
    }
  };

  

  const getNombreCategoria = (codcat: number | undefined) => {
    const categoria = categorias.find(cat => cat.codcat === codcat);
    return categoria ? categoria.nomcat : 'Categoría desconocida';
  };

  return (
    <div className={styles["productos-container"]}>
      <h1>Productos</h1>
      <button className="btn btn-primary" onClick={abrirModalCrear}>
        Crear Producto
      </button>

      <div className={styles.notifications}>
          {successMessage && (
            <div className="alert alert-success">
              <small>{successMessage}</small>
            </div>
          )}
          {message && (
            <div className="alert alert-danger">
              <small>{message}</small>
            </div>
          )}
        </div>

      {mostrarModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <span className={styles.close} onClick={cerrarModal}>&times;</span>
            <h2>{modalTitle}</h2>
            <form onSubmit={saveProducto} className={styles["form-producto"]}>
              <div className={styles["form-group"]}>
                <div className={styles["form-group-left"]}>
                  <label>Nombre del Producto:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={currentProducto.nombre}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                  {message && <div className="text-danger">{message}</div>}

                </div>

                <div className={styles["form-group-right"]}>
                  <label htmlFor="codcat">Categoría del Producto:</label>
                  <select
                    id="codcat"
                    name="codcat"
                    value={currentProducto.codcat}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.codcat} value={categoria.codcat}>
                        {categoria.nomcat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles["form-group"]}>
                <div className={styles["form-group-left"]}>
                  <label>Descripción:</label>
                  <textarea
                    name="prodes"
                    value={currentProducto.prodes}
                    onChange={handleInputChange}
                    className="form-control"
                  ></textarea>
                </div>

                <div className={styles["form-group-right"]}>
                  <label>Precio de Venta:</label>
                  <input
                    type="number"
                    name="precioventa"
                    value={currentProducto.precioventa}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className={styles["form-group"]}>
                <div className={styles["form-group-left"]}>
                  <label>Promoción (%):</label>
                  <input
                    type="number"
                    name="promocion"
                    value={currentProducto.promocion}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className={styles["form-group-right"]}>
                  <label>Stock Disponible:</label>
                  <input
                    type="number"
                    name="stockdisp"
                    value={currentProducto.stockdisp}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className={styles["form-group"]}>
                <div className={styles["form-group-left"]}>
                  <label>Estado:</label>
                  <input
                    type="checkbox"
                    name="estado"
                    checked={currentProducto.estado}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className={styles["form-group-right"]}>
                  <label>Imagen:</label>
                  <input
                    type="text"
                    name="imagen"
                    value={currentProducto.imagen}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Fecha</label>
                  <input
                    type="date"
                    name="fechaven"
                    value={currentProducto.fechaven}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className={styles["modal-footer"]}>
              <button type="submit" className="btn btn-primary">
                {currentProducto.codprov === 0 ? "Crear" : "Actualizar"}
              </button>
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

<div className={styles["table-scroll"]}>
  <table className="table table-striped">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Categoría</th>
        <th>Precio</th>
        <th>Promoción</th>
        <th>Stock</th>
        <th>Estado</th>
        <th>Imagen</th>
        <th>fechaven</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {productos.map(producto => (
        <tr key={producto.codprov}>
          <td>{producto.codprov}</td>
          <td>{producto.nombre}</td>
          <td>{getNombreCategoria(producto.codcat)}</td>
          <td>{producto.precioventa}</td>
          <td>{producto.promocion}</td>
          <td className={producto.stockdisp < 10 ? styles["low-stock"] : ""}>
            {producto.stockdisp}
          </td>
          <td>{producto.estado ? "Activo" : "Inactivo"}</td>
          <td>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className={styles["img-thumbnail"]}
            />
          </td>
          <td>{producto.fechaven}</td>
          <td>
            <div className="btn-group">
              <button onClick={() => abrirModalEditar(producto)} className={`btn btn-info ${styles["btn-action"]}`}>
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteProducto(producto.codprov)} className={`btn btn-danger ${styles["btn-action"]}`}>
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

export default ProductoVComponent;
