package com.koneko.backend.dto;

import com.koneko.backend.service.CyclePhase;

import java.time.LocalDate;

public class CycleStatusResponse {

    private LocalDate date;
    private int cycleDay;
    private CyclePhase phase;

    public CycleStatusResponse(
            LocalDate date,
            int cycleDay,
            CyclePhase phase) {

        this.date = date;
        this.cycleDay = cycleDay;
        this.phase = phase;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getCycleDay() {
        return cycleDay;
    }

    public CyclePhase getPhase() {
        return phase;
    }
}