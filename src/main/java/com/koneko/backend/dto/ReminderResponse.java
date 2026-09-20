package com.koneko.backend.dto;

import com.koneko.backend.service.ReminderFrequency;
import com.koneko.backend.service.ReminderType;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class ReminderResponse {

    private Long id;
    private String title;
    private ReminderType type;
    private LocalTime time;
    private ReminderFrequency frequency;
    private DayOfWeek dayOfWeek;
    private boolean enabled;

    public ReminderResponse(
            Long id,
            String title,
            ReminderType type,
            LocalTime time,
            ReminderFrequency frequency,
            DayOfWeek dayOfWeek,
            boolean enabled) {

        this.id = id;
        this.title = title;
        this.type = type;
        this.time = time;
        this.frequency = frequency;
        this.dayOfWeek = dayOfWeek;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ReminderType getType() {
        return type;
    }

    public LocalTime getTime() {
        return time;
    }

    public ReminderFrequency getFrequency() {
        return frequency;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public boolean isEnabled() {
        return enabled;
    }
}