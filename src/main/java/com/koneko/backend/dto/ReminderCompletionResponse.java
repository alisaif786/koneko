package com.koneko.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReminderCompletionResponse {

    private Long id;
    private Long reminderId;
    private String reminderTitle;
    private LocalDate completedDate;
    private LocalDateTime completedAt;

    public ReminderCompletionResponse(
            Long id,
            Long reminderId,
            String reminderTitle,
            LocalDate completedDate,
            LocalDateTime completedAt) {

        this.id = id;
        this.reminderId = reminderId;
        this.reminderTitle = reminderTitle;
        this.completedDate = completedDate;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getReminderId() {
        return reminderId;
    }

    public String getReminderTitle() {
        return reminderTitle;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}