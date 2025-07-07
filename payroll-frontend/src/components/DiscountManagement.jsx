import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Grid,
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Divider, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import descuentoGrupoService from "../services/descGrupo.service";
import descuentoVisitasService from "../services/descVisitas.service";

const Discount = () => {
  const [grupoDescuentos, setGrupoDescuentos] = useState([]);
  const [visitaDescuentos, setVisitaDescuentos] = useState([]);

  const [grupoForm, setGrupoForm] = useState({ minPersonas: "", maxPersonas: "", descuento: "" });
  const [visitaForm, setVisitaForm] = useState({ categoria: "", minVisitas: "", maxVisitas: "", descuento: "" });

  const [editGrupoId, setEditGrupoId] = useState(null);
  const [editVisitaId, setEditVisitaId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [dialog, setDialog] = useState({ open: false, id: null, tipo: "" });

  const fetchData = async () => {
    const [grupoRes, visitaRes] = await Promise.all([
      descuentoGrupoService.getAll(),
      descuentoVisitasService.getAll()
    ]);
    setGrupoDescuentos(grupoRes.data || []);
    setVisitaDescuentos(visitaRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleGrupoSubmit = async (e) => {
    e.preventDefault();
    const { minPersonas, maxPersonas, descuento } = grupoForm;

    if (!minPersonas || !maxPersonas || !descuento) {
      setSnackbar({ open: true, message: "Completa todos los campos de grupo.", severity: "warning" });
      return;
    }

    if (+minPersonas > +maxPersonas) {
      setSnackbar({ open: true, message: "El mínimo no puede ser mayor que el máximo.", severity: "warning" });
      return;
    }

    if (+descuento < 0 || +descuento > 100) {
      setSnackbar({ open: true, message: "El descuento debe estar entre 0 y 100.", severity: "warning" });
      return;
    }

    const action = editGrupoId
      ? descuentoGrupoService.update(editGrupoId, grupoForm)
      : descuentoGrupoService.save(grupoForm);

    await action;
    resetGrupoForm();
    fetchData();
    setSnackbar({ open: true, message: "Descuento de grupo guardado.", severity: "success" });
  };

  const handleVisitaSubmit = async (e) => {
    e.preventDefault();
    const { categoria, minVisitas, maxVisitas, descuento } = visitaForm;

    if (!categoria || !minVisitas || !maxVisitas || !descuento) {
      setSnackbar({ open: true, message: "Completa todos los campos de visitas.", severity: "warning" });
      return;
    }

    if (+minVisitas > +maxVisitas) {
      setSnackbar({ open: true, message: "El mínimo no puede ser mayor que el máximo.", severity: "warning" });
      return;
    }

    if (+descuento < 0 || +descuento > 100) {
      setSnackbar({ open: true, message: "El descuento debe estar entre 0 y 100.", severity: "warning" });
      return;
    }

    const action = editVisitaId
      ? descuentoVisitasService.update(editVisitaId, visitaForm)
      : descuentoVisitasService.save(visitaForm);

    await action;
    resetVisitaForm();
    fetchData();
    setSnackbar({ open: true, message: "Descuento por visitas guardado.", severity: "success" });
  };

  const resetGrupoForm = () => {
    setGrupoForm({ minPersonas: "", maxPersonas: "", descuento: "" });
    setEditGrupoId(null);
  };

  const resetVisitaForm = () => {
    setVisitaForm({ categoria: "", minVisitas: "", maxVisitas: "", descuento: "" });
    setEditVisitaId(null);
  };

  const handleGrupoEdit = (d) => {
    setGrupoForm({ minPersonas: d.minPersonas, maxPersonas: d.maxPersonas, descuento: d.descuento });
    setEditGrupoId(d.id);
  };

  const handleVisitaEdit = (d) => {
    setVisitaForm({ categoria: d.categoria, minVisitas: d.minVisitas, maxVisitas: d.maxVisitas, descuento: d.descuento });
    setEditVisitaId(d.id);
  };

  const confirmDelete = (id, tipo) => {
    setDialog({ open: true, id, tipo });
  };

  const handleConfirmDelete = async () => {
    try {
      if (dialog.tipo === "grupo") {
        await descuentoGrupoService.remove(dialog.id);
      } else {
        await descuentoVisitasService.remove(dialog.id);
      }
      fetchData();
      setSnackbar({ open: true, message: "Descuento eliminado.", severity: "success" });
    } catch (err) {
      console.error("Error al eliminar:", err);
      setSnackbar({ open: true, message: "Error al eliminar.", severity: "error" });
    } finally {
      setDialog({ open: false, id: null, tipo: "" });
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Gestión de Descuentos</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Aquí puedes configurar los descuentos por número de personas y frecuencia de visitas.
      </Typography>

      {/* --- GRUPO --- */}
      <Paper sx={{ p: 2, mt: 2, mb: 4 }}>
        <Typography variant="h6">Descuentos por Grupo</Typography>
        <form onSubmit={handleGrupoSubmit}>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Mín. Personas"
                name="minPersonas"
                type="number"
                value={grupoForm.minPersonas}
                onChange={(e) => setGrupoForm({ ...grupoForm, minPersonas: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Máx. Personas"
                name="maxPersonas"
                type="number"
                value={grupoForm.maxPersonas}
                onChange={(e) => setGrupoForm({ ...grupoForm, maxPersonas: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="% Descuento"
                name="descuento"
                type="number"
                value={grupoForm.descuento}
                onChange={(e) => setGrupoForm({ ...grupoForm, descuento: e.target.value })}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              {editGrupoId ? "Actualizar" : "Crear"}
            </Button>
            {editGrupoId && (
              <Button variant="text" onClick={resetGrupoForm} sx={{ ml: 2 }}>
                Cancelar edición
              </Button>
            )}
          </Box>
        </form>

        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mín.</TableCell>
              <TableCell>Máx.</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grupoDescuentos.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.minPersonas}</TableCell>
                <TableCell>{d.maxPersonas}</TableCell>
                <TableCell>{d.descuento}%</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleGrupoEdit(d)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => confirmDelete(d.id, "grupo")}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Divider />

      {/* --- VISITAS --- */}
      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6">Descuentos por Visitas</Typography>
        <form onSubmit={handleVisitaSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Categoría"
                name="categoria"
                fullWidth
                value={visitaForm.categoria}
                onChange={(e) => setVisitaForm({ ...visitaForm, categoria: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Mín. Visitas"
                name="minVisitas"
                type="number"
                fullWidth
                value={visitaForm.minVisitas}
                onChange={(e) => setVisitaForm({ ...visitaForm, minVisitas: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Máx. Visitas"
                name="maxVisitas"
                type="number"
                fullWidth
                value={visitaForm.maxVisitas}
                onChange={(e) => setVisitaForm({ ...visitaForm, maxVisitas: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="% Descuento"
                name="descuento"
                type="number"
                fullWidth
                value={visitaForm.descuento}
                onChange={(e) => setVisitaForm({ ...visitaForm, descuento: e.target.value })}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              {editVisitaId ? "Actualizar" : "Crear"}
            </Button>
            {editVisitaId && (
              <Button variant="text" onClick={resetVisitaForm} sx={{ ml: 2 }}>
                Cancelar edición
              </Button>
            )}
          </Box>
        </form>

        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Mín.</TableCell>
              <TableCell>Máx.</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitaDescuentos.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.categoria}</TableCell>
                <TableCell>{d.minVisitas}</TableCell>
                <TableCell>{d.maxVisitas}</TableCell>
                <TableCell>{d.descuento}%</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleVisitaEdit(d)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => confirmDelete(d.id, "visita")}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmación */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, id: null, tipo: "" })}
      >
        <DialogTitle>¿Eliminar descuento?</DialogTitle>
        <DialogContent>
          <DialogContentText>Esta acción no se puede deshacer. ¿Deseas continuar?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, id: null, tipo: "" })}>Cancelar</Button>
          <Button color="error" onClick={handleConfirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Discount;
