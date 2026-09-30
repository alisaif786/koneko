package com.koneko.backend.repository;

import com.koneko.backend.entity.PeriodHistory;
import com.koneko.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PeriodHistoryRepository
        extends JpaRepository<PeriodHistory, Long> {

    // Complete history (newest first)
    List<PeriodHistory> findByUserOrderByPeriodStartDateDesc(User user);

    // Latest period
    Optional<PeriodHistory> findFirstByUserOrderByPeriodStartDateDesc(User user);

    // Oldest period
    Optional<PeriodHistory> findFirstByUserOrderByPeriodStartDateAsc(User user);

    // Total logged periods
    long countByUser(User user);

    // Check if history exists
    boolean existsByUser(User user);
}