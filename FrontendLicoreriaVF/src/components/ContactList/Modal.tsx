// components/Modal.tsx
import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSend }) => {
  const [message, setMessage] = React.useState<string>('');

  if (!isOpen) return null;

  const handleSend = () => {
    onSend(message);
    setMessage(''); // Clear the message after sending
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Enviar Mensaje por WhatsApp</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className={styles.textarea}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Modal;
