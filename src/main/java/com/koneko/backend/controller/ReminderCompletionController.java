package com.koneko.backend.controller;

import com.koneko.backend.dto.ReminderCompletionResponse;
import com.koneko.backend.service.ReminderCompletionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderCompletionController {

    private final ReminderCompletionService completionService;

    public ReminderCompletionController(
            ReminderCompletionService completionService) {

        this.completionService = completionService;
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ReminderCompletionResponse> complete(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                completionService.complete(
                        authentication.getName(),
                        id
                )
        );
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReminderCompletionResponse>> history(
            Authentication authentication) {

        return ResponseEntity.ok(
                completionService.getHistory(
                        authentication.getName()
                )
        );
    }
}