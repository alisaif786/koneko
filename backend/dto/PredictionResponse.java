package com.koneko.backend.dto;

public class PredictionResponse {

    private String type;
    private String title;
    private String message;
    private int daysLeft;

    public PredictionResponse() {
    }

    public PredictionResponse(
            String type,
            String title,
            String message,
            int daysLeft) {

        this.type = type;
        this.title = title;
        this.message = message;
        this.daysLeft = daysLeft;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public int getDaysLeft() {
        return daysLeft;
    }
}