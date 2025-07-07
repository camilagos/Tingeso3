package com.example.demo.services;

import com.example.demo.entities.ReservaEntity;
import com.example.demo.entities.UsuarioEntity;
import com.example.demo.repositories.ReservaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.Document;


@Service
public class ReservaService {

    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    KartService kartService;

    @Autowired
    TarifaService tarifaService;

    @Autowired
    TarifaEspecialService tarifaEspecialService;

    @Autowired
    DescuentoGrupoService descuentoGrupoService;

    @Autowired
    DescuentoVisitasService descuentoVisitasService;

    @Autowired
    JavaMailSender mailSender;

    public List<ReservaEntity> getReservasEntreFechas(LocalDateTime startDate, LocalDateTime endDate) {
        return reservaRepository.findByFechaReservaBetween(startDate, endDate);
    }

    public String obtenerNombreUsuario(String rut) {
        UsuarioEntity usuario = usuarioService.getUsuarioByRut(rut);
        if (usuario != null) {
            return usuario.getNombre();
        } else {
            return "Usuario no encontrado";
        }
        /*
        String url = "http://usuario-service/usuario/rut/" + rut;
        try {
            // Realizar la llamada al servicio de usuario
            UsuarioEntity usuario = restTemplate.getForObject(url, UsuarioEntity.class);
            if (usuario != null) {
                return usuario.getNombre();
            } else {
                return "Usuario no encontrado";
            }
        } catch (Exception e) {
            return "Error al obtener el nombre del usuario: " + e.getMessage();
        }*/
    }

    public Integer calcularPrecioBase(int vueltasTiempo) {
        return tarifaService.buscarTarifa(vueltasTiempo);
        /*
        ResponseEntity<Integer> response = restTemplate.exchange(
                "http://tarifa-service/tarifa/calcular/" + vueltasTiempo,
                HttpMethod.GET, null, Integer.class);
        return response.getBody();*/
    }

    public Integer aplicarTarifaEspecial(LocalDate fechaReserva, int precioBase) {
        return tarifaEspecialService.aplicarTarifaEspecial(fechaReserva, precioBase);
        /*
        ResponseEntity<Integer> response = restTemplate.exchange(
                "http://tarifaEspecial-service/tarifaEspecial/calcular/" + fechaReserva + "/" + precioBase,
                HttpMethod.GET, null, Integer.class);
        return response.getBody();*/
    }

    public Object[] obtenerDescuentoGrupo(int cantPersonas) {
        Object desc =  descuentoGrupoService.buscarDescuentoGrupo(cantPersonas);
        if (desc == null) {
            return new Object[0];
        }
        return (Object[]) desc;
        /*
        ResponseEntity<List<Object>> desc = restTemplate.exchange(
                "http://descuentoGrupo-service/descuentoGrupo/calcular/" + cantPersonas,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Object>>() {});
        return desc.getBody();*/
    }


    public Map<UsuarioEntity, Integer> obtenerDescuentoFrecuencia(List<UsuarioEntity> usuarios, LocalDateTime fechaReserva) {
        LocalDateTime inicioMes = fechaReserva.withDayOfMonth(1).toLocalDate().atStartOfDay();
        List<ReservaEntity> reservasMes = getReservasEntreFechas(inicioMes, fechaReserva);

        Map<UsuarioEntity, Integer> descuentos = new HashMap<>();
        for (UsuarioEntity usuario : usuarios) {
            int descuento = descuentoVisitasService.calcularDescuentoVisitas(usuario.getRut(), reservasMes);
            descuentos.put(usuario, descuento);
        }
        return descuentos;
    }


    public Set<UsuarioEntity> obtenerCumpleaneros(List<UsuarioEntity> usuarios, LocalDate fechaReserva) {
        Set<UsuarioEntity> cumpleaneros = tarifaEspecialService.obtenerCumpleaneros(usuarios, fechaReserva);
        if (cumpleaneros == null) {
            return Collections.emptySet();
        }
        return cumpleaneros;
        /*
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<UsuarioEntity>> entity = new HttpEntity<>(usuarios, headers);

        String url = "http://tarifaEspecial-service/tarifaEspecial/cumpleaneros?fechaReserva=" + fechaReserva.toString();

        ResponseEntity<Set<UsuarioEntity>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Set<UsuarioEntity>>() {});

        return response.getBody();*/
    }

