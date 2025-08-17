import React, { useState } from 'react';
import ProductoVService from '../../services/productov.services';
import ProductosV from '../../types/productosV';
import { Alert, Form, ListGroup, Button, Spinner } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './buscador.css'; // Importar el CSS actualizado

interface BuscadorComponentProps {
  onBusqueda: (productos: ProductosV[]) => void; // Callback prop
}

const BuscadorComponent: React.FC<BuscadorComponentProps> = ({ onBusqueda }) => {
  const [nombre, setNombre] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false); // Nuevo estado para mostrar mensaje de sin resultados

  const buscarProductos = async () => {
    setLoading(true);
    setError(null);
    setNoResults(false); // Resetear estado de no resultados
    try {
      const response = await ProductoVService.findByName(nombre);
      if (response.data.length === 0) {
        setNoResults(true);
      } else {
        onBusqueda(response.data); // Pasar productos al componente padre
      }
    } catch (error) {
      setError("No se pudo realizar la búsqueda. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscador">
      <Form onSubmit={(e) => { e.preventDefault(); buscarProductos(); }} className="d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder="Ingresa el nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="me-2 search-input"
        />
        <Button variant="link" type="submit" disabled={loading} className="search-icon">
          {loading ? <Spinner animation="border" size="sm" /> : <i className="fas fa-search"></i>}
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {noResults && !loading && <Alert variant="info" className="mt-3">No se encontraron productos.</Alert>}
    </div>
  );
};

export default BuscadorComponent;
