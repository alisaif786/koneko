package com.koneko.backend.service;

import com.koneko.backend.dto.CycleStatusResponse;
import com.koneko.backend.entity.CareMessage;
import com.koneko.backend.entity.DeviceToken;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.CareMessageRepository;
import com.koneko.backend.repository.DeviceTokenRepository;
import com.koneko.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
public class PhaseCareScheduler {

    private static final Logger log =
            LoggerFactory.getLogger(PhaseCareScheduler.class);

    private final UserRepository userRepository;
    private final CycleService cycleService;
    private final CareMessageRepository careMessageRepository;
    private final DeviceTokenRepository deviceTokenRepository;
    private final FirebaseService firebaseService;

    private final Random random = new Random();

    public PhaseCareScheduler(
            UserRepository userRepository,
            CycleService cycleService,
            CareMessageRepository careMessageRepository,
            DeviceTokenRepository deviceTokenRepository,
            FirebaseService firebaseService) {

        this.userRepository = userRepository;
        this.cycleService = cycleService;
        this.careMessageRepository = careMessageRepository;
        this.deviceTokenRepository = deviceTokenRepository;
        this.firebaseService = firebaseService;
    }

    // ============================================================
    // TESTING
    // Runs every minute
    // Change to 9 AM, 2 PM, 8 PM after testing
    // ============================================================

    @Scheduled(cron = "0 0 9,14,20 * * *")
    public void sendPhaseCareMessages() {

        log.info("Checking phase care notifications...");

        List<User> users = userRepository.findAll();

        for (User user : users) {

            try {

                CycleStatusResponse status =
                        cycleService.getCurrentCycleStatus(
                                user.getUsername()
                        );

                CyclePhase phase =
                        status.getPhase();

                List<CareMessage> messages =
                        careMessageRepository.findByPhase(phase);

                if (messages.isEmpty()) {

                    log.warn(
                            "No care messages found for phase {}",
                            phase
                    );

                    continue;
                }

                CareMessage selected =
                        messages.get(
                                random.nextInt(messages.size())
                        );

                DeviceToken token =
                        deviceTokenRepository
                                .findByUser(user)
                                .orElse(null);

                if (token == null) {

                    log.warn(
                            "No device token for user {}",
                            user.getUsername()
                    );

                    continue;
                }

                firebaseService.sendNotification(
                        token.getToken(),
                        "🐱 Lisa",
                        selected.getMessage()
                );

                log.info(
                        "Phase notification sent to {} [{}]: {}",
                        user.getUsername(),
                        phase,
                        selected.getMessage()
                );

            } catch (Exception e) {

                log.error(
                        "Failed sending phase notification to {}",
                        user.getUsername(),
                        e
                );
            }
        }
    }
}