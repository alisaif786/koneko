package com.koneko.backend.controller;

import com.koneko.backend.entity.DeviceToken;
import com.koneko.backend.repository.DeviceTokenRepository;
import com.koneko.backend.service.FirebaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-notification")
public class TestNotificationController {

    private final FirebaseService firebaseService;
    private final DeviceTokenRepository deviceTokenRepository;

    public TestNotificationController(
            FirebaseService firebaseService,
            DeviceTokenRepository deviceTokenRepository) {

        this.firebaseService = firebaseService;
        this.deviceTokenRepository = deviceTokenRepository;
    }

    @PostMapping
    public ResponseEntity<String> sendTestNotification() {

        DeviceToken token = deviceTokenRepository
                .findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No device token found."));

        firebaseService.sendNotification(
                token.getToken(),
                "🐱 Lisa",
                "Yay! Firebase notifications are working! 🌸"
        );

        return ResponseEntity.ok("Notification sent successfully.");
    }

}