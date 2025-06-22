package com.kk.newSubway.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class DayPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dayPassId;

    private Long userId;
    private LocalDateTime purchaseDate;
    private Double price;

}
