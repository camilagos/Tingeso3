package com.example.demo.Repositories;

import com.example.demo.Entities.DescuentoVisitasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescuentoVisitasRepository extends JpaRepository<DescuentoVisitasEntity, Integer> {
    DescuentoVisitasEntity findByMinVisitasLessThanEqualAndMaxVisitasGreaterThanEqual(int minVisitas, int maxVisitas);
}
