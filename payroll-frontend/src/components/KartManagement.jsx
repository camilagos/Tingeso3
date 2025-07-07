import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack
} from "@mui/material";
import kartService from "../services/kart.service";

const KartManagement = () => {
  const [availableKarts, setAvailableKarts] = useState([]);
  const [unavailableKarts, setUnavailableKarts] = useState([]);
  const [newKartCode, setNewKartCode] = useState("");
  const [newKartModel, setNewKartModel] = useState("Sodikart RT8");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, kartId: null });

  const loadKarts = async () => {
    try {
      const available = await kartService.getByDisponibilidad(true);
      const unavailable = await kartService.getByDisponibilidad(false);
      setAvailableKarts(available.data || []);
      setUnavailableKarts(unavailable.data || []);
    } catch (error) {
      console.error("Error cargando karts", error);
      setSnackbar({ open: true, message: "Error cargando lista de karts", severity: "error" });
    }
  };

  useEffect(() => {
    loadKarts();
  }, []);

  const resetForm = () => {
    setNewKartCode("");
    setNewKartModel("Sodikart RT8");
  };

  const toggleAvailability = async (kart) => {
    try {
      const updatedKart = { ...kart, disponible: !kart.disponible };
      await kartService.update(updatedKart);
      setSnackbar({ open: true, message: `Estado actualizado para el kart ${kart.codigo}`, severity: "success" });
      loadKarts();
    } catch (error) {
      console.error("Error cambiando disponibilidad", error);
      setSnackbar({ open: true, message: "No se pudo cambiar la disponibilidad", severity: "error" });
    }
  };

  const handleAddKart = async () => {
    const codigo = newKartCode.trim().toUpperCase();

    if (codigo.length < 3 || !/^[A-Za-z0-9]+$/.test(codigo)) {
      setSnackbar({
        open: true,
        message: "Código inválido: mínimo 3 caracteres, solo letras y números",
        severity: "warning"
      });
      return;
    }

    const allKarts = [...availableKarts, ...unavailableKarts];
    const exists = allKarts.some(k => k.codigo.toUpperCase() === codigo);
    if (exists) {
      setSnackbar({ open: true, message: "Ya existe un kart con ese código", severity: "warning" });
      return;
    }

    try {
      await kartService.save({
        codigo,
        modelo: newKartModel.trim() || "Sodikart RT8",
        disponible: true
      });
      setSnackbar({ open: true, message: "Kart agregado correctamente", severity: "success" });
      resetForm();
      loadKarts();
    } catch (error) {
      console.error("Error agregando kart:", error);
      setSnackbar({ open: true, message: "No se pudo agregar el kart", severity: "error" });
    }
  };

  const handleDeleteKart = async () => {
    try {
      await kartService.remove(deleteDialog.kartId);
      setSnackbar({ open: true, message: "Kart eliminado correctamente", severity: "success" });
      setDeleteDialog({ open: false, kartId: null });
      loadKarts();
    } catch (error) {
      console.error("Error eliminando kart", error);
      setSnackbar({ open: true, message: "No se pudo eliminar el kart", severity: "error" });
    }
  };

  const renderKartList = (karts, disponible) =>
    karts.map((kart) => (
      <Box
        key={kart.id}
        sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography>
          <strong>Código:</strong> {kart.codigo} — <strong>Modelo:</strong> {kart.modelo || "Desconocido"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color={disponible ? "warning" : "success"}
            onClick={() => toggleAvailability(kart)}
          >
            {disponible ? "Marcar como No Disponible" : "Marcar como Disponible"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialog({ open: true, kartId: kart.id })}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
    ));

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestión de Karts
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Formulario */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Agregar Nuevo Kart</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1, flexWrap: "wrap", alignItems: "flex-start" }}>
            <TextField
              label="Código del Kart"
              value={newKartCode}
              onChange={(e) => setNewKartCode(e.target.value)}
              helperText="Ej: K001, KART23 (mín. 3 caracteres alfanuméricos)"
            />
            <TextField
              label="Modelo"
              value={newKartModel}
              onChange={(e) => setNewKartModel(e.target.value)}
              helperText="Modelo de fábrica (por defecto: Sodikart RT8)"
            />
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }} >
              <Button
                variant="contained"
                onClick={handleAddKart}
                disabled={!newKartCode.trim()}
              >
                Agregar
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={resetForm}
              >
                Limpiar campos
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Karts disponibles */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">
            Karts Disponibles ({availableKarts.length})
          </Typography>
          <Divider sx={{ my: 1 }} />
          {availableKarts.length === 0 ? (
            <Typography>No hay karts disponibles.</Typography>
          ) : (
            renderKartList(availableKarts, true)
          )}
        </Box>

        {/* Karts no disponibles */}
        <Box>
          <Typography variant="h6">
            Karts No Disponibles ({unavailableKarts.length})
          </Typography>
          <Divider sx={{ my: 1 }} />
          {unavailableKarts.length === 0 ? (
            <Typography>No hay karts no disponibles.</Typography>
          ) : (
            renderKartList(unavailableKarts, false)
          )}
        </Box>
      </Paper>

      {/* Diálogo de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, kartId: null })}
      >
        <DialogTitle>¿Eliminar kart?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción eliminará permanentemente el kart. ¿Estás seguro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, kartId: null })}>Cancelar</Button>
          <Button onClick={handleDeleteKart} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default KartManagement;
