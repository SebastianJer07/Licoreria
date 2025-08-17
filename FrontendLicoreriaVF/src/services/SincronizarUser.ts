import axios from 'axios';

const SincronizarService = {
    async sincronizarCarritoConServidor(userId: number) {
    const carritoStr = localStorage.getItem('carrito');
    const carrito = carritoStr ? JSON.parse(carritoStr) : [];
    
    
    try {
      const response = await axios.post('/api/sincronizarCarrito', {
        userId,
        carrito
      });

      if (response.status === 200) {
        localStorage.removeItem('carrito');
      }
    } catch (error) {
      console.error('Error al sincronizar el carrito:', error);
      throw new Error('Error al sincronizar el carrito con el servidor');
    }
  },
};

export default SincronizarService;
