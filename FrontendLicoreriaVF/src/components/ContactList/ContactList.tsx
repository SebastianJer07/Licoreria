// components/ContactList.tsx
import React, { useEffect, useState } from 'react';
import ContactoService from '../../services/ContactoService';
import Contacto from '../../types/Contacto';
import styles from './ContactList.module.css';
import Modal from './Modal';

const ContactList: React.FC = () => {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTelefono, setSelectedTelefono] = useState<string>('');

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const response = await ContactoService.getAll(); // ID de ejemplo
        setContactos(response.data);
      } catch (error) {
        console.error('Error fetching contactos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactos();
  }, []);

  const handleWhatsAppClick = (telefono: string) => {
    setSelectedTelefono(telefono);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSendMessage = (message: string) => {
    const whatsappUrl = `https://wa.me/${selectedTelefono}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleCloseModal();
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Mensaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.codcon}>
                <td>{contacto.codcon}</td>
                <td>{contacto.correo}</td>
                <td>{contacto.telefono}</td>
                <td>{contacto.mensaje}</td>
                <td>
                  <button
                    className={styles.whatsappButton}
                    onClick={() => handleWhatsAppClick(contacto.telefono)}
                  >
                    <i className="fab fa-whatsapp"></i> {/* Font Awesome WhatsApp icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ContactList;
