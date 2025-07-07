package com.example.demo.services;

import com.example.demo.repositories.UsuarioRepository;
import com.example.demo.entities.UsuarioEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioEntity saveUsuario(UsuarioEntity usuario) {
        UsuarioEntity usuarioRut = usuarioRepository.findByRut(usuario.getRut());
        if (usuarioRut != null) {
            throw new IllegalArgumentException("Ya existe un usuario con ese RUT");
        }
        return usuarioRepository.save(usuario);
    }


    public UsuarioEntity getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public boolean deleteUsuario(Long id) throws Exception {
        try {
            usuarioRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public UsuarioEntity getUsuarioByRut(String rut) {
        return usuarioRepository.findByRut(rut);
    }

    public UsuarioEntity login(UsuarioEntity usuario) {
        UsuarioEntity user = usuarioRepository.findByCorreoAndContrasenaAndRut(usuario.getCorreo(), usuario.getContrasena(), usuario.getRut());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo, rut o contraseña incorrectos");
        }
        return user;
    }

    public List<UsuarioEntity> getAllUsuariosporRuts(List<String> ruts) {
        List<UsuarioEntity> usuarios = usuarioRepository.findAllByRutIn(ruts);
        if (usuarios.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontraron usuarios con los RUT proporcionados");
        }
        return usuarios;
    }
}
