package com.kk.newSubway.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketPurchaseConfirmationDTO {

    private Long transactionID;
    private int startStationId;
    private int endStationId;
    private LocalDateTime timestamp;

}
