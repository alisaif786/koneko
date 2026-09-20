package com.koneko.backend.controller;

import com.koneko.backend.dto.ReminderRequest;
import com.koneko.backend.dto.ReminderResponse;
import com.koneko.backend.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @PostMapping
    public ResponseEntity<ReminderResponse> create(
            @Valid @RequestBody ReminderRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                reminderService.create(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> getAll(
            Authentication authentication) {

        return ResponseEntity.ok(
                reminderService.getAll(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ReminderRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                reminderService.update(
                        authentication.getName(),
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        reminderService.delete(
                authentication.getName(),
                id
        );

        return ResponseEntity.noContent().build();
    }
}