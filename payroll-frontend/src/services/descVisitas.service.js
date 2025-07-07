import httpClient from "../http-common";

// Crear nuevo descuento por visitas
const save = (data) => {
  return httpClient.post("/descuentoVisitas", data);
};

// Obtener todos los descuentos por visitas
const getAll = () => {
  return httpClient.get("/descuentoVisitas");
};

// Actualizar un descuento por ID
const update = (id, data) => {
  return httpClient.put(`/descuentoVisitas/${id}`, data);
};

// Eliminar un descuento por ID
const remove = (id) => {
  return httpClient.delete(`/descuentoVisitas/${id}`);
};

// Calcular descuento por visitas según RUT y fecha
const calcularDescuento = (rut, fechaReserva) => {
  return httpClient.get(`/descuentoVisitas/calcular/${rut}/${encodeURIComponent(fechaReserva)}`);
};

export default {
  save,
  getAll,
  update,
  remove,
  calcularDescuento,
};
