package com.koneko.backend.service;

import com.koneko.backend.dto.PeriodHistoryResponse;
import com.koneko.backend.entity.CycleProfile;
import com.koneko.backend.entity.PeriodHistory;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.CycleProfileRepository;
import com.koneko.backend.repository.PeriodHistoryRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class PeriodHistoryService {

    private final PeriodHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final CycleProfileRepository cycleProfileRepository;

    public PeriodHistoryService(
            PeriodHistoryRepository historyRepository,
            UserRepository userRepository,
            CycleProfileRepository cycleProfileRepository) {

        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
        this.cycleProfileRepository = cycleProfileRepository;
    }

    // ============================================================
    // ADD NEW PERIOD
    // ============================================================

    public void addPeriod(
            String username,
            LocalDate periodStartDate) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        CycleProfile profile =
                cycleProfileRepository.findByUser(user)
                        .orElseThrow(() ->
                                new RuntimeException("Cycle profile not found"));

        // Prevent duplicate if already latest date
        historyRepository
                .findFirstByUserOrderByPeriodStartDateDesc(user)
                .ifPresent(last -> {

                    LocalDate lastDate = last.getPeriodStartDate();

                    // Same date
                    if (periodStartDate.equals(lastDate)) {
                        throw new RuntimeException(
                                "Today's period is already logged."
                        );
                    }

                    // Older date
                    if (periodStartDate.isBefore(lastDate)) {
                        throw new RuntimeException(
                                "Cannot log an older period."
                        );
                    }

                    // Future date
                    if (periodStartDate.isAfter(LocalDate.now())) {
                        throw new RuntimeException(
                                "Future date is not allowed."
                        );
                    }

                });
        PeriodHistory history = new PeriodHistory();
        history.setUser(user);
        history.setPeriodStartDate(periodStartDate);

        historyRepository.save(history);

        // Keep current profile updated
        profile.setLastPeriodStartDate(periodStartDate);

        cycleProfileRepository.save(profile);
    }

    // ============================================================
    // GET HISTORY
    // ============================================================

    public List<PeriodHistoryResponse> getHistory(
            String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<PeriodHistory> history =
                historyRepository
                        .findByUserOrderByPeriodStartDateDesc(user);

        List<PeriodHistoryResponse> response =
                new ArrayList<>();

        for (int i = 0; i < history.size(); i++) {

            int cycleLength = 0;

            if (i < history.size() - 1) {

                cycleLength = (int)
                        ChronoUnit.DAYS.between(
                                history.get(i + 1).getPeriodStartDate(),
                                history.get(i).getPeriodStartDate()
                        );
            }

            response.add(
                    new PeriodHistoryResponse(
                            history.get(i).getId(),
                            history.get(i).getPeriodStartDate(),
                            cycleLength
                    )
            );
        }

        return response;
    }

    // ============================================================
    // AVERAGE CYCLE
    // ============================================================

    public int getAverageCycleLength(
            String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<PeriodHistory> history =
                historyRepository
                        .findByUserOrderByPeriodStartDateDesc(user);

        if (history.size() < 2) {

            return cycleProfileRepository
                    .findByUser(user)
                    .orElseThrow()
                    .getCycleLength();
        }

        int total = 0;

        for (int i = 0; i < history.size() - 1; i++) {

            total += ChronoUnit.DAYS.between(
                    history.get(i + 1).getPeriodStartDate(),
                    history.get(i).getPeriodStartDate()
            );
        }

        return total / (history.size() - 1);
    }

    // ============================================================
    // NEXT PREDICTION
    // ============================================================

    public LocalDate predictNextPeriod(
            String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PeriodHistory latest =
                historyRepository
                        .findFirstByUserOrderByPeriodStartDateDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException("No period history"));

        int average = getAverageCycleLength(username);

        return latest.getPeriodStartDate()
                .plusDays(average);
    }

}