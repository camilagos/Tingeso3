import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Link
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [snackbar, setSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("kartingrm.contacto@gmail.com");
    setSnackbar(true);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Contáctanos
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" gutterBottom>
          Si tienes dudas, sugerencias o necesitas ayuda, puedes escribirnos al siguiente correo:
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
            kartingrm.contacto@gmail.com
          </Typography>
          <Tooltip title="Copiar al portapapeles">
            <IconButton onClick={handleCopyEmail} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nuestro equipo responderá a la brevedad dentro del horario de atención.
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
          También puedes revisar nuestras{" "}
          <Link onClick={() => navigate("/faq")} sx={{ cursor: "pointer" }}>
            preguntas frecuentes
          </Link>{" "}
          para obtener ayuda inmediata.
        </Typography>
      </Paper>

      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbar(false)}>
          Correo copiado al portapapeles
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
