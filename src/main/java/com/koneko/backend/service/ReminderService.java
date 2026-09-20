package com.koneko.backend.service;

import com.koneko.backend.dto.ReminderRequest;
import com.koneko.backend.dto.ReminderResponse;
import com.koneko.backend.entity.Reminder;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.ReminderRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public ReminderService(
            ReminderRepository reminderRepository,
            UserRepository userRepository) {

        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    public ReminderResponse create(
            String username,
            ReminderRequest request) {

        User user = getUser(username);

        validateFrequency(request);

        Reminder reminder = new Reminder();

        reminder.setUser(user);
        reminder.setTitle(request.getTitle());
        reminder.setType(request.getType());
        reminder.setTime(request.getTime());
        reminder.setFrequency(request.getFrequency());
        reminder.setDayOfWeek(request.getDayOfWeek());
        reminder.setEnabled(request.isEnabled());

        return toResponse(reminderRepository.save(reminder));
    }

    public List<ReminderResponse> getAll(String username) {

        User user = getUser(username);

        return reminderRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ReminderResponse update(
            String username,
            Long id,
            ReminderRequest request) {

        User user = getUser(username);

        Reminder reminder =
                reminderRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reminder not found"
                                ));

        validateFrequency(request);

        reminder.setTitle(request.getTitle());
        reminder.setType(request.getType());
        reminder.setTime(request.getTime());
        reminder.setFrequency(request.getFrequency());
        reminder.setDayOfWeek(request.getDayOfWeek());
        reminder.setEnabled(request.isEnabled());

        return toResponse(reminderRepository.save(reminder));
    }

    public void delete(String username, Long id) {

        User user = getUser(username);

        Reminder reminder =
                reminderRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reminder not found"
                                ));

        reminderRepository.delete(reminder);
    }

    private User getUser(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private void validateFrequency(ReminderRequest request) {

        if (request.getFrequency() == ReminderFrequency.WEEKLY
                && request.getDayOfWeek() == null) {

            throw new RuntimeException(
                    "dayOfWeek is required for weekly reminder"
            );
        }

        if (request.getFrequency() == ReminderFrequency.DAILY) {
            request.setDayOfWeek(null);
        }
    }

    private ReminderResponse toResponse(Reminder reminder) {

        return new ReminderResponse(
                reminder.getId(),
                reminder.getTitle(),
                reminder.getType(),
                reminder.getTime(),
                reminder.getFrequency(),
                reminder.getDayOfWeek(),
                reminder.isEnabled()
        );
    }
}