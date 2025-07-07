package com.example.demo.repositories;

import com.example.demo.entities.TarifaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarifaRepository extends JpaRepository<TarifaEntity, Integer> {
    public TarifaEntity findByTiempoVueltas(int tiempoVueltas);
}
