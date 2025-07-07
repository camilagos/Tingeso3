package com.example.demo.services;

import com.example.demo.entities.TarifaEspecialEntity;
import com.example.demo.entities.UsuarioEntity;
import com.example.demo.repositories.TarifaEspecialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TarifaEspecialService {

    @Autowired
    TarifaEspecialRepository tarifaEspecialRepository;

    public TarifaEspecialEntity saveTarifaEspecial(TarifaEspecialEntity tarifaEspecial) {
        return tarifaEspecialRepository.save(tarifaEspecial);
    }

    public List<TarifaEspecialEntity> getAllTarifasEspeciales() {
        return tarifaEspecialRepository.findAll();
    }

    public TarifaEspecialEntity updateTarifaEspecial(int id, TarifaEspecialEntity tarifaEspecial) {
        TarifaEspecialEntity existingTarifa = tarifaEspecialRepository.findById(id).orElse(null);
        if (existingTarifa != null) {
            existingTarifa.setFecha(tarifaEspecial.getFecha());
            existingTarifa.setPorcentajeTarifa(tarifaEspecial.getPorcentajeTarifa());
            existingTarifa.setDescripcion(tarifaEspecial.getDescripcion());
            return tarifaEspecialRepository.save(existingTarifa);
        } else {
            return null; // or throw an exception
        }
    }

    public boolean deleteTarifaEspecial(int id) throws Exception {
        try {
            tarifaEspecialRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public boolean isFinDeSemanaOFeriado(LocalDate fechaReserva) {
        DayOfWeek dia = fechaReserva.getDayOfWeek();
        boolean esFinde = dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY;

        boolean esFeriadoRegistrado = tarifaEspecialRepository.findByFecha(fechaReserva).isPresent();

        return esFinde || esFeriadoRegistrado;
    }

    private int aplicarPorcentaje(int precioBase, int porcentaje, boolean esRecargo) {
        int ajuste = precioBase * porcentaje / 100;
        return esRecargo ? precioBase + ajuste : precioBase - ajuste;
    }


    public int aplicarTarifaEspecial(LocalDate fechaReserva, int precioBase) {
        TarifaEspecialEntity especialFecha = tarifaEspecialRepository.findByFecha(fechaReserva).orElse(null);

        if (especialFecha != null && especialFecha.getPorcentajeTarifa() > 0) {
            int porcentaje = especialFecha.getPorcentajeTarifa();
            return aplicarPorcentaje(precioBase, porcentaje, especialFecha.isEsRecargo());
        }

        DayOfWeek dia = fechaReserva.getDayOfWeek();
        if (dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY) {
            TarifaEspecialEntity tarifaFinde = tarifaEspecialRepository.findByDescripcionIgnoreCase("FIN DE SEMANA").orElse(null);

            if (tarifaFinde != null && tarifaFinde.getPorcentajeTarifa() > 0) {
                int porcentaje = tarifaFinde.getPorcentajeTarifa();
                return aplicarPorcentaje(precioBase, porcentaje, tarifaFinde.isEsRecargo());
            }
        }

        return precioBase;
    }

    public Set<UsuarioEntity> obtenerCumpleaneros(List<UsuarioEntity> usuarios, LocalDate fecha) {
        return usuarios.stream()
                .filter(c -> c.getCumpleanos().getMonth() == fecha.getMonth() && c.getCumpleanos().getDayOfMonth() == fecha.getDayOfMonth())
                .collect(Collectors.toSet());
    }

    public int cumpleanosPermitidos(int cantPersonas){
        int birthdayDiscountsAllowed = 0;
        if (cantPersonas >= 3 && cantPersonas <= 5) {
            birthdayDiscountsAllowed = 1;
        } else if (cantPersonas >= 6 && cantPersonas <= 15) {
            birthdayDiscountsAllowed = 2;
        }
        return birthdayDiscountsAllowed;
    }
}
