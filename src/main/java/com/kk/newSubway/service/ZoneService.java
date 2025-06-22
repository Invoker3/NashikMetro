package com.kk.newSubway.service;

import com.kk.newSubway.model.Zone;
import com.kk.newSubway.repository.ZoneRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;

    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public ResponseEntity<?> addZone(Zone zone) {
        zoneRepository.save(zone);
        return ResponseEntity.ok(zone);
    }

    public ResponseEntity<?> deleteZone(Zone zone) {
        Zone zoneToRemove = zoneRepository.findById(zone.getZoneId()).orElse(null);
        if(zoneToRemove != null) {
            zoneRepository.delete(zone);
            return ResponseEntity.ok(zone);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Zone not found.");
        }
    }

    public ResponseEntity<List<Zone>> getAllZones() { return ResponseEntity.ok(zoneRepository.findAll()); }
}
