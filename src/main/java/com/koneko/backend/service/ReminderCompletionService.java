package com.koneko.backend.service;

import com.koneko.backend.dto.ReminderCompletionResponse;
import com.koneko.backend.entity.Reminder;
import com.koneko.backend.entity.ReminderCompletion;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.ReminderCompletionRepository;
import com.koneko.backend.repository.ReminderRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderCompletionService {

    private final ReminderCompletionRepository completionRepository;
    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public ReminderCompletionService(
            ReminderCompletionRepository completionRepository,
            ReminderRepository reminderRepository,
            UserRepository userRepository) {

        this.completionRepository = completionRepository;
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    public ReminderCompletionResponse complete(
            String username,
            Long reminderId) {

        User user = getUser(username);

        Reminder reminder = reminderRepository
                .findByIdAndUser(reminderId, user)
                .orElseThrow(() ->
                        new RuntimeException("Reminder not found"));

        LocalDate today = LocalDate.now();

        ReminderCompletion completion =
                completionRepository
                        .findByReminderAndCompletedDate(
                                reminder,
                                today
                        )
                        .orElseGet(() -> {

                            ReminderCompletion newCompletion =
                                    new ReminderCompletion();

                            newCompletion.setReminder(reminder);
                            newCompletion.setCompletedDate(today);
                            newCompletion.setCompletedAt(
                                    LocalDateTime.now()
                            );

                            return completionRepository.save(
                                    newCompletion
                            );
                        });

        return toResponse(completion);
    }

    public List<ReminderCompletionResponse> getHistory(
            String username) {

        User user = getUser(username);

        return completionRepository
                .findByReminder_UserOrderByCompletedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User getUser(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private ReminderCompletionResponse toResponse(
            ReminderCompletion completion) {

        return new ReminderCompletionResponse(
                completion.getId(),
                completion.getReminder().getId(),
                completion.getReminder().getTitle(),
                completion.getCompletedDate(),
                completion.getCompletedAt()
        );
    }
}