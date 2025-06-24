package com.example.demo.Services;


import com.example.demo.Entities.TarifaEntity;
import com.example.demo.Repositories.TarifaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarifaService {

    @Autowired
    TarifaRepository tarifaRepository;

    public TarifaEntity saveTarifa(TarifaEntity tarifa) {
        return tarifaRepository.save(tarifa);
    }

    public List<TarifaEntity> getAllTarifas() {
        return tarifaRepository.findAll();
    }

    public TarifaEntity updateTarifa(int id, TarifaEntity tarifa) {
        TarifaEntity existingTarifa = tarifaRepository.findById(id).orElse(null);
        if (existingTarifa != null) {
            existingTarifa.setTiempoVueltas(tarifa.getTiempoVueltas());
            existingTarifa.setPrecio(tarifa.getPrecio());
            existingTarifa.setDuracionReserva(tarifa.getDuracionReserva());
            return tarifaRepository.save(existingTarifa);
        } else {
            return null; // or throw an exception
        }
    }

    public boolean deleteTarifa(int id) throws Exception {
        try {
            tarifaRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public int buscarTarifa (int tiempoVueltas) {
        TarifaEntity tarifa = tarifaRepository.findByTiempoVueltas(tiempoVueltas);
        return tarifa.getPrecio();
    }

    public int obtenerTiempoDeReserva(int tiempoVueltas) {
        TarifaEntity tarifa = tarifaRepository.findByTiempoVueltas(tiempoVueltas);
        return tarifa.getDuracionReserva();
    }
}
