package com.example.demo.services;

import com.example.demo.entities.DescuentoVisitasEntity;
import com.example.demo.entities.ReservaEntity;
import com.example.demo.repositories.DescuentoVisitasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DescuentoVisitasService {

    @Autowired
    DescuentoVisitasRepository descuentoVisitasRepository;

    public DescuentoVisitasEntity saveDescuentoVisitas(DescuentoVisitasEntity descuentoVisitas) {
        return descuentoVisitasRepository.save(descuentoVisitas);
    }

    public List<DescuentoVisitasEntity> getAllDescuentosVisitas() {
        return descuentoVisitasRepository.findAll();
    }

    public DescuentoVisitasEntity updateDescuentoVisitas(int id, DescuentoVisitasEntity descuentoVisitas) {
        DescuentoVisitasEntity existingDescuento = descuentoVisitasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DescuentoVisitas not found with id: " + id));

        existingDescuento.setCategoria(descuentoVisitas.getCategoria());
        existingDescuento.setMinVisitas(descuentoVisitas.getMinVisitas());
        existingDescuento.setMaxVisitas(descuentoVisitas.getMaxVisitas());
        existingDescuento.setDescuento(descuentoVisitas.getDescuento());

        return descuentoVisitasRepository.save(existingDescuento);
    }

    public boolean deleteDescuentoVisitas(int id) throws Exception {
        try {
            descuentoVisitasRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }


    public int calcularDescuentoVisitas(String rut, List<ReservaEntity> reservas) {
        int contador = 0;
        for (ReservaEntity reserva : reservas) {
            if (rut.equals(reserva.getRutUsuario())) contador++;
            else if (reserva.getRutsUsuarios() != null &&
                    Arrays.stream(reserva.getRutsUsuarios().split(","))
                            .map(String::trim).anyMatch(rut::equals)) {
                contador++;
            }
        }

        DescuentoVisitasEntity desc = descuentoVisitasRepository
                .findByMinVisitasLessThanEqualAndMaxVisitasGreaterThanEqual(contador, contador);
        return desc != null ? desc.getDescuento() : 0;
    }


}
