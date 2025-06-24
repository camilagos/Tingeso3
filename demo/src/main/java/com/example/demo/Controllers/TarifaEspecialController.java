package com.example.demo.Controllers;

import com.example.demo.Entities.TarifaEspecialEntity;
import com.example.demo.Entities.UsuarioEntity;
import com.example.demo.Services.TarifaEspecialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/tarifaEspecial")
@CrossOrigin("*")
public class TarifaEspecialController {

    @Autowired
    TarifaEspecialService tarifaEspecialService;

    @PostMapping()
    public ResponseEntity<TarifaEspecialEntity> save(@RequestBody TarifaEspecialEntity tarifaEspecial) {
        TarifaEspecialEntity tarifaEspecialNew = tarifaEspecialService.saveTarifaEspecial(tarifaEspecial);
        return ResponseEntity.ok(tarifaEspecialNew);
    }

    @GetMapping()
    public ResponseEntity<List<TarifaEspecialEntity>> getAll() {
        List<TarifaEspecialEntity> tarifasEspeciales = tarifaEspecialService.getAllTarifasEspeciales();
        if (tarifasEspeciales.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tarifasEspeciales);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarifaEspecialEntity> update(
            @PathVariable ("id") int id,
            @RequestBody TarifaEspecialEntity tarifaEspecial) {
        TarifaEspecialEntity tarifaEspecialUpdated = tarifaEspecialService.updateTarifaEspecial(id, tarifaEspecial);
        return ResponseEntity.ok(tarifaEspecialUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        try {
            tarifaEspecialService.deleteTarifaEspecial(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/calcular/{fechaReserva}/{precioBase}")
    public ResponseEntity<Integer> calcularTarifaEspecial(@PathVariable("fechaReserva") String fechaReserva, @PathVariable("precioBase") int precioBase) {
        LocalDate fecha = LocalDate.parse(fechaReserva);
        int precioFinal = tarifaEspecialService.aplicarTarifaEspecial(fecha, precioBase);
        return ResponseEntity.ok(precioFinal);
    }

    @PostMapping("/cumpleaneros")
    public ResponseEntity<Set<UsuarioEntity>> getCumpleaneros(
            @RequestBody List<UsuarioEntity> usuarios,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaReserva) {

        Set<UsuarioEntity> cumpleaneros = tarifaEspecialService.obtenerCumpleaneros(usuarios, fechaReserva);

        if (cumpleaneros.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cumpleaneros);
    }


    @GetMapping("/cantCumplesPermitidos/{cantPersonas}")
    public ResponseEntity<Integer> getCantidadCumplesPermitidos(@PathVariable("cantPersonas") int cantPersonas) {
        int cantidadPermitida = tarifaEspecialService.cumpleanosPermitidos(cantPersonas);
        return ResponseEntity.ok(cantidadPermitida);
    }

    @GetMapping("/finDeSemanaOFeriado/{fechaReserva}")
    public ResponseEntity<Boolean> isFinDeSemanaOFeriado(@PathVariable("fechaReserva") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaReserva) {
        boolean esFinDeSemanaOFeriado = tarifaEspecialService.isFinDeSemanaOFeriado(fechaReserva);
        return ResponseEntity.ok(esFinDeSemanaOFeriado);
    }
}
