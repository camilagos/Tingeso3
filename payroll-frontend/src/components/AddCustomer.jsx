import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuario.service";

import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const AddUser = () => {
  const [user, setUser] = useState({
    nombre: "",
    correo: "",
    rut: "",
    contrasena: "",
    cumpleanos: "",
    admin: false,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const navigate = useNavigate();

  const formatearRut = (rut) => {
    rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rut.length < 2) return rut;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${cuerpo}-${dv}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "rut" && typeof newValue === "string") {
      newValue = formatearRut(newValue.toUpperCase());
    }

    setUser((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validarCampos = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const rutRegex = /^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9K]$/;

    if (!user.nombre.trim()) {
      setSnackbar({ open: true, message: "El nombre es obligatorio.", severity: "error" });
      return false;
    }

    if (!emailRegex.test(user.correo)) {
      setSnackbar({ open: true, message: "Correo electrónico no válido.", severity: "error" });
      return false;
    }

    if (!rutRegex.test(user.rut)) {
      setSnackbar({ open: true, message: "RUT no válido. Ejemplo: 12.345.678-K", severity: "error" });
      return false;
    }

    if (user.contrasena.length < 8) {
      setSnackbar({ open: true, message: "La contraseña debe tener al menos 8 caracteres.", severity: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const res = await usuarioService.save(user);
      if (res.status === 200) {
        localStorage.setItem("preLoginEmail", user.correo);
        localStorage.setItem("preLoginRut", user.rut);
        localStorage.setItem("preLoginPassword", user.contrasena);
        setSnackbar({ open: true, message: "Usuario registrado con éxito.", severity: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setSnackbar({ open: true, message: "No se pudo registrar el usuario.", severity: "error" });
      }
    } catch (err) {
      if (
        err.response?.status === 400 &&
        typeof err.response.data === "string" &&
        err.response.data.includes("RUT")
      ) {
        setSnackbar({ open: true, message: "Ya existe un usuario con ese RUT.", severity: "error" });
      } else {
        console.error(err);
        setSnackbar({ open: true, message: "Error al registrar usuario.", severity: "error" });
      }
    }
  };

  const tieneDatos = Object.values(user).some(val => val);

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Registrar Usuario
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField name="nombre" label="Nombre" fullWidth value={user.nombre} onChange={handleChange} required />
          <TextField name="correo" label="Email" fullWidth value={user.correo} onChange={handleChange} required helperText="Ejemplo: usuario@gmail.com" />
          <TextField name="rut" label="RUT" fullWidth value={user.rut} onChange={handleChange} required helperText="Formato: 12.345.678-K" />
          <TextField name="contrasena" type="password" label="Contraseña" fullWidth value={user.contrasena} onChange={handleChange} required />
          <TextField name="cumpleanos" type="date" label="Fecha de nacimiento" fullWidth value={user.cumpleanos} onChange={handleChange} InputLabelProps={{ shrink: true }} required />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
              Registrar
            </Button>
            <Button variant="contained" color="error" onClick={() => {
              if (tieneDatos) setShowCancelDialog(true);
              else navigate("/");
            }}>
              Cancelar
            </Button>
          </Box>
        </Stack>
      </form>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
        ¿Tienes problemas? <Link href="/contact">Contáctanos</Link>.
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle>¿Cancelar registro?</DialogTitle>
        <DialogContent>
          Se perderán los datos ingresados. ¿Deseas continuar?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)} color="primary">Volver</Button>
          <Button onClick={() => navigate("/")} color="error">Sí, salir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddUser;
