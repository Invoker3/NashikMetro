package com.kk.newSubway.controller;

import com.kk.newSubway.model.Station;
import com.kk.newSubway.model.Zone;
import com.kk.newSubway.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @PostMapping("/add-zone")
    public ResponseEntity<?> addZone(@RequestBody Zone zone) {
        return zoneService.addZone(zone);
    }

    @GetMapping()
    public ResponseEntity<?> getAllZones() {
        return zoneService.getAllZones();
    }

    @PostMapping("/delete-zone")
    public ResponseEntity<?> deleteZone(@RequestBody Zone zone) {
        return zoneService.deleteZone(zone);
    }


}
