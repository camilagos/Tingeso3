import httpClient from "../http-common";

// Obtener el rack semanal con todas las reservas
const getAll = () => {
  return httpClient.get("/rack/");
};

export default {
  getAll,
};
