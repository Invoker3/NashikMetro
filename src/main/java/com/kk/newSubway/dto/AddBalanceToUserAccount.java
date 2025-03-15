package com.kk.newSubway.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBalanceToUserAccount {

    private Long userId;
    private Double amount;

}
