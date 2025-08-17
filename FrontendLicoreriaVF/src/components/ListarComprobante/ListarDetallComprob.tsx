import React, { useEffect, useState } from 'react';
import DetalleCompService from '../../services/detallecomp.service';
import UserService from '../../services/usuario.services';
import DetalleComp from '../../types/DetalleComp';
import IUser from '../../types/user.type';
import './listarDetallComprob.css';

const ListarDetallComprob: React.FC = () => {
    const [detalles, setDetalles] = useState<DetalleComp[]>([]);
    const [usuarios, setUsuarios] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener detalles de comprobantes
                const detallesResponse = await DetalleCompService.obtenerTodosLosDetalles();
                setDetalles(detallesResponse.data);

                // Obtener usuarios
                const usuariosResponse = await UserService.getAll();
                setUsuarios(usuariosResponse.data);
            } catch (error) {
                setError('Error al obtener los detalles o usuarios.');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para obtener el nombre del usuario por su código
    const getUsuarioNombre = (coduser: number): string => {
        const usuario = usuarios.find(user => user.id === coduser);
        return usuario ? usuario.username : 'Desconocido';
    };

    return (
        <div className="detalles-container">
            <h1>Detalles de Comprobantes</h1>
            {loading ? (
                <div className="loading">Cargando...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="detalles-table-container">
                    <table className="detalles-table">
                        <thead>
                            <tr>
                                <th>Código Detalle</th>
                                <th>Código Comprobante</th>
                                <th>Nombre Usuario</th>
                                <th>Nombre Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalles.map((detalle) => (
                                <tr key={detalle.codcompd}>
                                    <td>{detalle.codcompd}</td>
                                    <td>{detalle.codcomp}</td>
                                    <td>{getUsuarioNombre(detalle.coduser)}</td>
                                    <td>{detalle.nompro}</td>
                                    <td>{detalle.cantidad}</td>
                                    <td>{detalle.preciouni.toFixed(2)}</td>
                                    <td>{detalle.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ListarDetallComprob;
