package com.kk.newSubway.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stationId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "zone_id", nullable = false) // Foreign key column in 'stations' table
    private Zone zone;
}
