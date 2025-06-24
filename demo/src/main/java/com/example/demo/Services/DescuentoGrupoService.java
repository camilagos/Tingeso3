package com.example.demo.Services;

import com.example.demo.Entities.DescuentoGrupoEntity;
import com.example.demo.Repositories.DescuentoGrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DescuentoGrupoService {

    @Autowired
    DescuentoGrupoRepository descuentoGrupoRepository;

    public DescuentoGrupoEntity saveDescuentoGrupo(DescuentoGrupoEntity descuentoGrupo) {
        return descuentoGrupoRepository.save(descuentoGrupo);
    }

    public List<DescuentoGrupoEntity> getAllDescuentosGrupo() {
        return descuentoGrupoRepository.findAll();
    }

    public DescuentoGrupoEntity updateDescuentoGrupo(int id, DescuentoGrupoEntity descuentoGrupo) {
        DescuentoGrupoEntity existingDescuentoGrupo = descuentoGrupoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DescuentoGrupo not found with id: " + id));
        existingDescuentoGrupo.setMinPersonas(descuentoGrupo.getMinPersonas());
        existingDescuentoGrupo.setMaxPersonas(descuentoGrupo.getMaxPersonas());
        existingDescuentoGrupo.setDescuento(descuentoGrupo.getDescuento());
        return descuentoGrupoRepository.save(existingDescuentoGrupo);
    }

    public boolean deleteDescuentoGrupo(int id) throws Exception {
        try {
            descuentoGrupoRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public Object[] buscarDescuentoGrupo(int cantPersonas) {
        DescuentoGrupoEntity descuentoGrupo = descuentoGrupoRepository.findByMinPersonasLessThanEqualAndMaxPersonasGreaterThanEqual(cantPersonas, cantPersonas);
        int descuento = descuentoGrupo.getDescuento();
        int min = descuentoGrupo.getMinPersonas();
        int max = descuentoGrupo.getMaxPersonas();
        return new Object[]{descuento, min, max};
    }
}
