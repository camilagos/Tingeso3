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
public class DescuentoGrupoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int minPersonas;
    private int maxPersonas;
    private int descuento;

    public int getId() {
        return id;
    }

    public int getMinPersonas() {
        return minPersonas;
    }

    public int getMaxPersonas() {
        return maxPersonas;
    }

    public int getDescuento() {
        return descuento;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setMinPersonas(int minPersonas) {
        this.minPersonas = minPersonas;
    }

    public void setMaxPersonas(int maxPersonas) {
        this.maxPersonas = maxPersonas;
    }

    public void setDescuento(int descuento) {
        this.descuento = descuento;
    }
}
