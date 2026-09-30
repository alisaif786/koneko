package com.koneko.backend.controller;

import com.koneko.backend.dto.PeriodHistoryResponse;
import com.koneko.backend.dto.PeriodStartRequest;
import com.koneko.backend.service.PeriodHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cycle")
public class PeriodHistoryController {

    private final PeriodHistoryService periodHistoryService;

    public PeriodHistoryController(
            PeriodHistoryService periodHistoryService) {

        this.periodHistoryService = periodHistoryService;
    }

    // ============================================================
    // LOG NEW PERIOD
    // ============================================================

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startPeriod(
            @Valid @RequestBody PeriodStartRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        periodHistoryService.addPeriod(
                username,
                request.getPeriodStartDate()
        );

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Period logged successfully ♡"
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // PERIOD HISTORY
    // ============================================================

    @GetMapping("/history")
    public ResponseEntity<List<PeriodHistoryResponse>> getHistory(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                periodHistoryService.getHistory(username)
        );
    }

    // ============================================================
    // AVERAGE CYCLE LENGTH
    // ============================================================

    @GetMapping("/average")
    public ResponseEntity<Map<String, Integer>> getAverageCycle(
            Authentication authentication) {

        String username = authentication.getName();

        Map<String, Integer> response = new HashMap<>();

        response.put(
                "averageCycleLength",
                periodHistoryService.getAverageCycleLength(username)
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // NEXT PERIOD PREDICTION
    // ============================================================

    @GetMapping("/prediction")
    public ResponseEntity<Map<String, LocalDate>> getPrediction(
            Authentication authentication) {

        String username = authentication.getName();

        Map<String, LocalDate> response = new HashMap<>();

        response.put(
                "predictedNextPeriod",
                periodHistoryService.predictNextPeriod(username)
        );

        return ResponseEntity.ok(response);
    }
}