import { Box, Typography, Container, Divider, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleReservationClick = () => {
    if (isLoggedIn) {
      navigate("/reservation");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        KartingRM: Sistema de Gestión de Reservas de Karting
      </Typography>

      <Typography variant="body1" paragraph>
        KartingRM es una aplicación web diseñada para facilitar la gestión de reservas, control de horarios y generación de reportes en un kartódromo.
        Permite registrar usuarios, aplicar descuentos automáticos por grupo, frecuencia o cumpleaños, y generar comprobantes de pago detallados.
      </Typography>

      <Box textAlign="center" my={3}>
        <Button variant="contained" onClick={handleReservationClick}>
          Reservar
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Horario de Atención:</Typography>
      <Typography variant="body2" paragraph>
        • Lunes a Viernes: 14:00 a 22:00 hrs<br />
        • Sábados, Domingos y Feriados: 10:00 a 22:00 hrs
      </Typography>

      <Typography variant="h6">Tarifas y Duración de Reservas*</Typography>
      <Typography variant="body2" paragraph>
        • 10 vueltas o 10 minutos: $15.000<br />
        • 15 vueltas o 15 minutos: $20.000<br />
        • 20 vueltas o 20 minutos: $25.000<br />
        • Recargo del 15% en fines de semana y feriados
      </Typography>

      <Typography variant="h6">Descuentos Disponibles*</Typography>
      <Typography variant="subtitle2">Por número de personas:</Typography>
      <Typography variant="body2">
        • 3 a 5 personas: 10%<br />
        • 6 a 10 personas: 20%<br />
        • 11 a 15 personas: 30%
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 2 }}>Por frecuencia de visitas:</Typography>
      <Typography variant="body2">
        • 2 a 4 visitas/mes: 10%<br />
        • 5 a 6 visitas/mes: 20%<br />
        • 7+ visitas/mes: 30%
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 2 }}>Promociones especiales:</Typography>
      <Typography variant="body2" paragraph>
        • 50% descuento a cumpleañeros (1 persona en grupos 3–5, hasta 2 en grupos 6–10).
      </Typography>

      <Typography variant="caption" color="text.secondary" paragraph>
        * Las tarifas y descuentos están sujetos a cambios.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" paragraph>
        Esta aplicación fue desarrollada usando{" "}
        <Link href="https://spring.io/projects/spring-boot" target="_blank">Spring Boot</Link>,{" "}
        <Link href="https://react.dev" target="_blank">React</Link>, y{" "}
        <Link href="https://www.postgresql.org/" target="_blank">PostgreSQL</Link>.
      </Typography>

      <Typography variant="caption" color="text.secondary">
        ¿Tienes dudas? <Link onClick={() => navigate("/contact")} sx={{ cursor: "pointer" }}>Contáctanos</Link>.
      </Typography>
    </Container>
  );
};

export default Home;
