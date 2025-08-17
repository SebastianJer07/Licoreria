export default interface Order {
    idorden: number;
    codprove: number;
    productos: string;
    fechaCreacion: string;
    fechaEntrega?: string;
    autorizador: string;
    cantidad: number;
    preciocompra: number;
}