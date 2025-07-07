package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TarifaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int tiempoVueltas;
    private int precio;
    private int duracionReserva;

    public int getId() {
        return id;
    }

    public int getTiempoVueltas() {
        return tiempoVueltas;
    }

    public int getPrecio() {
        return precio;
    }

    public int getDuracionReserva() {
        return duracionReserva;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTiempoVueltas(int tiempoVueltas) {
        this.tiempoVueltas = tiempoVueltas;
    }

    public void setPrecio(int precio) {
        this.precio = precio;
    }

    public void setDuracionReserva(int duracionReserva) {
        this.duracionReserva = duracionReserva;
    }
}
