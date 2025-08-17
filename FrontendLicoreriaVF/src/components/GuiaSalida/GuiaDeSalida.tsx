import React, { useState, useEffect } from 'react';
import ProductoVService from '../../services/productov.services';
import ProductosV from '../../types/productosV';
import styles from './GuiaDeSalida.module.css'; // Importar el CSS Module

const GuiaDeSalida: React.FC = () => {
  const [productosVencidos, setProductosVencidos] = useState<ProductosV[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined);

  const [showModal, setShowModal] = useState(false);
  const [nombreResponsable, setNombreResponsable] = useState('');
  const [cargoResponsable, setCargoResponsable] = useState('');
  const [telefonoResponsable, setTelefonoResponsable] = useState('');
  const [correoResponsable, setCorreoResponsable] = useState('');
  const [numeroGuia, setNumeroGuia] = useState('');
  const [fechaSalida, setFechaSalida] = useState<string>(new Date().toISOString().split('T')[0]); // Inicializar con la fecha actual
  const [productos, setProductos] = useState<ProductosV[]>([]); // Estado para productos normales
  const [motivoSalida, setMotivoSalida] = useState<string>('vencido');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        if (motivoSalida === 'vencido') {
          const response = await ProductoVService.listarProductosVencidos();
          setProductosVencidos(response.data);
        } else {
          const response = await ProductoVService.getAll();
          setProductos(response.data);
        }
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };
  
    fetchProductos();
  }, [motivoSalida]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number(event.target.value);
    setSelectedProduct(productId);
  };

  const handleAddProduct = () => {
    if (selectedProduct && !productosSeleccionados.includes(selectedProduct)) {
      setProductosSeleccionados([...productosSeleccionados, selectedProduct]);
      setSelectedProduct(undefined);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      await ProductoVService.generarGuiaDeSalida(
        nombreResponsable,
        cargoResponsable,
        telefonoResponsable,
        correoResponsable,
        numeroGuia,
        fechaSalida,
        motivoSalida,
        productosSeleccionados
      );

      // Eliminar los productos después de generar el PDF
      for (const id of productosSeleccionados) {
        await ProductoVService.remove(id);
      }
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Generar Guía de Salida</h1>
      <button className={styles.button} onClick={() => setShowModal(true)}>
        Ingresar Información
      </button>

      {/* Modal */}
      <div className={styles.modal} style={{ display: showModal ? 'block' : 'none' }}>
        <div className={styles['modal-content']}>
          <span className={styles.close} onClick={() => setShowModal(false)}>
            &times;
          </span>
          <h2>Información del Responsable</h2>
          <form>
            <div>
              <label>Nombre </label>
              <input
                type="text"
                placeholder="Ingrese el nombre del responsable"
                value={nombreResponsable}
                onChange={(e) => setNombreResponsable(e.target.value)}
              />
            </div>
            <div>
              <label>Cargo</label>
              <input
                type="text"
                placeholder="Ingrese el cargo del responsable"
                value={cargoResponsable}
                onChange={(e) => setCargoResponsable(e.target.value)}
              />
            </div>
            <div>
              <label>Teléfono</label>
              <input
                type="text"
                placeholder="Ingrese el teléfono del responsable"
                value={telefonoResponsable}
                onChange={(e) => setTelefonoResponsable(e.target.value)}
              />
            </div>
            <div>
              <label>Correo</label>
              <input
                type="email"
                placeholder="Ingrese el correo electrónico del responsable"
                value={correoResponsable}
                onChange={(e) => setCorreoResponsable(e.target.value)}
              />
            </div>
            <div>
              <label>Número de Guía</label>
              <input
                type="text"
                placeholder="Ingrese el número de guía"
                value={numeroGuia}
                onChange={(e) => setNumeroGuia(e.target.value)}
              />
            </div>
            <div>
              <label>Fecha de Salida</label>
              <input
                type="date"
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
              />
            </div>
          </form>
          <div className={styles['modal-footer']}>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      </div>


      <div>
        <label htmlFor="motivoSalida">Motivo de la Salida:</label>
        <select
          id="motivoSalida"
          value={motivoSalida}
          onChange={(e) => setMotivoSalida(e.target.value)}
        >
          <option value="vencido">Vencido</option>
          <option value="dañado">Dañado</option>
          <option value="retiro mercado">Retiro del Mercado</option>
          <option value="exhibicion">Exhibición</option>
        </select>
      </div>


        <div>
          <label htmlFor="productos">Seleccionar Producto:</label>
          <select
            id="productos"
            value={selectedProduct || ''}
            onChange={handleSelectChange}
          >
            <option value="">Seleccionar...</option>
            {(motivoSalida === 'vencido' ? productosVencidos : productos).map((producto) => (
              <option key={producto.codprov} value={producto.codprov}>
                {producto.nombre} - {producto.precioventa} - {producto.stockdisp}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddProduct}>
            Agregar
          </button>
    </div>
      <div>
      <h2>Productos Seleccionados:</h2>
        <ul className={styles['product-list']}>
          {motivoSalida === 'vencido'
            ? productosVencidos
                .filter((producto) => productosSeleccionados.includes(producto.codprov))
                .map((producto) => (
                  <li key={producto.codprov}>
                    {producto.nombre} - {producto.precioventa} - {producto.stockdisp}
                  </li>
                ))
            : productos
                .filter((producto) => productosSeleccionados.includes(producto.codprov))
                .map((producto) => (
                  <li key={producto.codprov}>
                    {producto.nombre} - {producto.precioventa} - {producto.stockdisp}
                  </li>
                ))}
        </ul>
      </div>
      <button className={styles.button} onClick={handleGeneratePdf}>
        Generar PDF
      </button>
    </div>
  );
};

export default GuiaDeSalida;
