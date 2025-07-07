package com.example.demo.repositories;

import com.example.demo.entities.DescuentoGrupoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DescuentoGrupoRepository extends JpaRepository<DescuentoGrupoEntity, Integer> {
    DescuentoGrupoEntity findByMinPersonasLessThanEqualAndMaxPersonasGreaterThanEqual(int minPersonas, int maxPersonas);
}
