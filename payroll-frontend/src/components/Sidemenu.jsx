import {
  Box, Drawer, List, Divider, ListItemButton, ListItemIcon,
  ListItemText, Typography, Tooltip
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventIcon from "@mui/icons-material/Event";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PercentIcon from "@mui/icons-material/Percent";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EmailIcon from "@mui/icons-material/Email";
import PropTypes from 'prop-types';

import { useNavigate } from "react-router-dom";

Sidemenu.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};


export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();

  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  const isAdmin = user?.admin || false;
  const isLoggedIn = !!user;

  const handleProtectedNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
    toggleDrawer(false)();
  };

  const listOptions = () => (
    <Box role="presentation" sx={{ width: 280 }}>
      <List>
        <Tooltip title="Ir a la página de inicio" placement="right">
          <ListItemButton onClick={() => handleNavigation("/")}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </Tooltip>

        <Divider />

        <Tooltip title="Ver y editar tu perfil" placement="right">
          <ListItemButton onClick={() => handleProtectedNavigation("/profile")}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Mi perfil" />
          </ListItemButton>
        </Tooltip>

        <Tooltip title="Hacer una nueva reserva" placement="right">
          <ListItemButton onClick={() => handleProtectedNavigation("/reservation")}>
            <ListItemIcon><EventIcon /></ListItemIcon>
            <ListItemText primary="Reservar" />
          </ListItemButton>
        </Tooltip>

        <Tooltip title="Preguntas frecuentes" placement="right">
          <ListItemButton onClick={() => handleNavigation("/faq")}>
            <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
            <ListItemText primary="FAQ" />
          </ListItemButton>
        </Tooltip>

        <Tooltip title="Contactar al equipo" placement="right">
          <ListItemButton onClick={() => handleNavigation("/contact")}>
            <ListItemIcon><EmailIcon /></ListItemIcon>
            <ListItemText primary="Contáctanos" />
          </ListItemButton>
        </Tooltip>

        {isAdmin && (
          <>
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ bgcolor: "#f5f5f5", py: 1, px: 2 }}>
              <Typography variant="overline" color="text.secondary">
                Zona Administrativa
              </Typography>
            </Box>

            <Tooltip title="Ver ingresos por vueltas o tiempo" placement="right">
              <ListItemButton onClick={() => handleNavigation("/reportByLapsOrTime")}>
                <ListItemIcon><BarChartIcon /></ListItemIcon>
                <ListItemText primary="Reporte por tiempo/vueltas" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Ver ingresos por tamaño de grupo" placement="right">
              <ListItemButton onClick={() => handleNavigation("/reportByPerson")}>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Reporte por número de personas" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Ver disponibilidad semanal de pista" placement="right">
              <ListItemButton onClick={() => handleNavigation("/Rack")}>
                <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
                <ListItemText primary="Rack semanal" />
              </ListItemButton>
            </Tooltip>

            <Divider sx={{ mt: 1 }} />

            <Tooltip title="Gestionar estado de los karts" placement="right">
              <ListItemButton onClick={() => handleNavigation("/karts")}>
                <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                <ListItemText primary="Gestión de Karts" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Configurar tarifas del servicio" placement="right">
              <ListItemButton onClick={() => handleNavigation("/tarifas")}>
                <ListItemIcon><BarChartIcon /></ListItemIcon>
                <ListItemText primary="Gestión de Tarifas" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Definir descuentos aplicables" placement="right">
              <ListItemButton onClick={() => handleNavigation("/descuentos")}>
                <ListItemIcon><PercentIcon /></ListItemIcon>
                <ListItemText primary="Gestión de Descuentos" />
              </ListItemButton>
            </Tooltip>
          </>
        )}
      </List>
    </Box>
  );

  const handleNavigation = (path) => {
    navigate(path);
    toggleDrawer(false)();
  };

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      {listOptions()}
    </Drawer>
  );
}
