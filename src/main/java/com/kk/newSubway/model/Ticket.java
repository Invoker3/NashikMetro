package com.kk.newSubway.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long journeyId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Foreign key reference
    @JsonIgnore
    private User user;

    private int startStationId;
    private int endStationId;
    private LocalDateTime timestamp;

}
