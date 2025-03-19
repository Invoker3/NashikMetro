package com.kk.newSubway.controller;

import com.kk.newSubway.service.FareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fare")
public class FareController {

    @Autowired
    private FareService fareService;

    @PostMapping("/calculate")
    public double calculateFare(@RequestParam int startStationId, @RequestParam int endStationId) {
        return fareService.calculateFare(startStationId, endStationId);
    }
}
