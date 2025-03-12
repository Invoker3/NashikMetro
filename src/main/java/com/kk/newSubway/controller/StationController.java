package com.kk.newSubway.controller;

import com.kk.newSubway.model.Station;
import com.kk.newSubway.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @PostMapping
    public Station addStation(@RequestBody Station station) {
        return stationService.addStation(station);
    }

    @GetMapping
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }
}
