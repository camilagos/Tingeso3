package com.example.demo.services;

import com.example.demo.entities.KartEntity;
import com.example.demo.repositories.KartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KartService {

    @Autowired
    KartRepository kartRepository;

    public KartEntity saveKart(KartEntity kart) {
        return kartRepository.save(kart);
    }

    public List<KartEntity> getKartsByDisponibilidad(boolean disponible) {
        return kartRepository.findByDisponible(disponible);
    }

    public KartEntity updateKart(KartEntity kart) {
        return kartRepository.save(kart);
    }

    public boolean deleteKart(Long id) throws Exception {
        try {
            kartRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}
