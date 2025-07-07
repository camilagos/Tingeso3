import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  Link
} from "@mui/material";
import usuarioService from "../services/usuario.service";

const ProfileCustomer = () => {
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setSnackbar({ open: true, message: "Debes iniciar sesión para ver tu perfil", severity: "warning" });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      setSnackbar({ open: true, message: "Usuario inválido. Inicia sesión nuevamente.", severity: "error" });
      return;
    }

    try {
      await usuarioService.remove(user.id);
      localStorage.removeItem("user");
      setSnackbar({ open: true, message: "Tu cuenta ha sido eliminada.", severity: "success" });
      setTimeout(() => window.location.href = "/", 1500);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Hubo un error al eliminar tu cuenta.", severity: "error" });
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Perfil del Usuario
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography><strong>Nombre:</strong> {user.nombre}</Typography>
        <Typography><strong>Email:</strong> {user.correo}</Typography>
        <Typography><strong>RUT:</strong> {user.rut}</Typography>
        <Typography><strong>Fecha de nacimiento:</strong> {user.cumpleanos}</Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(true)} fullWidth>
            Eliminar Cuenta
          </Button>
        </Stack>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          ¿Tienes problemas?{" "}
          <Link href="/contact" underline="hover">
            Contáctanos
          </Link>
        </Typography>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>¿Eliminar cuenta?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción es permanente. ¿Estás seguro de que deseas eliminar tu cuenta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => { setDialogOpen(false); handleDeleteAccount(); }} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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

export default ProfileCustomer;
