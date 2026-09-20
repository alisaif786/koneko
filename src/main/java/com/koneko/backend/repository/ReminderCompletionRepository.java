package com.koneko.backend.repository;

import com.koneko.backend.entity.Reminder;
import com.koneko.backend.entity.ReminderCompletion;
import com.koneko.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReminderCompletionRepository
        extends JpaRepository<ReminderCompletion, Long> {

    Optional<ReminderCompletion> findByReminderAndCompletedDate(
            Reminder reminder,
            LocalDate completedDate
    );

    List<ReminderCompletion>
    findByReminder_UserOrderByCompletedAtDesc(User user);
}