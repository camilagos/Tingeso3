package com.example.demo.Controllers;

import com.example.demo.Services.RackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rack")
@CrossOrigin("*")
public class RackController {

    @Autowired
    RackService rackService;

    @GetMapping("/")
    public List<Map<String, Object>> getReservas() {
        return rackService.getAllReservationsByDuration();
    }
}
