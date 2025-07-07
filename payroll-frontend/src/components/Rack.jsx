import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import rackService from "../services/rack.service";
import reservaService from "../services/reserva.service";
import {
  Box, Typography, Card, CardContent, Divider, Button,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


// Localización
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const clienteColorMap = {};
const generateColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const Rack = () => {
  const [events, setEvents] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const fetchData = async () => {
    try {
      const res = await rackService.getAll();
      const mapped = res.data.map((r) => ({
        title: r.title,
        start: new Date(r.start),
        end: new Date(r.end),
      }));
      setEvents(mapped);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error al cargar el rack semanal.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const eventStyleGetter = (event) => {
    const cliente = event.title;
    if (!clienteColorMap[cliente]) {
      clienteColorMap[cliente] = generateColorFromName(cliente);
    }
    return {
      style: {
        backgroundColor: clienteColorMap[cliente],
        color: "white",
        borderRadius: "8px",
        padding: "4px",
        fontWeight: 500,
        fontSize: "0.9rem",
        whiteSpace: "normal",
        textAlign: "center",
        lineHeight: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    };
  };

  const onSelectEvent = (event) => {
    setEventoSeleccionado(event);
  };

  const cancelarReserva = async () => {
    if (!eventoSeleccionado) return;
    setLoadingCancel(true);

    try {
      const date = eventoSeleccionado.start;
      const formattedDate = [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0')
      ].join('-') + 'T' + [
        date.getHours().toString().padStart(2, '0'),
        date.getMinutes().toString().padStart(2, '0'),
        date.getSeconds().toString().padStart(2, '0')
      ].join(':');

      await reservaService.removeByDate(encodeURIComponent(formattedDate));
      setSnackbar({
        open: true,
        message: "Reserva cancelada exitosamente.",
        severity: "success"
      });

      await fetchData();
      setEventoSeleccionado(null);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al cancelar la reserva.",
        severity: "error"
      });
    } finally {
      setLoadingCancel(false);
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Rack Semanal de Ocupación
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Haz clic sobre una reserva para ver los detalles o cancelarla.
      </Typography>


      <div style={{ height: "75vh" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["week"]}
          style={{ height: "100%" }}
          step={15}
          timeslots={2}
          min={new Date(new Date().setHours(10, 0, 0))}
          max={new Date(new Date().setHours(22, 0, 0))}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onSelectEvent}
          culture="es"
          messages={{
            week: "Semana",
            day: "Día",
            month: "Mes",
            today: "Hoy",
            previous: "Anterior",
            next: "Siguiente",
            noEventsInRange: "Sin reservas en este rango",
          }}
        />
      </div>

      {eventoSeleccionado && (
        <Card sx={{ mt: 3, backgroundColor: "#E3F2FD", borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              Detalles de la Reserva
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><strong>Cliente:</strong> {eventoSeleccionado.title}</Typography>
            <Typography><strong>Inicio:</strong> {eventoSeleccionado.start.toLocaleString("es-CL")}</Typography>
            <Typography><strong>Término:</strong> {eventoSeleccionado.end.toLocaleString("es-CL")}</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={() => setEventoSeleccionado(null)}>
                Cerrar
              </Button>
              <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
                Cancelar Reserva
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={openDialog} onClose={() => !loadingCancel && setOpenDialog(false)}>
        <DialogTitle>Cancelar Reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loadingCancel}>
            No
          </Button>
          <Button
            color="error"
            onClick={cancelarReserva}
            disabled={loadingCancel}
            startIcon={loadingCancel ? <CircularProgress size={18} color="inherit" /> : null}
          >
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default Rack;
