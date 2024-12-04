import React from 'react';
import './CompraNavbar.css';  // Importa el archivo de estilos CSS para personalizar CompraNavbar

interface CompraNavbarProps {
  pasoActual: number;
}

const CompraNavbar: React.FC<CompraNavbarProps> = ({ pasoActual }) => {

  return (
    <div className="compra-navbar">
      <div className="pasos-container">
        <div className={pasoActual === 1 ? 'paso-activo paso' : 'paso'}>
          <span className="paso-numero">1</span>
          <span className="paso-nombre">Detalle</span>
        </div>
        <div className={pasoActual === 2 ? 'paso-activo paso' : 'paso'}>
          <span className="paso-numero">2</span>
          <span className="paso-nombre">Pedido</span>
        </div>
        <div className={pasoActual === 3 ? 'paso-activo paso' : 'paso'}>
          <span className="paso-numero">3</span>
          <span className="paso-nombre">Pago</span>
        </div>
      </div>
    </div>
  );
};

export default CompraNavbar;
