import axios from 'axios';
import authHeader from './auth-header';
import Order from '../types/Order';

// URL del API
const API_URL = 'http://localhost:8080/api/ordenescompra';
const EMAIL_API_URL = 'http://localhost:8080/send-email'; // Asegúrate de que esta URL coincida con la de tu backend

export const getOrders = async (): Promise<Order[]> => {
    const response = await axios.get(API_URL, { headers: authHeader() });
    return response.data;
}

export const createOrder = async (order: Order): Promise<Order> => {
    const response = await axios.post(API_URL, order, { headers: authHeader() });
    return response.data;
}

// Obtener órdenes de compra por codprove
export const getOrdersByCodprove = async (codprove: number): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/buscar`, {
        params: { codprove },
        headers: authHeader()
    });
    return response.data;
}




