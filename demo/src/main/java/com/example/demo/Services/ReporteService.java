package com.example.demo.Services;

import com.example.demo.Entities.ReporteEntity;
import com.example.demo.Entities.ReservaEntity;
import com.example.demo.Repositories.ReporteRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    ReporteRepository reporteRepository;

    @Autowired
    ReservaService reservaService;

    public final ObjectMapper mapper = new ObjectMapper();

    public String getMonth(String yyyyMM) {
        Month month = Month.of(Integer.parseInt(yyyyMM.substring(5)));
        return month.getDisplayName(TextStyle.FULL, new Locale("es"));
    }

    public List<ReservaEntity> obtenerReservasEntreFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        List<ReservaEntity> reservas = reservaService.getReservasEntreFechas(fechaInicio, fechaFin);
        if (reservas == null || reservas.isEmpty()) {
            return Collections.emptyList();
        }
        return reservas;
        /*DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        String url = String.format("http://reserva-service/reserva/entreFechas/%s/%s",
                fechaInicio.format(formatter),
                fechaFin.format(formatter));

        ResponseEntity<List<ReservaEntity>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ReservaEntity>>() {}
        );

        return response.getBody();*/
    }


    public Map<String, Map<String, Double>> incomeFromLapsOrTime(LocalDate fechaInicio, LocalDate fechaFin) {
        List<ReservaEntity> reservations = obtenerReservasEntreFechas(fechaInicio.atStartOfDay(), fechaFin.atTime(23, 59));

        Map<String, Map<String, Double>> intermediate = new TreeMap<>();
        for (ReservaEntity r : reservations) {
            String monthReservation = r.getFechaReserva().getYear() + "-" + String.format("%02d", r.getFechaReserva().getMonthValue());
            String lapsOrTimeReservation = r.getVueltasTiempo() + " vueltas o máx. " + r.getVueltasTiempo() + " minutos";

            double totalReservation = 0;
            try {
                List<List<Object>> detail = mapper.readValue(r.getDetalleGrupo(), new TypeReference<List<List<Object>>>() {});
                for (List<Object> row : detail) {
                    if (!row.isEmpty()) {
                        Object tarifa = row.get(row.size() - 1);
                        if (tarifa instanceof Number) {
                            totalReservation += Math.round(((Number) tarifa).doubleValue());
                        }
                    }
                }
            } catch (Exception e) {
                continue;
            }

            intermediate.computeIfAbsent(lapsOrTimeReservation, k -> new TreeMap<>());
            intermediate.get(lapsOrTimeReservation).put(monthReservation,
                    intermediate.get(lapsOrTimeReservation).getOrDefault(monthReservation, 0.0) + totalReservation);
        }

        Set<String> allMonths = new TreeSet<>();
        LocalDate current = fechaInicio.withDayOfMonth(1);
        while (!current.isAfter(fechaFin.withDayOfMonth(1))) {
            allMonths.add(current.getYear() + "-" + String.format("%02d", current.getMonthValue()));
            current = current.plusMonths(1);
        }

        // Categorías requeridas por el enunciado
        Set<String> predefinedLapsCategories = Set.of(
                "10 vueltas o máx. 10 minutos",
                "15 vueltas o máx. 15 minutos",
                "20 vueltas o máx. 20 minutos"
        );

        // Combinar categorías predefinidas con las encontradas en las reservas
        Set<String> allLapsCategories = new TreeSet<>(predefinedLapsCategories);
        allLapsCategories.addAll(intermediate.keySet());

        Map<String, Map<String, Double>> result = new LinkedHashMap<>();
        Map<String, Double> totalPerMonth = new TreeMap<>();

        for (String row : allLapsCategories) {
            Map<String, Double> rowData = new LinkedHashMap<>();
            double totalRow = 0;
            for (String month : allMonths) {
                double value = intermediate.getOrDefault(row, Collections.emptyMap()).getOrDefault(month, 0.0);
                double roundedValue = Math.round(value);
                rowData.put(getMonth(month), roundedValue);
                totalPerMonth.put(getMonth(month), totalPerMonth.getOrDefault(getMonth(month), 0.0) + roundedValue);
                totalRow += roundedValue;
            }
            rowData.put("Total", (double) Math.round(totalRow));
            result.put(row, rowData);
        }

        Map<String, Double> totalRows = new LinkedHashMap<>();
        double total = 0;
        for (String nameMonth : allMonths.stream().map(this::getMonth).collect(Collectors.toList())) {
            double valorMes = totalPerMonth.getOrDefault(nameMonth, 0.0);
            double roundedValorMes = Math.round(valorMes);
            totalRows.put(nameMonth, roundedValorMes);
            total += roundedValorMes;
        }
        totalRows.put("Total", (double) Math.round(total));
        result.put("TOTAL", totalRows);

        try {
            String jsonDetalle = mapper.writeValueAsString(result);
            ReporteEntity reporte = new ReporteEntity();
            reporte.setTipo("Número de Vueltas o Tiempo Máximo");
            reporte.setFechaInicio(fechaInicio);
            reporte.setFechaFin(fechaFin);
            reporte.setDetalle(jsonDetalle);
            reporteRepository.save(reporte);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }


    public Map<String, Map<String, Double>> incomePerPerson(LocalDate fechaInicio, LocalDate fechaFin) {
        List<ReservaEntity> reservations = obtenerReservasEntreFechas(fechaInicio.atStartOfDay(), fechaFin.atTime(23, 59));

        Map<String, Map<String, Double>> intermediate = new TreeMap<>();
        for (ReservaEntity r : reservations) {
            String monthReservation = r.getFechaReserva().getYear() + "-" + String.format("%02d", r.getFechaReserva().getMonthValue());

            String range = r.getRangoPersonas();
            if (range == null || range.isBlank()) {
                range = "Sin rango definido";
            }

            double totalReservation = 0;
            try {
                List<List<Object>> detail = mapper.readValue(r.getDetalleGrupo(), new TypeReference<List<List<Object>>>() {});
                for (List<Object> row : detail) {
                    if (!row.isEmpty()) {
                        Object tarifa = row.get(row.size() - 1);
                        if (tarifa instanceof Number) {
                            totalReservation += Math.round(((Number) tarifa).doubleValue());
                        }
                    }
                }
            } catch (Exception e) {
                continue;
            }

            intermediate.computeIfAbsent(range, k -> new TreeMap<>());
            intermediate.get(range).put(monthReservation,
                    intermediate.get(range).getOrDefault(monthReservation, 0.0) + totalReservation);
        }

        Set<String> allMonths = new TreeSet<>();
        LocalDate current = fechaInicio.withDayOfMonth(1);
        while (!current.isAfter(fechaFin.withDayOfMonth(1))) {
            allMonths.add(current.getYear() + "-" + String.format("%02d", current.getMonthValue()));
            current = current.plusMonths(1);
        }

        // Lista ordenada de categorías predefinidas (según enunciado)
        List<String> orderedPredefinedRanges = Arrays.asList(
                "1-2 personas",
                "3-5 personas",
                "6-10 personas",
                "11-15 personas"
        );

        // Rango encontrados en reservas
        Set<String> detectedRanges = new TreeSet<>(intermediate.keySet());

        // Crear lista final manteniendo orden predefinido, y agregando extras al final
        List<String> allGroupCategories = new ArrayList<>(orderedPredefinedRanges);
        for (String extra : detectedRanges) {
            if (!orderedPredefinedRanges.contains(extra)) {
                allGroupCategories.add(extra);
            }
        }

        Map<String, Map<String, Double>> result = new LinkedHashMap<>();
        Map<String, Double> totalPerMonth = new TreeMap<>();

        for (String row : allGroupCategories) {
            Map<String, Double> rowData = new LinkedHashMap<>();
            double totalRow = 0;
            for (String month : allMonths) {
                double value = intermediate.getOrDefault(row, Collections.emptyMap()).getOrDefault(month, 0.0);
                double roundedValue = Math.round(value);
                rowData.put(getMonth(month), roundedValue);
                totalPerMonth.put(getMonth(month), totalPerMonth.getOrDefault(getMonth(month), 0.0) + roundedValue);
                totalRow += roundedValue;
            }
            rowData.put("Total", (double) Math.round(totalRow));
            result.put(row, rowData);
        }

        Map<String, Double> totalRows = new LinkedHashMap<>();
        double total = 0;
        for (String nameMonth : allMonths.stream().map(this::getMonth).collect(Collectors.toList())) {
            double monthValue = totalPerMonth.getOrDefault(nameMonth, 0.0);
            double roundedMonthValue = Math.round(monthValue);
            totalRows.put(nameMonth, roundedMonthValue);
            total += roundedMonthValue;
        }
        totalRows.put("Total", (double) Math.round(total));
        result.put("TOTAL", totalRows);

        try {
            String jsonDetalle = mapper.writeValueAsString(result);
            ReporteEntity reporte = new ReporteEntity();
            reporte.setTipo("Número de Personas");
            reporte.setFechaInicio(fechaInicio);
            reporte.setFechaFin(fechaFin);
            reporte.setDetalle(jsonDetalle);
            reporteRepository.save(reporte);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }



}
