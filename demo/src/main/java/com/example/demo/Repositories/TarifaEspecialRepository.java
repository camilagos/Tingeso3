package com.example.demo.Repositories;

import com.example.demo.Entities.TarifaEspecialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TarifaEspecialRepository extends JpaRepository<TarifaEspecialEntity, Integer> {
    Optional<TarifaEspecialEntity> findByFecha(LocalDate fecha);

    Optional<TarifaEspecialEntity> findByDescripcionIgnoreCase(String descripcion);
}
