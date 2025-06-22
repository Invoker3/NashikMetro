package com.kk.newSubway.controller;

import com.kk.newSubway.model.Zone;
import com.kk.newSubway.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    private final ZoneService zoneService;

    @Autowired
    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @PostMapping("/add-zone")
    public ResponseEntity<?> addZone(@RequestBody Zone zone) { return zoneService.addZone(zone); }

    @GetMapping()
    public ResponseEntity<?> getAllZones() { return zoneService.getAllZones(); }

    @PostMapping("/delete-zone")
    public ResponseEntity<?> deleteZone(@RequestBody Zone zone) { return zoneService.deleteZone(zone); }


}
