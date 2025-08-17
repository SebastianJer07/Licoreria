export enum EstadoPedido {
    Pendiente = "Pendiente",
    Procesando = "Procesando",
    Enviado = "Enviado",
    Entregado = "Entregado",
    Cancelado = "Cancelado"
}

export default interface Pedido {
    codpedido?: number;
    coduser?: number;
    fechaped: string;
    tipoent: string;
    estado: EstadoPedido;
    total: number;
    subtotal: number;
}