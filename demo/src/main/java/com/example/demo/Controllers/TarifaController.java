package com.example.demo.controllers;

import com.example.demo.services.TarifaService;
import com.example.demo.entities.TarifaEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarifa")
@CrossOrigin("*")
public class TarifaController {

    @Autowired
    TarifaService tarifaService;

    @PostMapping()
    public ResponseEntity<TarifaEntity> save(@RequestBody TarifaEntity tarifa) {
        TarifaEntity tarifaNew = tarifaService.saveTarifa(tarifa);
        return ResponseEntity.ok(tarifaNew);
    }

    @GetMapping()
    public ResponseEntity<List<TarifaEntity>> getAll() {
        List<TarifaEntity> tarifas = tarifaService.getAllTarifas();
        if (tarifas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tarifas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarifaEntity> update(
            @PathVariable("id") int id,
            @RequestBody TarifaEntity tarifa) {
        TarifaEntity tarifaUpdated = tarifaService.updateTarifa(id, tarifa);
        return ResponseEntity.ok(tarifaUpdated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        try {
            tarifaService.deleteTarifa(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/calcular/{tiempoVueltas}")
    public ResponseEntity<Integer> seleccionarTarifa(@PathVariable("tiempoVueltas") int tiempoVueltas) {
        int tarifa = tarifaService.buscarTarifa(tiempoVueltas);
        return ResponseEntity.ok(tarifa);
    }

    @GetMapping("/tiempo/{tiempoVueltas}")
    public ResponseEntity<Integer> obtenerTiempoDeReserva(@PathVariable("tiempoVueltas") int tiempoVueltas) {
        int tiempoReserva = tarifaService.obtenerTiempoDeReserva(tiempoVueltas);
        return ResponseEntity.ok(tiempoReserva);
    }

}
