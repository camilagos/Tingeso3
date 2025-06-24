package com.example.demo.Controllers;

import com.example.demo.Entities.DescuentoVisitasEntity;
import com.example.demo.Services.DescuentoVisitasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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


    @GetMapping("/calcular/{rut}/{fechaReserva}")
    public ResponseEntity<Integer> calcularDescuentoVisitas(
            @PathVariable String rut,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaReserva) {
        int descuento = descuentoVisitasService.buscarDescuentoVisitas(rut, fechaReserva);
        return ResponseEntity.ok(descuento);
    }

}
