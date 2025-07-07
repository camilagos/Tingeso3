import httpClient from "../http-common";

// Guardar un nuevo descuento por grupo
const save = (data) => {
  return httpClient.post("/descuentoGrupo", data);
};

// Obtener todos los descuentos por grupo
const getAll = () => {
  return httpClient.get("/descuentoGrupo");
};

// Actualizar un descuento por ID
const update = (id, data) => {
  return httpClient.put(`/descuentoGrupo/${id}`, data);
};

// Eliminar un descuento por ID
const remove = (id) => {
  return httpClient.delete(`/descuentoGrupo/${id}`);
};

// Calcular descuento según cantidad de personas
const calcularDescuento = (cantPersonas) => {
  return httpClient.get(`/descuentoGrupo/calcular/${cantPersonas}`);
};

export default {
  save,
  getAll,
  update,
  remove,
  calcularDescuento,
};
