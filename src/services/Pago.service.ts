import http from "../http-common";

const PagoService = {
  createPago: (pago: any) => {
    return http.post("/pagos", pago);
  },
};

export default PagoService;