package com.example.demo.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String correo;
    private String rut;
    private String contrasena;
    private LocalDate cumpleanos;
    private boolean admin;

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public String getRut() {
        return rut;
    }

    public String getContrasena() {
        return contrasena;
    }

    public LocalDate getCumpleanos() {
        return cumpleanos;
    }

    public boolean isAdmin() {
        return admin;
    }
}
