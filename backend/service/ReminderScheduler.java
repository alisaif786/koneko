package com.koneko.backend.service;

import com.koneko.backend.entity.DeviceToken;
import com.koneko.backend.entity.Reminder;
import com.koneko.backend.repository.DeviceTokenRepository;
import com.koneko.backend.repository.ReminderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Component
public class ReminderScheduler {

    private static final Logger log =
            LoggerFactory.getLogger(ReminderScheduler.class);

    private final ReminderRepository reminderRepository;
    private final DeviceTokenRepository deviceTokenRepository;
    private final FirebaseService firebaseService;

    private final ZoneId zoneId =
            ZoneId.of("Asia/Kolkata");

    public ReminderScheduler(
            ReminderRepository reminderRepository,
            DeviceTokenRepository deviceTokenRepository,
            FirebaseService firebaseService) {

        this.reminderRepository = reminderRepository;
        this.deviceTokenRepository = deviceTokenRepository;
        this.firebaseService = firebaseService;
    }

    @Scheduled(cron = "0 * * * * *")
    public void checkReminders() {

        ZonedDateTime now =
                ZonedDateTime.now(zoneId);

        LocalTime currentTime =
                now.toLocalTime()
                        .withSecond(0)
                        .withNano(0);

        DayOfWeek today =
                now.getDayOfWeek();

        log.info(
                "Checking reminders at {} ({})",
                currentTime,
                today
        );

        List<Reminder> reminders =
                reminderRepository.findAll();

        for (Reminder reminder : reminders) {

            if (!reminder.isEnabled()) {
                continue;
            }

            if (!reminder.getTime().equals(currentTime)) {
                continue;
            }

            if (reminder.getFrequency() == ReminderFrequency.DAILY) {

                triggerReminder(reminder);

            } else if (reminder.getFrequency() == ReminderFrequency.WEEKLY
                    && reminder.getDayOfWeek() == today) {

                triggerReminder(reminder);
            }
        }
    }

    private void triggerReminder(Reminder reminder) {

        DeviceToken token =
                deviceTokenRepository
                        .findByUser(reminder.getUser())
                        .orElse(null);

        if (token == null) {

            log.warn(
                    "No device token found for user {}",
                    reminder.getUser().getUsername()
            );

            return;
        }

        try {

            firebaseService.sendNotification(
                    token.getToken(),
                    "🐱 Lisa",
                    reminder.getTitle()
            );

            log.info(
                    "Notification sent to {} for reminder '{}'",
                    reminder.getUser().getUsername(),
                    reminder.getTitle()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send reminder '{}' to {}",
                    reminder.getTitle(),
                    reminder.getUser().getUsername(),
                    e
            );
        }
    }
}