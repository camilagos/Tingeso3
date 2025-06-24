package com.example.demo.Services;

import org.apache.poi.sl.draw.geom.GuideIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.Entities.ReservaEntity;
import com.example.demo.Entities.UsuarioEntity;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RackService {

    @Autowired
    ReservaService reservaService;

    @Autowired
    UsuarioService usuarioService;

    public List<ReservaEntity> obtenerReservas() {
        List<ReservaEntity> reservas = reservaService.getAllReservas();
        if (reservas == null || reservas.isEmpty()) {
            return Collections.emptyList();
        }
        return reservas;
        /*
        String url = "http://reserva-service/reserva/all";
        ResponseEntity<List<ReservaEntity>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ReservaEntity>>() {}
        );
        return response.getBody();*/
    }

    public List<Map<String, Object>> getAllReservationsByDuration() {
        List<ReservaEntity> reservations = obtenerReservas();

        List<Map<String, Object>> result = new ArrayList<>();

        for (ReservaEntity r : reservations) {
            LocalDateTime start = r.getFechaReserva();
            int laps = r.getVueltasTiempo();
            int duration = r.getDuracion();

            LocalDateTime end = start.plusMinutes(duration);

            UsuarioEntity usuario = usuarioService.getUsuarioByRut(r.getRutUsuario());

            /*ResponseEntity<UsuarioEntity> response2 = restTemplate.exchange(
                    "http://usuario-service/usuario/rut/" + r.getRutUsuario(),
                    HttpMethod.GET,
                    null,
                    UsuarioEntity.class
            );

            Optional<UsuarioEntity> user = Optional.ofNullable(response2.getBody());*/


            Map<String, Object> reservation = new HashMap<>();
            reservation.put("start", start.toString());
            reservation.put("end", end.toString());
            reservation.put("title", usuario.getNombre());

            result.add(reservation);
        }

        return result;
    }
}
