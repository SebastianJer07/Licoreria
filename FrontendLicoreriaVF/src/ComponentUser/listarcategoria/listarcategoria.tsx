import React, { useState, useEffect } from 'react';
import CategoriaService from '../../services/categoria.service';
import Categoria from '../../types/categorias';
import styles from './ListarCategorias.module.css';

interface Props {
  onCategoriaChange: (categoriaId: number) => void;
}

const ListarCategorias: React.FC<Props> = ({ onCategoriaChange }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CategoriaService.getAll()
      .then(response => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error al obtener categorías: ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAllCategories = () => {
    onCategoriaChange(0);
  };

  return (
    <div className={styles.categoriasContainer}>
      <h1 className={styles.h1}>Categorías</h1>
      <div className={styles.listaCategorias}>
        <div className={styles.categoriaItem} onClick={handleAllCategories}>
          <i className={`fas fa-th-list ${styles.categoriaIcono}`}></i>
          <span className={styles.categoriaNombre}>Todos</span>
        </div>
        {categorias.map(categoria => (
          <div key={categoria.codcat} className={styles.categoriaItem} onClick={() => onCategoriaChange(categoria.codcat)}>
            <i className={`fas fa-wine-glass-alt ${styles.categoriaIcono}`}></i>
            <span className={styles.categoriaNombre}>{categoria.nomcat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarCategorias;
