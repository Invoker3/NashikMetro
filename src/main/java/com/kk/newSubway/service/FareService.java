package com.kk.newSubway.service;

import com.kk.newSubway.model.Station;
import com.kk.newSubway.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FareService {

    @Autowired
    private StationRepository stationRepository;

    public double calculateFare(Long startStationId, Long endStationId) {
        Station startStation = stationRepository.findById(startStationId).orElseThrow();
        Station endStation = stationRepository.findById(endStationId).orElseThrow();

        int startZone = startStation.getZoneId().intValue();
        int endZone = endStation.getZoneId().intValue();
        double baseFare = 2.0; // Base fare within a zone
        double zoneFare = 1.0; // Additional fare per zone

        if (startZone == endZone) {
            return baseFare;
        } else {
            int zonesCrossed = Math.abs(startZone - endZone);
            return baseFare + (zonesCrossed * zoneFare);
        }
    }
}
