package com.example.demo.Services;

import com.example.demo.Entities.DescuentoVisitasEntity;
import com.example.demo.Entities.ReservaEntity;
import com.example.demo.Repositories.DescuentoVisitasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
public class DescuentoVisitasService {

    @Autowired
    DescuentoVisitasRepository descuentoVisitasRepository;

    @Autowired
    ReservaService reservaService;

    public DescuentoVisitasEntity saveDescuentoVisitas(DescuentoVisitasEntity descuentoVisitas) {
        return descuentoVisitasRepository.save(descuentoVisitas);
    }

    public List<DescuentoVisitasEntity> getAllDescuentosVisitas() {
        return descuentoVisitasRepository.findAll();
    }

    public DescuentoVisitasEntity updateDescuentoVisitas(int id, DescuentoVisitasEntity descuentoVisitas) {
        DescuentoVisitasEntity existingDescuento = descuentoVisitasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DescuentoVisitas not found with id: " + id));

        existingDescuento.setCategoria(descuentoVisitas.getCategoria());
        existingDescuento.setMinVisitas(descuentoVisitas.getMinVisitas());
        existingDescuento.setMaxVisitas(descuentoVisitas.getMaxVisitas());
        existingDescuento.setDescuento(descuentoVisitas.getDescuento());

        return descuentoVisitasRepository.save(existingDescuento);
    }

    public boolean deleteDescuentoVisitas(int id) throws Exception {
        try {
            descuentoVisitasRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }


    public int buscarDescuentoVisitas(String rut, LocalDateTime fechaReserva) {
        LocalDateTime inicio = fechaReserva.withDayOfMonth(1).toLocalDate().atStartOfDay();

        List<ReservaEntity> reservas = reservaService.getReservasEntreFechas(inicio, fechaReserva);
        /*
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        String inicio = fechaReserva.withDayOfMonth(1).toLocalDate().atStartOfDay().format(formatter);
        String fin = fechaReserva.format(formatter);

        String url = "http://reserva-service/reserva/entreFechas/" + inicio + "/" + fin;

        List<ReservaEntity> reservas;
        try {
            reservas = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ReservaEntity>>() {}).getBody();
        } catch (Exception e) {
            System.err.println("Error al consultar reservas: " + e.getMessage());
            return 0; // Sin reservas, sin descuento
        }*/

        if (reservas == null || reservas.isEmpty()) {
            System.out.println("No se encontraron reservas para el rango: " + inicio + " a " + fechaReserva);
            return 0;
        }

        int contador = 0;

        for (ReservaEntity reserva : reservas) {
            boolean isMainCustomer = rut.equals(reserva.getRutUsuario());

            boolean isInParticipants = false;
            if (reserva.getRutsUsuarios() != null && !reserva.getRutsUsuarios().isBlank()) {
                isInParticipants = Arrays.stream(reserva.getRutsUsuarios().split(","))
                        .map(String::trim)
                        .anyMatch(rut::equals);
            }

            if (isMainCustomer || isInParticipants) {
                contador++;
            }
        }

        DescuentoVisitasEntity desc = descuentoVisitasRepository
                .findByMinVisitasLessThanEqualAndMaxVisitasGreaterThanEqual(contador, contador);

        if (desc == null) {
            System.out.println("No se encontró descuento para " + contador + " visitas.");
            return 0;
        }

        return desc.getDescuento();
    }


}
