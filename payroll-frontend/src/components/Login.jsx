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
  Link
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import CancelIcon from "@mui/icons-material/Cancel";

const Login = () => {
  const navigate = useNavigate();

  const [correo, setEmail] = useState(localStorage.getItem("preLoginEmail") || "");
  const [contrasena, setPassword] = useState(localStorage.getItem("preLoginPassword") || "");
  const [rut, setRut] = useState(localStorage.getItem("preLoginRut") || "");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const formatearRut = (rutInput) => {
    let rut = rutInput.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rut.length < 2) return rut;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${cuerpo}-${dv}`;
  };

  const validarRut = (rut) => /^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9K]$/.test(rut);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validarRut(rut)) {
      setSnackbar({ open: true, message: "RUT inválido. Formato esperado: 12.345.678-K", severity: "warning" });
      return;
    }

    try {
      const response = await usuarioService.login({ correo, contrasena, rut });

      if (response.status === 200) {
        localStorage.removeItem("preLoginEmail");
        localStorage.removeItem("preLoginPassword");
        localStorage.removeItem("preLoginRut");

        localStorage.setItem("user", JSON.stringify(response.data));
        setSnackbar({ open: true, message: "Inicio de sesión exitoso.", severity: "success" });

        setTimeout(() => window.location.href = "/", 1500);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setSnackbar({ open: true, message: "Correo, RUT o contraseña incorrectos.", severity: "error" });
      } else {
        console.error(error);
        setSnackbar({ open: true, message: "Error al conectar con el servidor.", severity: "error" });
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Iniciar Sesión
      </Typography>
      <form onSubmit={handleLogin}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText="Debe ser un correo válido, por ejemplo: usuario@gmail.com"
          />
          <TextField
            fullWidth
            label="RUT"
            value={rut}
            onChange={(e) => setRut(formatearRut(e.target.value))}
            required
            helperText="Ejemplo: 12.345.678-K"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={contrasena}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<LoginIcon />}
          >
            Entrar
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<CancelIcon />}
            onClick={() => navigate("/")}
          >
            Cancelar
          </Button>
          <Typography variant="body2" align="center">
            ¿No tienes cuenta?{" "}
            <Link href="/register" underline="hover">
              Regístrate aquí
            </Link>
          </Typography>
        </Stack>
      </form>

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

export default Login;
