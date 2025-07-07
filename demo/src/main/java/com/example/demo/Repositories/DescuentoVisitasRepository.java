package com.example.demo.repositories;

import com.example.demo.entities.DescuentoVisitasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescuentoVisitasRepository extends JpaRepository<DescuentoVisitasEntity, Integer> {
    DescuentoVisitasEntity findByMinVisitasLessThanEqualAndMaxVisitasGreaterThanEqual(int minVisitas, int maxVisitas);
}
