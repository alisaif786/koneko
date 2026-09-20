package com.koneko.backend.service;

import com.koneko.backend.entity.Reminder;
import com.koneko.backend.repository.ReminderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.util.List;

@Component
public class ReminderScheduler {

    private final ReminderRepository reminderRepository;

    private final ZoneId zoneId =
            ZoneId.of("Asia/Kolkata");

    public ReminderScheduler(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void checkReminders() {

        ZonedDateTime now =
                ZonedDateTime.now(zoneId);

        LocalTime currentTime =
                now.toLocalTime()
                        .withSecond(0)
                        .withNano(0);

        DayOfWeek today =
                now.getDayOfWeek();

        System.out.println(
                "Scheduler checking: "
                        + currentTime
                        + " | "
                        + today
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

            if (reminder.getFrequency()
                    == ReminderFrequency.DAILY) {

                triggerReminder(reminder);

            } else if (
                    reminder.getFrequency()
                            == ReminderFrequency.WEEKLY
                            && reminder.getDayOfWeek() == today) {

                triggerReminder(reminder);
            }
        }
    }

    private void triggerReminder(Reminder reminder) {

        System.out.println(
                "🔔 KONEKO REMINDER → "
                        + reminder.getTitle()
                        + " | User: "
                        + reminder.getUser().getUsername()
        );
    }
}