import httpClient from "../http-common";

// Crear nueva tarifa especial
const save = (data) => {
  return httpClient.post("/tarifaEspecial", data);
};

// Obtener todas las tarifas especiales
const getAll = () => {
  return httpClient.get("/tarifaEspecial");
};

// Actualizar una tarifa especial (asegúrate de pasar el ID dentro del cuerpo o como parte del endpoint si lo corriges)
const update = (id, data) => {
  return httpClient.put(`/tarifaEspecial/${id}`, data);
};

// Eliminar una tarifa especial
const remove = (id) => {
  return httpClient.delete(`/tarifaEspecial/${id}`);
};

export default {
  save,
  getAll,
  update,
  remove,
};
