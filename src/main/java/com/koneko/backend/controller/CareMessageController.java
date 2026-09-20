package com.koneko.backend.controller;

import com.koneko.backend.entity.CareMessage;
import com.koneko.backend.service.CareMessageService;
import com.koneko.backend.service.CyclePhase;
import com.koneko.backend.service.CycleService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/care")
public class CareMessageController {

    private final CycleService cycleService;
    private final CareMessageService careMessageService;

    public CareMessageController(
            CycleService cycleService,
            CareMessageService careMessageService) {

        this.cycleService = cycleService;
        this.careMessageService = careMessageService;
    }

    @GetMapping("/today")
    public String getTodayMessage(Authentication authentication) {

        String username = authentication.getName();

        CyclePhase phase =
                cycleService
                        .getCurrentCycleStatus(username)
                        .getPhase();

        CareMessage message =
                careMessageService.getRandomMessage(phase);

        return message.getMessage();
    }
}