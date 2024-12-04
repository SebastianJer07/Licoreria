export default interface ProductosV {
    codprov: number;
    nombre: string;
    prodes: string;
    codcat?: number;
    precioventa: number;
    stockdisp: number;
    promocion: number;
    estado: boolean;
    imagen: string;
    fechaven: string;
}