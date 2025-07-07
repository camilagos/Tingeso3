import httpClient from "../http-common";

// Crear un nuevo kart
const save = (data) => {
  return httpClient.post("/kart/save", data);
};

// Obtener karts por disponibilidad (true o false)
const getByDisponibilidad = (disponible) => {
  return httpClient.get(`/kart/disponible/${disponible}`);
};

// Actualizar un kart existente
const update = (data) => {
  return httpClient.put("/kart/update", data);
};

// Eliminar un kart por ID
const remove = (id) => {
  return httpClient.delete(`/kart/delete/${id}`);
};

export default {
  save,
  getByDisponibilidad,
  update,
  remove,
};
