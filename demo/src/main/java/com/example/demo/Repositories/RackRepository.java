package com.example.demo.Repositories;

import com.example.demo.Entities.RackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RackRepository extends JpaRepository<RackEntity, Long> {

}
