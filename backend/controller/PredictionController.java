package com.koneko.backend.controller;

import com.koneko.backend.dto.PredictionResponse;
import com.koneko.backend.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(
            PredictionService predictionService) {

        this.predictionService = predictionService;
    }

    @GetMapping
    public ResponseEntity<PredictionResponse> getPrediction(
            Authentication authentication) {

        String username = authentication.getName();

        PredictionResponse response =
                predictionService.getPrediction(username);

        return ResponseEntity.ok(response);
    }
}