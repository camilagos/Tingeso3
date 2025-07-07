import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Paper, Divider, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import tarifaService from "../services/tarifa.service";
import tarifaEspecialService from "../services/tarifaEspecial.service";

const Rate = () => {
  const [tarifas, setTarifas] = useState([]);
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);

  const [form, setForm] = useState({ tiempoVueltas: "", precio: "", duracionReserva: "" });
  const [especialForm, setEspecialForm] = useState({ fecha: "", porcentajeTarifa: "", descripcion: "", esRecargo: true });

  const [editingId, setEditingId] = useState(null);
  const [editEspecialId, setEditEspecialId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [dialogDelete, setDialogDelete] = useState({ open: false, id: null, especial: false });

  useEffect(() => {
    fetchTarifas();
    fetchTarifasEspeciales();
  }, []);

  const fetchTarifas = async () => {
    try {
      const res = await tarifaService.getAll();
      setTarifas(res.data || []);
    } catch (err) {
      console.error("Error al cargar tarifas:", err);
    }
  };

  const fetchTarifasEspeciales = async () => {
    try {
      const res = await tarifaEspecialService.getAll();
      setTarifasEspeciales(res.data || []);
    } catch (err) {
      console.error("Error al cargar tarifas especiales:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEspecialChange = (e) => {
    const { name, value } = e.target;
    setEspecialForm((prev) => ({
      ...prev,
      [name]: name === "esRecargo" ? value === "true" : value
    }));
  };

  const isWeekendTariff = especialForm.descripcion.toLowerCase().includes("fin de semana");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tiempoVueltas, precio, duracionReserva } = form;

    if (!tiempoVueltas || !precio || !duracionReserva) {
      setSnackbar({ open: true, message: "Completa todos los campos.", severity: "warning" });
      return;
    }

    if (+tiempoVueltas <= 0 || +precio <= 0 || +duracionReserva <= 0) {
      setSnackbar({ open: true, message: "Los valores deben ser mayores a 0.", severity: "warning" });
      return;
    }

    try {
      if (editingId !== null) {
        await tarifaService.update(editingId, form);
        setSnackbar({ open: true, message: "Tarifa actualizada.", severity: "success" });
      } else {
        await tarifaService.save(form);
        setSnackbar({ open: true, message: "Tarifa creada.", severity: "success" });
      }
      setForm({ tiempoVueltas: "", precio: "", duracionReserva: "" });
      setEditingId(null);
      fetchTarifas();
    } catch (err) {
      console.error("Error al guardar tarifa:", err);
      setSnackbar({ open: true, message: "Error al guardar tarifa.", severity: "error" });
    }
  };

  const handleEspecialSubmit = async (e) => {
    e.preventDefault();
    const { fecha, porcentajeTarifa, descripcion } = especialForm;

    if ((!isWeekendTariff && !fecha) || !porcentajeTarifa || !descripcion) {
      setSnackbar({ open: true, message: "Completa los campos requeridos.", severity: "warning" });
      return;
    }

    if (+porcentajeTarifa < 0 || +porcentajeTarifa > 100) {
      setSnackbar({ open: true, message: "El porcentaje debe estar entre 0 y 100.", severity: "warning" });
      return;
    }

    try {
      if (editEspecialId !== null) {
        await tarifaEspecialService.update(editEspecialId, especialForm);
        setSnackbar({ open: true, message: "Tarifa especial actualizada.", severity: "success" });
      } else {
        await tarifaEspecialService.save(especialForm);
        setSnackbar({ open: true, message: "Tarifa especial creada.", severity: "success" });
      }
      setEspecialForm({ fecha: "", porcentajeTarifa: "", descripcion: "", esRecargo: true });
      setEditEspecialId(null);
      fetchTarifasEspeciales();
    } catch (err) {
      console.error("Error al guardar tarifa especial:", err);
      setSnackbar({ open: true, message: "Error al guardar tarifa especial.", severity: "error" });
    }
  };

  const handleEdit = (tarifa) => {
    setForm({
      tiempoVueltas: tarifa.tiempoVueltas,
      precio: tarifa.precio,
      duracionReserva: tarifa.duracionReserva,
    });
    setEditingId(tarifa.id);
  };

  const handleEspecialEdit = (tarifa) => {
    setEspecialForm(tarifa);
    setEditEspecialId(tarifa.id);
  };

  const confirmDelete = (id, especial) => {
    setDialogDelete({ open: true, id, especial });
  };

  const handleConfirmDelete = async () => {
    const { id, especial } = dialogDelete;
    try {
      if (especial) {
        await tarifaEspecialService.remove(id);
        fetchTarifasEspeciales();
      } else {
        await tarifaService.remove(id);
        fetchTarifas();
      }
      setSnackbar({ open: true, message: "Tarifa eliminada.", severity: "success" });
    } catch (err) {
      console.error("Error al eliminar tarifa:", err);
      setSnackbar({ open: true, message: "Error al eliminar tarifa.", severity: "error" });
    }
    setDialogDelete({ open: false, id: null, especial: false });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Gestión de Tarifas</Typography>

      {/* --- TARIFAS NORMALES --- */}
      <Paper sx={{ p: 2, mt: 2, mb: 4 }}>
        <Typography variant="h6">Tarifas Normales</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Vueltas o Minutos" name="tiempoVueltas" type="number" value={form.tiempoVueltas} onChange={handleChange} sx={{ mr: 2, mt: 2 }} required />
          <TextField label="Precio ($)" name="precio" type="number" value={form.precio} onChange={handleChange} sx={{ mr: 2, mt: 2 }} required />
          <TextField label="Duración Total (min)" name="duracionReserva" type="number" value={form.duracionReserva} onChange={handleChange} sx={{ mt: 2 }} required />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Actualizar" : "Crear"}
            </Button>
            {editingId && (
              <Button variant="text" sx={{ ml: 2 }} onClick={() => {
                setForm({ tiempoVueltas: "", precio: "", duracionReserva: "" });
                setEditingId(null);
              }}>
                Cancelar edición
              </Button>
            )}
          </Box>
        </form>

        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vueltas/Minutos</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tarifas.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.tiempoVueltas}</TableCell>
                <TableCell>${t.precio.toLocaleString()}</TableCell>
                <TableCell>{t.duracionReserva} min</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(t)}><Edit /></IconButton>
                  <IconButton onClick={() => confirmDelete(t.id, false)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Divider />

      {/* --- TARIFAS ESPECIALES --- */}
      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6">Tarifas Especiales</Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
          Si en la descripción escribes &quot;fin de semana&quot;, la tarifa se aplicará automáticamente los días sábado y domingo y no será necesario ingresar una fecha.
        </Typography>

        <form onSubmit={handleEspecialSubmit}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={especialForm.fecha}
              onChange={handleEspecialChange}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
              disabled={isWeekendTariff}
            />
            <TextField
              label="% Tarifa"
              name="porcentajeTarifa"
              type="number"
              value={especialForm.porcentajeTarifa}
              onChange={handleEspecialChange}
              sx={{ minWidth: 130 }}
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={especialForm.descripcion}
              onChange={handleEspecialChange}
              sx={{ flexGrow: 1, minWidth: 180 }}
              required
            />
            <TextField
              label="¿Es recargo?"
              name="esRecargo"
              select
              value={especialForm.esRecargo}
              onChange={handleEspecialChange}
              SelectProps={{ native: true }}
              sx={{ minWidth: 150 }}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </TextField>
          </Box>

          {isWeekendTariff && (
            <Alert severity="info" sx={{ mt: 2, width: "90%" }}>
              Esta tarifa se aplicará automáticamente los días sábado y domingo. No es necesario especificar una fecha.
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {editEspecialId ? "Actualizar" : "Crear"}
            </Button>
            {editEspecialId && (
              <Button variant="text" sx={{ ml: 2 }} onClick={() => {
                setEspecialForm({ fecha: "", porcentajeTarifa: "", descripcion: "", esRecargo: true });
                setEditEspecialId(null);
              }}>
                Cancelar edición
              </Button>
            )}
          </Box>
        </form>

        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>%</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tarifasEspeciales.map((te) => (
              <TableRow key={te.id}>
                <TableCell>{te.id}</TableCell>
                <TableCell>{te.fecha}</TableCell>
                <TableCell>{te.porcentajeTarifa}%</TableCell>
                <TableCell>{te.esRecargo ? "Recargo" : "Descuento"}</TableCell>
                <TableCell>{te.descripcion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEspecialEdit(te)}><Edit /></IconButton>
                  <IconButton onClick={() => confirmDelete(te.id, true)} color="error"><Delete /></IconButton>
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

      {/* Dialog de eliminación */}
      <Dialog open={dialogDelete.open} onClose={() => setDialogDelete({ open: false, id: null, especial: false })}>
        <DialogTitle>¿Eliminar tarifa?</DialogTitle>
        <DialogContent>
          <DialogContentText>Esta acción no se puede deshacer. ¿Deseas continuar?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDelete({ open: false, id: null, especial: false })}>Cancelar</Button>
          <Button color="error" onClick={handleConfirmDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rate;
