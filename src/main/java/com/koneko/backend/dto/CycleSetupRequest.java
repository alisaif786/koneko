package com.koneko.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CycleSetupRequest {

    @NotNull
    private LocalDate lastPeriodStartDate;

    @Min(21)
    @Max(45)
    private int cycleLength;

    @Min(1)
    @Max(10)
    private int periodLength;

    public CycleSetupRequest() {
    }

    public LocalDate getLastPeriodStartDate() {
        return lastPeriodStartDate;
    }

    public void setLastPeriodStartDate(LocalDate lastPeriodStartDate) {
        this.lastPeriodStartDate = lastPeriodStartDate;
    }

    public int getCycleLength() {
        return cycleLength;
    }

    public void setCycleLength(int cycleLength) {
        this.cycleLength = cycleLength;
    }

    public int getPeriodLength() {
        return periodLength;
    }

    public void setPeriodLength(int periodLength) {
        this.periodLength = periodLength;
    }
}