import httpClient from "../http-common";

// Guardar nueva tarifa
const save = (data) => {
  return httpClient.post("/tarifa", data);
};

// Obtener todas las tarifas
const getAll = () => {
  return httpClient.get("/tarifa");
};

// Actualizar una tarifa existente
const update = (id, data) => {
  return httpClient.put(`/tarifa/${id}`, data);
};

// Eliminar una tarifa por ID
const remove = (id) => {
  return httpClient.delete(`/tarifa/${id}`);
};

// Obtener valor de tarifa según vueltas o minutos
const calcularTarifa = (tiempoVueltas) => {
  return httpClient.get(`/tarifa/calcular/${tiempoVueltas}`);
};

// Obtener duración total de la reserva según vueltas o minutos
const obtenerTiempoReserva = (tiempoVueltas) => {
  return httpClient.get(`/tarifa/tiempo/${tiempoVueltas}`);
};

export default {
  save,
  getAll,
  update,
  remove,
  calcularTarifa,
  obtenerTiempoReserva,
};
