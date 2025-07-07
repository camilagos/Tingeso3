package com.example.demo.repositories;

import com.example.demo.entities.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    UsuarioEntity findByRut(String rut);
    UsuarioEntity findByCorreoAndContrasenaAndRut(String correo, String contrasena, String rut);
    List<UsuarioEntity> findAllByRutIn(List<String> ruts);
}
