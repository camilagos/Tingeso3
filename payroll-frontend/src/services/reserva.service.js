import httpClient from "../http-common";

const save = (data) => {
  return httpClient.post("/reserva/", data);
};

const getAll = () => {
  return httpClient.get("/reserva/all");
};

const removeByDate = (fechaReserva) => {
  return httpClient.delete(`/reserva/${fechaReserva}`);
};

export default {
  save,
  getAll,
  removeByDate,
};
