import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Faq = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Preguntas Frecuentes (FAQ)
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>¿Cómo puedo reservar una sesión de karting?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Debes iniciar sesión con tu cuenta y luego ir a la sección &quot;Reservar&quot; desde el menú lateral o desde la página de inicio.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>¿Puedo cancelar o cambiar una reserva?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Actualmente no está habilitada la cancelación automática. Para cambios, por favor contáctanos por correo antes de tu hora reservada.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>¿Qué descuentos se aplican automáticamente?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              El sistema calcula automáticamente descuentos por cantidad de personas, visitas frecuentes y cumpleaños según las reglas establecidas.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>¿Qué pasa si llego tarde a mi turno?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              El tiempo reservado incluye preparación e instrucciones. Si llegas tarde, podrías perder parte de tu sesión. Te recomendamos llegar 10 minutos antes.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default Faq;
