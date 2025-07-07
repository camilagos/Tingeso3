package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TarifaEspecialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private LocalDate fecha;
    private int porcentajeTarifa;
    private String descripcion;
    private boolean esRecargo;

    public int getId() {
        return id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public int getPorcentajeTarifa() {
        return porcentajeTarifa;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public boolean isEsRecargo() {
        return esRecargo;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setPorcentajeTarifa(int porcentajeTarifa) {
        this.porcentajeTarifa = porcentajeTarifa;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setEsRecargo(boolean esRecargo) {
        this.esRecargo = esRecargo;
    }
}