    public Integer obtenerCumpleanerosPermitidos(int cantPersonas) {
        return tarifaEspecialService.cumpleanosPermitidos(cantPersonas);

        /*
        ResponseEntity<Integer> response = restTemplate.exchange(
                "http://tarifaEspecial-service/tarifaEspecial/cantCumplesPermitidos/" + cantPersonas,
                HttpMethod.GET, null, Integer.class);
        return response.getBody();*/
    }

    public byte[] generatePDF(ReservaEntity reservation, List<List<Object>> detail) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);

        document.open();

        com.lowagie.text.Font font = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 14, com.lowagie.text.Font.BOLD);
        document.add(new Paragraph("Comprobante de Reserva - KartingRM", font));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Código de reserva: RES-" + reservation.getId()));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String fechaFormateada = reservation.getFechaReserva().format(formatter);
        document.add(new Paragraph("Fecha y hora: " + fechaFormateada));
        document.add(new Paragraph("Número de vueltas o tiempo máximo: " + reservation.getVueltasTiempo()));
        document.add(new Paragraph("Cantidad de personas: " + reservation.getCantPersonas()));
        document.add(new Paragraph("Reservado por: " + obtenerNombreUsuario(reservation.getRutUsuario())));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(8);
        table.setWidthPercentage(100);

        Stream.of(
                "Nombre",
                "Tarifa Base",
                "Desc. Grupo",
                "Desc. Frec./Cumple.",
                "Desc. Aplicado",
                "Subtotal",
                "IVA (19%)",
                "Total"
        ).forEach(h -> {
            PdfPCell cell = new PdfPCell(new Phrase(h));
            cell.setBackgroundColor(Color.LIGHT_GRAY);
            table.addCell(cell);
        });

        for (List<Object> fila : detail) {
            String nombre = String.valueOf(fila.get(0));
            String tarifaBase = String.valueOf(fila.get(1));
            String descGrupo = String.valueOf(fila.get(2));
            String descFrec = String.valueOf(fila.get(3));
            String esCumple = String.valueOf(fila.get(4));
            String descAplicado = String.valueOf(fila.get(5));
            String subtotal = String.valueOf(fila.get(6));
            String iva = String.valueOf(fila.get(7));
            String total = String.valueOf(fila.get(8));

            table.addCell(nombre);
            table.addCell(tarifaBase);
            table.addCell(descGrupo + "%");
            if ("Sí".equals(esCumple)) {
                table.addCell("50% (Cumpleaños)");
            } else {
                table.addCell(descFrec + "%");
            }
            table.addCell(descAplicado + "%");
            table.addCell(subtotal);
            table.addCell(iva);
            table.addCell(total);
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }


    public void sendVoucherByEmail(List<String> emails, byte[] pdf) {
        for (String email : emails) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setTo(email);
                helper.setSubject("Comprobante de Reserva KartingRM");
                helper.setText("Estimado cliente, adjuntamos el comprobante de su reserva en formato PDF. Preséntelo el día de su visita.");
                helper.addAttachment("comprobante_reserva.pdf", new ByteArrayResource(pdf));
                mailSender.send(message);
            } catch (MessagingException e) {
                // Manejo de error por cada destinatario individual
                System.err.println("Error al enviar correo a " + email);
                e.printStackTrace();
            }
        }
    }

    public Boolean isHoliday(LocalDate date) {
        return tarifaEspecialService.isFinDeSemanaOFeriado(date);
        /*
        ResponseEntity<Boolean> response = restTemplate.exchange(
                "http://tarifaEspecial-service/tarifaEspecial/finDeSemanaOFeriado/" + date,
                HttpMethod.GET, null, Boolean.class);
        return response.getBody();*/
    }

    private boolean isWithinWorkingHours(LocalDate date, LocalTime startTime, LocalTime endTime) {
        DayOfWeek day = date.getDayOfWeek();

        LocalTime apertura;
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY || isHoliday(date)) {
            apertura = LocalTime.of(10, 0); // Fin de semana o feriado
        } else {
            apertura = LocalTime.of(14, 0); // Lunes a Viernes
        }
        LocalTime cierre = LocalTime.of(22, 0);

        return !startTime.isBefore(apertura) && !endTime.isAfter(cierre);
    }

    public LocalDateTime calculateEndTime(LocalDateTime start, int vueltasTiempo) {
        int minutos = tarifaService.obtenerTiempoDeReserva(vueltasTiempo);
        return start.plusMinutes(minutos);
        /*
        ResponseEntity<Integer> response = restTemplate.exchange(
                "http://tarifa-service/tarifa/tiempo/" + vueltasTiempo,
                HttpMethod.GET, null, Integer.class);
        int duration = response.getBody();
        return start.plusMinutes(duration);*/
    }

    public Integer cantKartsDisponibles() {
        return kartService.getKartsByDisponibilidad(true).size();
        /*
        ResponseEntity<List> response = restTemplate.exchange(
                "http://kart-service/kart/disponible/" + true,
                HttpMethod.GET, null, List.class);
        return response.getBody().size();*/
    }

    public Integer duracionReserva(int vueltasTiempo) {
        return tarifaService.obtenerTiempoDeReserva(vueltasTiempo);
        /*
        ResponseEntity<Integer> response = restTemplate.exchange(
                "http://tarifa-service/tarifa/tiempo/" + vueltasTiempo,
                HttpMethod.GET,
                null,
                Integer.class
        );

        if (response.getBody() == null) {
            throw new IllegalStateException("No se pudo obtener el tiempo de reserva: respuesta vacía");
        }

        return response.getBody();*/
    }

    public ReservaEntity saveReserva(ReservaEntity reservation) {
        LocalDateTime newStart = reservation.getFechaReserva();
        LocalDateTime newEnd = calculateEndTime(newStart, reservation.getVueltasTiempo());

        // Verificar que el horario esté dentro del horario de atención
        if (!isWithinWorkingHours(newStart.toLocalDate(), newStart.toLocalTime(), newEnd.toLocalTime())) {
            throw new IllegalArgumentException("La reserva está fuera del horario de atención.");
        }

        // Verificar si hay suficientes karts
        int kartsDisponibles = cantKartsDisponibles();
        if (reservation.getCantPersonas() > kartsDisponibles) {
            throw new IllegalArgumentException("No hay suficientes karts disponibles para esta reserva.");
        }

        // Validar que todos los ruts esten registrados
        List<String> allRuts = new ArrayList<>();
        allRuts.add(reservation.getRutUsuario());
        List<String> extraRuts = Arrays.stream(reservation.getRutsUsuarios().split(","))
                .map(String::trim)
                .filter(r -> !r.isEmpty())
                .collect(Collectors.toList());
        allRuts.addAll(extraRuts);

        List<UsuarioEntity> usuarios = usuarioService.getAllUsuariosporRuts(allRuts);
        /*
        // Llamada al microservicio de usuarios
        ResponseEntity<List<UsuarioEntity>> participantesResponse = restTemplate.exchange(
                "http://usuario-service/usuario/ruts/" + String.join(",", allRuts),
                HttpMethod.GET, null, new ParameterizedTypeReference<List<UsuarioEntity>>() {});

        List<UsuarioEntity> usuarios = participantesResponse.getBody();*/

        // Validar que todos los RUTs existan
        if (usuarios == null || usuarios.size() != allRuts.size()) {
            throw new IllegalArgumentException("Uno o más RUTs no están registrados.");
        }

        // Verificar si ya existe una reserva en el mismo horario
        LocalDate date = newStart.toLocalDate();
        List<ReservaEntity> reservations = reservaRepository.findByFechaReservaBetween(
                date.atStartOfDay(),
                date.atTime(23, 59, 59)
        );

        int duracion = duracionReserva(reservation.getVueltasTiempo());

        for (ReservaEntity r : reservations) {
           LocalDateTime start = r.getFechaReserva();
            LocalDateTime end = start.plusMinutes(r.getDuracion());
            if (newStart.isBefore(end) && start.isBefore(newEnd)) {
                throw new IllegalArgumentException("Ya existe una reserva en este horario.");
            }
        }

        // Determinar el precio base
        int precioBase = calcularPrecioBase(reservation.getVueltasTiempo());
        // Aplicar tarifa especial si corresponde
        precioBase = aplicarTarifaEspecial(LocalDate.from(reservation.getFechaReserva()), precioBase);

        Object[] descGrupo = obtenerDescuentoGrupo(reservation.getCantPersonas());

        int groupDiscount = ((Number) descGrupo[0]).intValue();
        String rangoPersonas = descGrupo[1].toString() + "-" + descGrupo[2].toString() + " personas";




        Map<UsuarioEntity, Integer> visitDiscounts = obtenerDescuentoFrecuencia(usuarios, reservation.getFechaReserva());
        Set<UsuarioEntity> birthdayClients = obtenerCumpleaneros(usuarios, LocalDate.from(reservation.getFechaReserva()));
        if (birthdayClients == null) {
            birthdayClients = Collections.emptySet();
        }

        int birthdayDiscountsAllowed = obtenerCumpleanerosPermitidos(reservation.getCantPersonas());

        Set<String> birthdayRuts = birthdayClients.stream()
                .map(UsuarioEntity::getRut)
                .collect(Collectors.toSet());


        List<List<Object>> detailParticipants = new ArrayList<>();
        double totalPaymentWithTax = 0;
        int birthdayApplied = 0;

        // Determinar que descuentos aplicar
        for (UsuarioEntity c : usuarios) {
            double price = precioBase;

            int visitDiscount = visitDiscounts != null ? visitDiscounts.getOrDefault(c, 0) : 0;
            boolean birthday = birthdayRuts.contains(c.getRut()) && birthdayApplied < birthdayDiscountsAllowed;

            int discountApplied = Math.max(groupDiscount, visitDiscount);

            if (birthday) {
                discountApplied = 50; // Prioridad al descuento por cumpleaños
                birthdayApplied++;
            }

            // Aplicar descuento
            price *= (1 - discountApplied / 100.0);

            // Cálculo con IVA
            double iva = price * 0.19;
            double totalWithTax = price + iva;
            totalPaymentWithTax += totalWithTax;

            // Redondear valores a enteros
            long baseRounded = Math.round(precioBase);
            long priceRounded = Math.round(price);
            long ivaRounded = Math.round(iva);
            long totalRounded = Math.round(totalWithTax);


            // Detalle del participante
            detailParticipants.add(List.of(
                    c.getNombre(),
                    baseRounded,
                    groupDiscount,
                    visitDiscount,
                    birthday ? "Sí" : "No",
                    discountApplied,
                    priceRounded,
                    ivaRounded,
                    totalRounded
            ));
        }


        ReservaEntity reservationNew = new ReservaEntity(
                reservation.getRutUsuario(),
                reservation.getRutsUsuarios(),
                reservation.getFechaReserva(),
                reservation.getVueltasTiempo(),
                reservation.getCantPersonas(),
                duracion,
                rangoPersonas,
                null
        );

        // Hacer un json con los detalles de la reserva de cada participante
        ObjectMapper mapper = new ObjectMapper();
        String detailJson = null;
        try {
            detailJson = mapper.writeValueAsString(detailParticipants);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        reservationNew.setDetalleGrupo(detailJson);

        reservationNew = reservaRepository.save(reservationNew);

        // Generar el PDF
        byte[] pdf = generatePDF(reservationNew, detailParticipants);

        // Enviar el voucher por correo electrónico a los participantes
        List<String> emails = usuarios.stream()
                .map(UsuarioEntity::getCorreo)
                .filter(email -> email != null && !email.isBlank())
                .collect(Collectors.toList());

        sendVoucherByEmail(emails, pdf);

        return reservationNew;
    }

    public List<ReservaEntity> getAllReservas() {
        return reservaRepository.findAll();
    }

    public ReservaEntity getReservaByFechaReserva(LocalDateTime fechaReserva) {
        return reservaRepository.findByFechaReserva(fechaReserva);
    }

    public boolean deleteReservation(LocalDateTime date) throws Exception {
        try {
            ReservaEntity reservation = reservaRepository.findByFechaReserva(date);
            if (reservation == null) {
                throw new Exception("No se encontró la reserva con la fecha proporcionada.");
            }
            Long id = reservation.getId();
            reservaRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

}
