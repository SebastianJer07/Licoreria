export default interface factura {
    codfact: number;
    codprove: number;
    fecha: string;
    numfact: number;
    archivopdf: Blob | null; // Puedes usar 'Blob' para manejar archivos binarios en TypeScript.
  }
  