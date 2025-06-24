package com.example.demo.Repositories;

import com.example.demo.Entities.TarifaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarifaRepository extends JpaRepository<TarifaEntity, Integer> {
    public TarifaEntity findByTiempoVueltas(int tiempoVueltas);
}
