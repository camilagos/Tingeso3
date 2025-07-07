import httpClient from "../http-common";

// Reporte de ingresos por número de vueltas o tiempo
const getIncomeFromLapsOrTime = (startDate, endDate) => {
  return httpClient.get("/reporte/porTiempo", {
    params: {
      startDate,
      endDate,
    },
  });
};

// Reporte de ingresos por cantidad de personas
const getIncomePerPerson = (startDate, endDate) => {
  return httpClient.get("/reporte/porCantPersonas", {
    params: {
      startDate,
      endDate,
    },
  });
};

export default {
  getIncomeFromLapsOrTime,
  getIncomePerPerson,
};
