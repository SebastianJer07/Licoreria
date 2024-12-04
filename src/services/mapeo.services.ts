import { useEffect, useState } from 'react';
import axios from 'axios';
import Categorias from '../types/categorias'; // Importar las interfaces definidas
import  Proveedores from '../types/proveedores';

const apiUrl = 'http://localhost:8060/api';

const MapService = () => {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [proveedores, setProveedores] = useState<Proveedores[]>([]);

  useEffect(() => {
    obtenerNombresCategorias();
    obtenerNombresProveedores();
  }, []);

  const obtenerNombresCategorias = () => {
    axios.get<Categorias[]>(`${apiUrl}/categorias`)
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });
  };

  const obtenerNombresProveedores = () => {
    axios.get<Proveedores[]>(`${apiUrl}/proveedores`)
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error('Error al obtener proveedores:', error);
      });
  };

  return {
    categorias,
    proveedores,
    obtenerNombresCategorias,
    obtenerNombresProveedores
  };
};

export default MapService;
