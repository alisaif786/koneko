package com.koneko.backend.dto;

import java.time.LocalDate;

public class PeriodHistoryResponse {

    private Long id;
    private LocalDate periodStartDate;
    private int cycleLengthFromPrevious;

    public PeriodHistoryResponse() {
    }

    public PeriodHistoryResponse(
            Long id,
            LocalDate periodStartDate,
            int cycleLengthFromPrevious) {

        this.id = id;
        this.periodStartDate = periodStartDate;
        this.cycleLengthFromPrevious = cycleLengthFromPrevious;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getPeriodStartDate() {
        return periodStartDate;
    }

    public int getCycleLengthFromPrevious() {
        return cycleLengthFromPrevious;
    }
}