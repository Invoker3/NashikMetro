package com.kk.newSubway.service;

import com.kk.newSubway.model.Station;
import com.kk.newSubway.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;

    @Autowired
    StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public Station addStation(Station station) {
        return stationRepository.save(station);
    }

    public List<Station> getAllStations() { return stationRepository.findAll(); }

}
