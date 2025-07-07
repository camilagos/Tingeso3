package com.example.demo.repositories;

import com.example.demo.entities.KartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KartRepository extends JpaRepository<KartEntity, Long> {
    List<KartEntity> findByDisponible (boolean disponible);
}
