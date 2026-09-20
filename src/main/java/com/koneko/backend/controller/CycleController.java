package com.koneko.backend.controller;

import com.koneko.backend.dto.CycleSetupRequest;
import com.koneko.backend.dto.CycleStatusResponse;
import com.koneko.backend.entity.CycleProfile;
import com.koneko.backend.service.CycleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.koneko.backend.dto.CycleResponse;

@RestController
@RequestMapping("/api/cycle")
public class CycleController {

    private final CycleService cycleService;

    public CycleController(CycleService cycleService) {
        this.cycleService = cycleService;
    }

    @PostMapping
    public ResponseEntity<CycleResponse> setupCycle(
            @Valid @RequestBody CycleSetupRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        CycleProfile profile =
                cycleService.setupCycle(username, request);

        CycleResponse response = new CycleResponse(
                profile.getId(),
                profile.getUser().getUsername(),
                profile.getLastPeriodStartDate(),
                profile.getCycleLength(),
                profile.getPeriodLength()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CycleResponse> getCycle(
            Authentication authentication) {

        String username = authentication.getName();

        CycleProfile profile =
                cycleService.getCycle(username);

        CycleResponse response = new CycleResponse(
                profile.getId(),
                profile.getUser().getUsername(),
                profile.getLastPeriodStartDate(),
                profile.getCycleLength(),
                profile.getPeriodLength()
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/status")
    public ResponseEntity<CycleStatusResponse> getCycleStatus(
            Authentication authentication) {

        String username = authentication.getName();

        CycleStatusResponse status =
                cycleService.getCurrentCycleStatus(username);

        return ResponseEntity.ok(status);
    }
}