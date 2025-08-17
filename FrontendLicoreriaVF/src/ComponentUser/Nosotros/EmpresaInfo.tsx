import React from 'react';
import styles from './EmpresaInfo.module.css';

const EmpresaInfo: React.FC = () => {
  return (
    <section className={styles.empresaInfo}>
      <h1 className={styles.title}>Sobre Nosotros</h1>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img src="https://neetwork.com/wp-content/uploads/2018/06/objetivo-400x300.png" alt="Misión" className={styles.cardImage} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.cardTitle}>Misión</h2>
            <p className={styles.cardText}>
              Ofrecemos un servicio competitivo y confiable mediante la distribución eficaz de marcas de calidad, priorizando la mejor relación precio-valor. Nos centramos en una amplia selección de licores de alta calidad y excelencia operativa. Creamos un ambiente laboral positivo y promovemos el desarrollo profesional de nuestros empleados. Establecemos relaciones sólidas con proveedores para asegurar un flujo constante de productos. Innovamos para adaptarnos al mercado y contribuimos al desarrollo sostenible con prácticas éticas. Buscamos liderar el mercado de licores, destacándonos por calidad, confiabilidad y compromiso.
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img src="https://img.freepik.com/vector-premium/direccion-vision-empresarial_118813-1989.jpg" alt="Visión" className={styles.cardImage} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.cardTitle}>Visión</h2>
            <p className={styles.cardText}>
              Nuestra visión es liderar en Lima la distribución y venta de licores de alta calidad, siendo reconocidos por nuestra excelencia y satisfacción del cliente. Queremos establecer relaciones duraderas, garantizar la disponibilidad de los mejores licores, expandir nuestra presencia regional y ser un referente en la industria, innovando y promoviendo prácticas sostenibles.
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqjxXpTWqNPq7pj5vl0zhv-9G7gCxmZwretA&s" alt="Descripción" className={styles.cardImage} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.cardTitle}>Descripción</h2>
            <p className={styles.cardText}>
              Es una licorería en Cercado de Lima, en Av. Precursore 394. Desde 2014, ofrece productos alcohólicos de alta calidad a precios accesibles, ganando una base de clientes leales y una sólida reputación por su disponibilidad constante y satisfacción del cliente, siendo un referente confiable para consumidores y hostelería en la ciudad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpresaInfo;
