package com.koneko.backend.dto;

import java.time.LocalDate;

public class CycleResponse {

    private Long id;
    private String username;
    private LocalDate lastPeriodStartDate;
    private int cycleLength;
    private int periodLength;

    public CycleResponse(
            Long id,
            String username,
            LocalDate lastPeriodStartDate,
            int cycleLength,
            int periodLength) {

        this.id = id;
        this.username = username;
        this.lastPeriodStartDate = lastPeriodStartDate;
        this.cycleLength = cycleLength;
        this.periodLength = periodLength;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public LocalDate getLastPeriodStartDate() {
        return lastPeriodStartDate;
    }

    public int getCycleLength() {
        return cycleLength;
    }

    public int getPeriodLength() {
        return periodLength;
    }
}