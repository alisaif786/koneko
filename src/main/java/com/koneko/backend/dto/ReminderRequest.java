package com.koneko.backend.dto;

import com.koneko.backend.service.ReminderFrequency;
import com.koneko.backend.service.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class ReminderRequest {

    @NotBlank
    private String title;

    @NotNull
    private ReminderType type;

    @NotNull
    private LocalTime time;

    @NotNull
    private ReminderFrequency frequency;

    private DayOfWeek dayOfWeek;

    private boolean enabled = true;

    public ReminderRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ReminderType getType() {
        return type;
    }

    public void setType(ReminderType type) {
        this.type = type;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public ReminderFrequency getFrequency() {
        return frequency;
    }

    public void setFrequency(ReminderFrequency frequency) {
        this.frequency = frequency;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}