package com.kk.newSubway.controller;

import com.kk.newSubway.model.Station;
import com.kk.newSubway.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationService stationService;

    @Autowired
    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @PostMapping("add-station")
    public Station addStation(@RequestBody Station station) { return stationService.addStation(station); }

    @GetMapping
    public List<Station> getAllStations() { return stationService.getAllStations(); }

}
