import { useState } from "react";
import {
  Box, TextField, Button, Typography,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Snackbar, Alert
} from "@mui/material";
import reporteService from "../services/reporte.service";

const ReportByLapsOrTime = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setSnackbar({
        open: true,
        message: "Debes ingresar ambas fechas.",
        severity: "warning"
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setSnackbar({
        open: true,
        message: "La fecha de inicio no puede ser posterior a la fecha de fin.",
        severity: "warning"
      });
      return;
    }

    try {
      const res = await reporteService.getIncomeFromLapsOrTime(startDate, endDate);
      setData(res.data);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al obtener el reporte. Intenta nuevamente más tarde.",
        severity: "error"
      });
    }
  };

  const columnas = data ? Object.keys(data[Object.keys(data)[0]] || {}) : [];

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Reporte de Ingresos por Número de Vueltas o Tiempo Máximo
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Selecciona un rango de fechas para visualizar los ingresos agrupados por cantidad de vueltas o tiempo máximo, organizados por mes y año.
      </Typography>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <TextField
          label="Fecha Inicio"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <TextField
          label="Fecha Fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Generar Reporte
        </Button>
      </form>

      {data && Object.keys(data).length > 0 ? (
        <Paper sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Tipo</strong></TableCell>
                {columnas.map((col) => (
                  <TableCell key={col} align="right" scope="col"><strong>{col}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data).map(([tipo, valores]) => (
                <TableRow key={tipo}>
                  <TableCell component="th" scope="row">{tipo}</TableCell>
                  {columnas.map((col) => (
                    <TableCell key={col} align="right">
                      {valores[col]
                        ? valores[col].toLocaleString("es-CL", { style: "currency", currency: "CLP" })
                        : "$0"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : data && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            No se encontraron resultados para el rango seleccionado.
          </Alert>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Intenta ampliar el rango de fechas o verifica si hubo reservas en ese periodo.
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportByLapsOrTime;
