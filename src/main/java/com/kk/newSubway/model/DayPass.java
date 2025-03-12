package com.kk.newSubway.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class DayPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dayPassId;

    private Long userId;
    private LocalDateTime purchaseDate;
    private Double price;

    // Getters and Setters
    public Long getDayPassId() {
        return dayPassId;
    }

    public void setDayPassId(Long dayPassId) {
        this.dayPassId = dayPassId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
