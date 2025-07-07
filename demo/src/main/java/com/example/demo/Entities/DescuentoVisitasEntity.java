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
public class DescuentoVisitasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String categoria;
    private int minVisitas;
    private int maxVisitas;
    private int descuento;

    public int getId() {
        return id;
    }

    public String getCategoria() {
        return categoria;
    }

    public int getMinVisitas() {
        return minVisitas;
    }

    public int getMaxVisitas() {
        return maxVisitas;
    }

    public int getDescuento() {
        return descuento;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setMinVisitas(int minVisitas) {
        this.minVisitas = minVisitas;
    }

    public void setMaxVisitas(int maxVisitas) {
        this.maxVisitas = maxVisitas;
    }

    public void setDescuento(int descuento) {
        this.descuento = descuento;
    }
}
