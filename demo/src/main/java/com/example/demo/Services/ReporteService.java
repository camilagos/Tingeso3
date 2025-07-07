package com.example.demo.services;

import com.example.demo.entities.ReporteEntity;
import com.example.demo.entities.ReservaEntity;
import com.example.demo.repositories.ReporteRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

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
            String monthKey = r.getFechaReserva().getYear() + "-" + String.format("%02d", r.getFechaReserva().getMonthValue());
            String displayMonth = getMonth(monthKey) + " " + monthKey.substring(0, 4);
            String category = r.getVueltasTiempo() + " vueltas o máx. " + r.getVueltasTiempo() + " minutos";

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

            intermediate.computeIfAbsent(category, k -> new TreeMap<>());
            intermediate.get(category).put(displayMonth,
                    intermediate.get(category).getOrDefault(displayMonth, 0.0) + totalReservation);
        }

        Set<String> allMonthKeys = new TreeSet<>();
        LocalDate current = fechaInicio.withDayOfMonth(1);
        while (!current.isAfter(fechaFin.withDayOfMonth(1))) {
            String key = current.getYear() + "-" + String.format("%02d", current.getMonthValue());
            allMonthKeys.add(key);
            current = current.plusMonths(1);
        }

        Set<String> predefinedLapsCategories = Set.of(
                "10 vueltas o máx. 10 minutos",
                "15 vueltas o máx. 15 minutos",
                "20 vueltas o máx. 20 minutos"
        );
        Set<String> allCategories = new TreeSet<>(predefinedLapsCategories);
        allCategories.addAll(intermediate.keySet());

        Map<String, Map<String, Double>> result = new LinkedHashMap<>();
        Map<String, Double> totalPerMonth = new TreeMap<>();

        for (String row : allCategories) {
            Map<String, Double> rowData = new LinkedHashMap<>();
            double totalRow = 0;
            for (String monthKey : allMonthKeys) {
                String displayMonth = getMonth(monthKey) + " " + monthKey.substring(0, 4);
                double value = intermediate.getOrDefault(row, Collections.emptyMap()).getOrDefault(displayMonth, 0.0);
                double roundedValue = Math.round(value);
                rowData.put(displayMonth, roundedValue);
                totalPerMonth.put(displayMonth, totalPerMonth.getOrDefault(displayMonth, 0.0) + roundedValue);
                totalRow += roundedValue;
            }
            rowData.put("Total", Double.valueOf(Math.round(totalRow)));
            result.put(row, rowData);
        }

        Map<String, Double> totalRows = new LinkedHashMap<>();
        double total = 0;
        for (String monthKey : allMonthKeys) {
            String displayMonth = getMonth(monthKey) + " " + monthKey.substring(0, 4);
            double monthTotal = totalPerMonth.getOrDefault(displayMonth, 0.0);
            totalRows.put(displayMonth, monthTotal);
            total += monthTotal;
        }
        totalRows.put("Total", Double.valueOf(Math.round(total)));
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
            String monthKey = r.getFechaReserva().getYear() + "-" + String.format("%02d", r.getFechaReserva().getMonthValue());
            String displayMonth = getMonth(monthKey) + " " + monthKey.substring(0, 4);
            String range = r.getRangoPersonas();
            if (range == null || range.isBlank()) range = "Sin rango definido";

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
            intermediate.get(range).put(displayMonth,
                    intermediate.get(range).getOrDefault(displayMonth, 0.0) + totalReservation);
        }

        Set<String> allMonthKeys = new TreeSet<>();
        LocalDate current = fechaInicio.withDayOfMonth(1);
        while (!current.isAfter(fechaFin.withDayOfMonth(1))) {
            String key = current.getYear() + "-" + String.format("%02d", current.getMonthValue());
            allMonthKeys.add(key);
            current = current.plusMonths(1);
        }

        List<String> orderedPredefinedRanges = Arrays.asList(
                "1-2 personas",
                "3-5 personas",
                "6-10 personas",
                "11-15 personas"
        );
        Set<String> detectedRanges = new TreeSet<>(intermediate.keySet());
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
            for (String monthKey : allMonthKeys) {
                String displayMonth = getMonth(monthKey) + " " + monthKey.substring(0, 4);
                double value = intermediate.getOrDefault(row, Collections.emptyMap()).getOrDefault(displayMonth, 0.0);
                double roundedValue = Math.round(value);
                rowData.put(displayMonth, roundedValue);
                totalPerMonth.put(displayMonth, totalPerMonth.getOrDefault(displayMonth, 0.0) + roundedValue);
                totalRow += roundedValue;
            }
            rowData.put("Total", Double.valueOf(Math.round(totalRow)));
            result.put(row, rowData);
        }

        Map<String, Double> totalRows = new LinkedHashMap<>();
        double total = 0;
        for (String monthKey : allMonthKeys) {
            String displayMonth = getMonth(monthKey) + " " + monthKey.substring(0, 4);
            double monthValue = totalPerMonth.getOrDefault(displayMonth, 0.0);
            totalRows.put(displayMonth, Double.valueOf(Math.round(monthValue)));
            total += monthValue;
        }
        totalRows.put("Total", Double.valueOf(Math.round(total)));
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
