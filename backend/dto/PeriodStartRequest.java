package com.koneko.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class PeriodStartRequest {

    @NotNull(message = "Period start date is required.")
    private LocalDate periodStartDate;

    public PeriodStartRequest() {
    }

    public LocalDate getPeriodStartDate() {
        return periodStartDate;
    }

    public void setPeriodStartDate(LocalDate periodStartDate) {
        this.periodStartDate = periodStartDate;
    }
}