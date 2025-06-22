package com.kk.newSubway.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class TravelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long travelId;

    private Long userId;
    private Long startStationId;
    private Long endStationId;
    private LocalDateTime travelDate;
    private Double fare;

}
