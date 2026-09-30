package com.koneko.backend.controller;

import com.koneko.backend.dto.DeviceTokenRequest;
import com.koneko.backend.service.DeviceTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/device-token")
public class DeviceTokenController {

    private final DeviceTokenService deviceTokenService;

    public DeviceTokenController(
            DeviceTokenService deviceTokenService) {

        this.deviceTokenService = deviceTokenService;
    }

    @PostMapping
    public ResponseEntity<String> saveToken(
            @RequestBody DeviceTokenRequest request,
            Authentication authentication) {

        deviceTokenService.saveToken(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(
                "Device token saved successfully."
        );
    }
}