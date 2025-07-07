import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reservaService from "../services/reserva.service";
import tarifaService from "../services/tarifa.service";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
  Link
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const formatearRut = (rutInput) => {
  let rut = rutInput.replace(/[^0-9kK]/g, "").toUpperCase();
  if (rut.length < 2) return rut;
  let cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1);
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpo}-${dv}`;
};

const AddReservation = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.admin || false;

  const [form, setForm] = useState({
    rutUsuario: !isAdmin ? formatearRut(user?.rut || "") : "",
    fechaReserva: "",
    vueltasTiempo: "",
    cantPersonas: 1,
  });

  const [rutsAdicionales, setRutsAdicionales] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const res = await tarifaService.getAll();
        setTarifas(res.data || []);
      } catch (err) {
        console.error("Error al cargar tarifas:", err);
        setSnackbar({
          open: true,
          message: "No se pudieron cargar las tarifas.",
          severity: "error",
        });
      }
    };

    fetchTarifas();
  }, []);

  useEffect(() => {
  setRutsAdicionales((prev) => {
    const cantidad = form.cantPersonas;
    const nuevos = Array.from({ length: Math.max(cantidad - 1, 0) }, (_, i) => prev[i] || "");
    return nuevos;
  });
}, [form.cantPersonas]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "rutUsuario") {
      newValue = formatearRut(newValue);
    }

    if (name === "cantPersonas" || name === "vueltasTiempo") {
      newValue = parseInt(newValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleRutAdicionalChange = (index, value) => {
    const nuevos = [...rutsAdicionales];
    nuevos[index] = formatearRut(value);
    setRutsAdicionales(nuevos);
  };

  const validarFormulario = () => {
    const { rutUsuario, fechaReserva, vueltasTiempo } = form;
    const rutRegex = /^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9K]$/;

    if (!rutUsuario || !fechaReserva || !vueltasTiempo) {
      setSnackbar({
        open: true,
        message: "Completa todos los campos requeridos.",
        severity: "warning",
      });
      return false;
    }

    if (!rutRegex.test(rutUsuario)) {
      setSnackbar({
        open: true,
        message: "El RUT del usuario no es válido. Formato: 12.345.678-K",
        severity: "warning",
      });
      return false;
    }

    for (let i = 0; i < rutsAdicionales.length; i++) {
      if (!rutsAdicionales[i]) {
        setSnackbar({
          open: true,
          message: `Falta el RUT de la persona ${i + 2}.`,
          severity: "warning",
        });
        return false;
      }
      if (!rutRegex.test(rutsAdicionales[i])) {
        setSnackbar({
          open: true,
          message: `El RUT de la persona ${i + 2} no es válido.`,
          severity: "warning",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const payload = {
      ...form,
      rutsUsuarios: rutsAdicionales.join(","),
    };

    try {
      await reservaService.save(payload);
      setSnackbar({ open: true, message: "Reserva realizada con éxito.", severity: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Error al crear la reserva:", err);

      if (err.response && err.response.status === 400) {
        setSnackbar({
          open: true,
          message: err.response.data || "Error de validación en el servidor.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "No se pudo conectar con el servidor. Intenta más tarde.",
          severity: "error",
        });
      }
    }
  };

  const hayDatosIngresados = Object.values(form).some(val => val) || rutsAdicionales.some(r => r);

  const handleCancel = () => {
    if (hayDatosIngresados) {
      if (window.confirm("¿Deseas cancelar la reserva? Se perderán los datos ingresados.")) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Crear Nueva Reserva
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            name="rutUsuario"
            label="RUT del Usuario que Reserva"
            value={form.rutUsuario}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            type="datetime-local"
            name="fechaReserva"
            label="Fecha y Hora"
            InputLabelProps={{ shrink: true }}
            value={form.fechaReserva}
            onChange={handleChange}
            required
            helperText="Horario: lun–vie 14:00–22:00, sáb–dom y feriados 10:00–22:00."
          />
          <TextField
            fullWidth
            select
            name="vueltasTiempo"
            label="Vueltas o Tiempo (min)"
            value={form.vueltasTiempo}
            onChange={handleChange}
            required
          >
            {tarifas.map((t) => (
              <MenuItem key={t.tiempoVueltas} value={t.tiempoVueltas}>
                {t.tiempoVueltas} vueltas o {t.tiempoVueltas} min - ${t.precio}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            type="number"
            name="cantPersonas"
            label="Número de Personas que Participan en la Reserva"
            value={form.cantPersonas}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />

          {rutsAdicionales.map((rut, i) => (
            <TextField
              key={i}
              fullWidth
              label={`RUT Persona ${i + 2}`}
              value={rut}
              onChange={(e) => handleRutAdicionalChange(i, e.target.value)}
              required
              helperText="Este usuario debe estar registrado en el sistema."
            />
          ))}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
              Reservar
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel} startIcon={<CancelIcon />}>
              Cancelar
            </Button>
          </Box>
        </Stack>
      </form>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
        ¿Tienes dudas sobre la reserva? <Link href="/faq">Revisa las preguntas frecuentes</Link> o{" "}
        <Link href="/contact">contáctanos</Link>.
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default AddReservation;
