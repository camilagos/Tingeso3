package com.example.demo.controllers;

import com.example.demo.entities.DescuentoVisitasEntity;
import com.example.demo.entities.ReservaEntity;
import com.example.demo.services.DescuentoVisitasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/descuentoVisitas")
@CrossOrigin("*")
public class DescuentoVisitasController {

    @Autowired
    DescuentoVisitasService descuentoVisitasService;

    @PostMapping()
    public ResponseEntity<DescuentoVisitasEntity> save(@RequestBody DescuentoVisitasEntity descuentoVisitas) {
        DescuentoVisitasEntity descuentoVisitasNew = descuentoVisitasService.saveDescuentoVisitas(descuentoVisitas);
        return ResponseEntity.ok(descuentoVisitasNew);
    }

    @GetMapping()
    public ResponseEntity<List<DescuentoVisitasEntity>> getAll() {
        List<DescuentoVisitasEntity> descuentosVisitas = descuentoVisitasService.getAllDescuentosVisitas();
        if (descuentosVisitas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(descuentosVisitas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DescuentoVisitasEntity> update(
            @PathVariable("id") int id,
            @RequestBody DescuentoVisitasEntity descuentoVisitas) {
        DescuentoVisitasEntity descuentoVisitasUpdated = descuentoVisitasService.updateDescuentoVisitas(id, descuentoVisitas);
        return ResponseEntity.ok(descuentoVisitasUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        try {
            descuentoVisitasService.deleteDescuentoVisitas(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/calcular")
    public int calcularDescuentoDesdeReservas(@RequestParam String rut, @RequestBody List<ReservaEntity> reservas) {
        return descuentoVisitasService.calcularDescuentoVisitas(rut, reservas);
    }
}
