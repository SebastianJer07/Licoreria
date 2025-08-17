import React, { useState } from 'react';
import Contacto from '../../types/Contacto';
import ContactoService from '../../services/ContactoService';
import styles from './CrearContacto.module.css'; // Importar el archivo de estilos con CSS Modules

const CrearContacto: React.FC = () => {
  const [contacto, setContacto] = useState<Contacto>({
    codcon: 0,
    nomape: '',
    correo: '',
    telefono: '',
    mensaje: '',
  });
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContacto({
      ...contacto,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ContactoService.create(contacto);
      setMensajeExito('Contacto creado exitosamente.');
      setContacto({
        codcon: 0,
        nomape: '',
        correo: '',
        telefono: '',
        mensaje: '',
      });
      setMensajeError(null);
    } catch (error) {
      setMensajeError('Error al crear el contacto. Intenta de nuevo.');
      setMensajeExito(null);
    }
  };

  return (
    <div className={styles.crearContactoContainer}>
      <div className={styles.imageSection}>
        <img src="https://gestion.pe/resizer/Dds3dNHYbExvU02URqNAh2fd2DQ=/1200x900/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/TUXGSKTFVREP7ETJ2UCXHYV4DA.jpg" alt="Licorería" />
      </div>
      <div className={styles.formSection}>
        <h2 className={styles.titulo}>Contacto</h2>
        {mensajeError && <div className={`${styles.alert} ${styles.alertError}`}>{mensajeError}</div>}
        {mensajeExito && <div className={`${styles.alert} ${styles.alertSuccess}`}>{mensajeExito}</div>}
        <form className={styles.contactoForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nomape">Nombre y Apellido</label>
            <input
              type="text"
              id="nomape"
              name="nomape"
              value={contacto.nomape}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={contacto.correo}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={contacto.telefono}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={3}
              value={contacto.mensaje}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <button type="submit" className={styles.submitButton}>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default CrearContacto;
