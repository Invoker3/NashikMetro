package com.kk.newSubway.model;


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
@Table(name = "journey_tickets")
public class JourneyTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long journeyId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Foreign key reference
    private User user;

    private int startStationId;
    private int endStationId;
    private LocalDateTime timestamp;


}
