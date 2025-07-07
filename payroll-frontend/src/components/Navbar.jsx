import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidemenu from "./Sidemenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const toggleDrawer = (open) => {
    setOpen(open);
  };

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  const handleLogoutConfirmed = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setConfirmLogout(false);
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
            title="Abrir menú lateral"
            aria-label="Abrir menú lateral"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {isSmallScreen ? "KartingRM" : "KartingRM: Sistema de Gestión de Karting"}
          </Typography>

          <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
            {!isLoggedIn ? (
              <>
                <Button color="inherit" onClick={handleLogin}>
                  Iniciar sesión
                </Button>
                <Button color="inherit" onClick={handleRegister}>
                  Registrarse
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={() => setConfirmLogout(true)}>
                Cerrar sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Sidemenu open={open} toggleDrawer={toggleDrawer} />

      {/* Diálogo de confirmación de cierre de sesión */}
      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>¿Estás seguro de que deseas cerrar sesión?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogoutConfirmed} color="error">
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
