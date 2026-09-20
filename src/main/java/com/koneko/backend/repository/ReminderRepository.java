package com.koneko.backend.repository;

import com.koneko.backend.entity.Reminder;
import com.koneko.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReminderRepository
        extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUser(User user);

    Optional<Reminder> findByIdAndUser(Long id, User user);
}