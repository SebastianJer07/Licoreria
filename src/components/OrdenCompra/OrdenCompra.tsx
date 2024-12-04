import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './OrdenCompra.module.css';
import ProveedorService from '../../services/proveedor.services';
import ProductoVService from '../../services/productov.services';
import Proveedor from '../../types/proveedores';
import ProductosV from '../../types/productosV';

interface Product {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface OrderInfo {
  proveedor: string;
  autorizador: string;
  fechaEntrega: string;
  sede: string;
  observaciones: string;
  condicionPago: string;


}

const OrderComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    proveedor: '',
    autorizador: '',
    fechaEntrega: '',
    sede: "",
  observaciones: "",
  condicionPago: ""
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productosConStockBajo, setProductosConStockBajo] = useState<ProductosV[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderInfoModal, setShowOrderInfoModal] = useState(false);
  const [showExistingProductModal, setShowExistingProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    nombre: '',
    cantidad: 0,
    precio: 0
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductosV | null>(null);
  const [proveedorDetails, setProveedorDetails] = useState<Proveedor | null>(null);

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

  useEffect(() => {
    console.log(products); // Para ver los valores actuales en el estado
  }, [products]);
  

  useEffect(() => {
    const fetchProductosConStockBajo = async () => {
      try {
        const response = await ProductoVService.obtenerProductosConStockBajo();
        setProductosConStockBajo(response.data);
      } catch (error) {
        console.error('Error fetching productos con stock bajo', error);
      }
    };

    fetchProductosConStockBajo();
  }, []);

  const handleModalToggle = (modal: string) => {
    switch (modal) {
      case 'product':
        setShowProductModal(prev => !prev);
        break;
      case 'orderInfo':
        setShowOrderInfoModal(prev => !prev);
        break;
      case 'existingProduct':
        setShowExistingProductModal(prev => !prev);
        break;
      default:
        break;
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'precio' ? (value === '' ? '' : Number(value)) : value
    }));
  };
  
  const handleOrderInfoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({ ...prev, [name]: value }));
    
    // Verifica si el campo cambiado es 'proveedor'
    if (name === 'proveedor') {
      const proveedorId = Number(value);
      if (proveedorId) {
        handleProveedorSelect(proveedorId);
      } else {
        setProveedorDetails(null); // Resetea los detalles del proveedor si no se selecciona uno válido
      }
    }
  };
  

  const handleAddProduct = () => {
    if (!newProduct.nombre || !newProduct.cantidad || !newProduct.precio) {
      alert('Por favor, complete todos los campos del producto.');
      return;
    }
    setProducts(prev => [...prev, newProduct]);
    setNewProduct({ nombre: '', cantidad: 0, precio: 0 });
    handleModalToggle('product');
  };

  const handleAddExistingProduct = () => {
    if (!selectedProduct || !newProduct.cantidad || !newProduct.precio) {
      alert('Por favor, complete todos los campos del producto.');
      return;
    }
    const productToAdd: Product = {
      nombre: selectedProduct.nombre,
      cantidad: newProduct.cantidad,
      precio: newProduct.precio
    };
    setProducts(prev => [...prev, productToAdd]);
    setNewProduct({ nombre: '', cantidad: 0, precio: 0 });
    setSelectedProduct(null);
    handleModalToggle('existingProduct');
  };

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProduct = productosConStockBajo.find(p => p.codprov === Number(e.target.value)) || null;
    setSelectedProduct(selectedProduct);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleProveedorSelect = async (id: number) => {
    try {
      const response = await ProveedorService.getProveedorById(id);
      setProveedorDetails(response.data);
    } catch (error) {
      console.error('Error fetching proveedor details', error);
    }
  };
  
  
  const generatePDF = () => {
    if (!proveedorDetails) {
        alert('Selecciona un proveedor primero.');
        return;
    }

    const pdf = new jsPDF();

    // Agregar logotipo de la empresa (opcional)
    // Si tienes un archivo de imagen (base64 o en formato blob), puedes usar pdf.addImage()
    // pdf.addImage('data:image/png;base64,...', 'PNG', 20, 10, 50, 20);

    // Encabezado
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text('Orden de Compra', 20, 20);

    // Información de la empresa
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text('LICORERÍA LINCE S.A.C.', 20, 35);
    pdf.text('Dirección: Av. Las Flores 123, Local 4, Lima', 20, 45);
    pdf.text('Teléfono: (01) 123-4567', 20, 55);

    // Línea de separación
    pdf.setLineWidth(1.5);
    pdf.setDrawColor(0, 51, 102); // Color de la línea
    pdf.line(20, 60, 190, 60);

    // Datos del Pedido
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text('Datos del Pedido', 20, 75);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Autorizador: ${orderInfo.autorizador}`, 20, 85);
    pdf.text(`Sede: ${orderInfo.sede}`, 20, 95);
    pdf.text(`Condición de Pago: ${orderInfo.condicionPago}`, 20, 105);
    pdf.text(`Fecha de Entrega: ${orderInfo.fechaEntrega}`, 20, 115);
    pdf.text(`Observaciones: ${orderInfo.observaciones}`, 20, 125);

    // Título de Datos del Proveedor
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text('Datos del Proveedor', 20, 140);

    // Información del proveedor
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nombre del Proveedor: ${proveedorDetails.nomprove}`, 20, 155);
    pdf.text(`Teléfono: ${proveedorDetails.telprove}`, 20, 165);
    pdf.text(`Dirección: ${proveedorDetails.dirprove}`, 20, 175);
    pdf.text(`Correo: ${proveedorDetails.correoprove}`, 20, 185);

    // Línea de separación
    pdf.setLineWidth(1.5);
    pdf.setDrawColor(0, 51, 102); // Color de la línea
    pdf.line(20, 195, 190, 195);

    // Tabla de productos
    const headers = ['Nombre', 'Cantidad', 'Precio', 'Subtotal'];
    const data = products.map(p => [
        p.nombre,
        p.cantidad.toString(),
        p.precio ? p.precio.toFixed(2) : '0.00',
        (p.cantidad * (p.precio || 0)).toFixed(2)
    ]);

    autoTable(pdf, {
        head: [headers],
        body: data,
        startY: 200,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 51, 102], // Color de fondo del encabezado de la tabla
            textColor: [255, 255, 255], // Color del texto del encabezado
            fontSize: 10,
            halign: 'center',
            valign: 'middle',
        },
        styles: {
            fontSize: 8,
            cellPadding: 4,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.5,
            lineColor: [0, 51, 102], // Color de los bordes de las celdas
        },
        margin: { top: 10 },
        didDrawPage: (data) => {
            // Asegurar que el contenido no se pase de la página
            if ((pdf as any).lastAutoTable.finalY + 40 > pdf.internal.pageSize.height) {
                pdf.addPage();
            }
        }
    });

    // Total
    const total = products.reduce((acc, cur) => acc + (cur.cantidad * cur.precio), 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Total: S/. ${total.toFixed(2)}`, 20, (pdf as any).lastAutoTable.finalY + 10);

    // Mensaje de agradecimiento
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text('Gracias por su compra. Esperamos verle pronto.', 20, (pdf as any).lastAutoTable.finalY + 20);

    // Información de contacto de la empresa (opcional)
    pdf.text('Para consultas, por favor contáctenos al (01) 123-4567 o correo: contacto@licorerialince.com', 20, (pdf as any).lastAutoTable.finalY + 30);

    // Guardar el archivo PDF
    pdf.save('orden_de_compra.pdf');
}



return (
  <div className={styles.orderContainer}>
    <div className={styles.sidebar}>
    <button className="btn btn-secondary" onClick={() => handleModalToggle('product')}>
          <i className="fas fa-box"></i>
        </button>
        <button className="btn btn-secondary" onClick={() => handleModalToggle('existingProduct')}>
          <i className="fas fa-box-open"></i>
        </button>
        <button className="btn btn-primary" onClick={() => handleModalToggle('orderInfo')}>
          <i className="fas fa-info-circle"></i>
        </button>
        <button className="btn btn-success" onClick={generatePDF}>
          <i className="fas fa-file-pdf"></i>
        </button>
    </div>

    <div className={styles.content}>
      {/* Modal para información del pedido */}
      {showOrderInfoModal && (
        <div className={`modal fade ${showOrderInfoModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showOrderInfoModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información del Pedido</h5>
                <button type="button" className="btn-close" onClick={() => handleModalToggle('orderInfo')}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="proveedor" className="form-label">Proveedor</label>
                    <select
                      id="proveedor"
                      name="proveedor"
                      className="form-select"
                      value={orderInfo.proveedor}
                      onChange={handleOrderInfoInputChange}
                    >
                      <option value="">Selecciona un proveedor</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor.codprove} value={proveedor.codprove}>{proveedor.nomprove}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="autorizador" className="form-label">Autorizador</label>
                    <input
                      type="text"
                      id="autorizador"
                      name="autorizador"
                      className="form-control"
                      value={orderInfo.autorizador}
                      onChange={handleOrderInfoInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fechaEntrega" className="form-label">Fecha de Entrega</label>
                    <input
                      type="date"
                      id="fechaEntrega"
                      name="fechaEntrega"
                      className="form-control"
                      value={orderInfo.fechaEntrega}
                      onChange={handleOrderInfoInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Sede" className="form-label">Sede</label>
                    <select
                      className="form-select"
                      name="sede"
                      value={orderInfo.sede}
                      onChange={handleOrderInfoInputChange}
                    >
                      <option value="">Selecciona una sede</option>
                      <option value="tienda Lince">Tienda Lince</option>
                      <option value="tienda La Victoria">Tienda La Victoria</option>
                      <option value="tienda CentroLima">Tienda Centro de Lima</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      className="form-control"
                      value={orderInfo.observaciones}
                      onChange={handleOrderInfoInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="condicionPago" className="form-label">Condición de Pago</label>
                    <input
                      type="text"
                      id="condicionPago"
                      name="condicionPago"
                      className="form-control"
                      value={orderInfo.condicionPago}
                      onChange={handleOrderInfoInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => handleModalToggle('orderInfo')}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar un producto */}
      {showProductModal && (
        <div className={`modal fade ${showProductModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showProductModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Producto</h5>
                <button type="button" className="btn-close" onClick={() => handleModalToggle('product')}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="form-control"
                      value={newProduct.nombre}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      className="form-control"
                      value={newProduct.cantidad}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      className="form-control"
                      value={newProduct.precio}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Agregar Producto</button>
                  <button type="button" className="btn btn-secondary" onClick={() => handleModalToggle('product')}>Cerrar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar un producto existente */}
      {showExistingProductModal && (
        <div className={`modal fade ${showExistingProductModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showExistingProductModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Producto Existente</h5>
                <button type="button" className="btn-close" onClick={() => handleModalToggle('existingProduct')}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="productSelect" className="form-label">Seleccionar Producto</label>
                    <select
                      id="productSelect"
                      className="form-select"
                      onChange={handleSelectProduct}
                    >
                      <option value="">Selecciona un producto</option>
                      {productosConStockBajo.map(producto => (
                        <option key={producto.codprov} value={producto.codprov}>{producto.nombre}</option>
                      ))}
                    </select>
                  </div>
                  {selectedProduct && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="cantidad" className="form-label">Cantidad</label>
                        <input
                          type="number"
                          id="cantidad"
                          name="cantidad"
                          className="form-control"
                          value={newProduct.cantidad}
                          onChange={handleProductInputChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="precio" className="form-label">Precio</label>
                        <input
                          type="number"
                          id="precio"
                          name="precio"
                          className="form-control"
                          value={newProduct.precio}
                          onChange={handleProductInputChange}
                        />
                      </div>
                      <button type="button" className="btn btn-primary" onClick={handleAddExistingProduct}>Agregar Producto</button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleModalToggle('existingProduct')}>Cerrar</button>

                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className={styles.tableContainer}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.nombre}</td>
                <td>{product.cantidad}</td>
                <td>{product.precio}</td>
                <td>{(product.cantidad * (product.precio || 0)).toFixed(2)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleRemoveProduct(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default OrderComponent;
