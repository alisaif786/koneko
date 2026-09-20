package com.koneko.backend.entity;

import com.koneko.backend.service.CyclePhase;
import jakarta.persistence.*;

@Entity
@Table(name = "care_messages")
public class CareMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CyclePhase phase;

    @Column(nullable = false, length = 500)
    private String message;

    public CareMessage() {
    }

    public CareMessage(CyclePhase phase, String message) {
        this.phase = phase;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public CyclePhase getPhase() {
        return phase;
    }

    public void setPhase(CyclePhase phase) {
        this.phase = phase;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}