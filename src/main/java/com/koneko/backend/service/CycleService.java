package com.koneko.backend.service;

import com.koneko.backend.dto.CycleSetupRequest;
import com.koneko.backend.dto.CycleStatusResponse;
import com.koneko.backend.entity.CycleProfile;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.CycleProfileRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class CycleService {

    private final CycleProfileRepository cycleProfileRepository;
    private final UserRepository userRepository;

    public CycleService(
            CycleProfileRepository cycleProfileRepository,
            UserRepository userRepository) {

        this.cycleProfileRepository = cycleProfileRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // SETUP / UPDATE CYCLE
    // ============================================================

    public CycleProfile setupCycle(
            String username,
            CycleSetupRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        CycleProfile profile =
                cycleProfileRepository.findByUser(user)
                        .orElseGet(CycleProfile::new);

        profile.setUser(user);

        profile.setLastPeriodStartDate(
                request.getLastPeriodStartDate()
        );

        profile.setCycleLength(
                request.getCycleLength()
        );

        profile.setPeriodLength(
                request.getPeriodLength()
        );

        return cycleProfileRepository.save(profile);
    }

    // ============================================================
    // GET CYCLE PROFILE
    // ============================================================

    public CycleProfile getCycle(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return cycleProfileRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cycle profile not found"
                        ));
    }

    // ============================================================
    // CURRENT CYCLE STATUS
    // ============================================================

    public CycleStatusResponse getCurrentCycleStatus(
            String username) {

        CycleProfile profile = getCycle(username);

        LocalDate today = LocalDate.now();

        long daysSinceStart =
                ChronoUnit.DAYS.between(
                        profile.getLastPeriodStartDate(),
                        today
                );

        /*
         * Example:
         *
         * Period start = September 10
         *
         * September 10
         * daysSinceStart = 0
         * cycleDay = 1
         *
         * September 11
         * daysSinceStart = 1
         * cycleDay = 2
         */

        int cycleDay =
                (int) (
                        daysSinceStart
                                % profile.getCycleLength()
                ) + 1;

        CyclePhase phase = calculatePhase(
                cycleDay,
                profile.getPeriodLength(),
                profile.getCycleLength()
        );

        return new CycleStatusResponse(
                today,
                cycleDay,
                phase
        );
    }

    // ============================================================
    // PHASE CALCULATION
    // ============================================================

    private CyclePhase calculatePhase(
            int cycleDay,
            int periodLength,
            int cycleLength) {

        /*
         * PHASE 1
         * --------------------------------------------------------
         * Day 1 → Period Length
         *
         * Example:
         * periodLength = 5
         *
         * Day 1, 2, 3, 4, 5
         *       ↓
         * MENSTRUAL
         */

        if (cycleDay <= periodLength) {
            return CyclePhase.MENSTRUAL;
        }

        /*
         * PHASE 2
         * --------------------------------------------------------
         * After period → Day 12
         *
         * Example:
         * periodLength = 5
         *
         * Day 6 → Day 12
         *       ↓
         * FOLLICULAR
         */

        if (cycleDay <= 12) {
            return CyclePhase.FOLLICULAR;
        }

        /*
         * PHASE 3
         * --------------------------------------------------------
         * Day 13 → Day 17
         *
         * 13 = light/start
         * 14 = peak
         * 15 = decreasing
         * 16 = decreasing
         * 17 = last
         *
         * Backend currently returns only OVULATION.
         *
         * The frontend calendar can use the exact
         * cycleDay (13-17) to show different visual
         * intensity/signs.
         */

        if (cycleDay <= 17) {
            return CyclePhase.OVULATION;
        }

        /*
         * PHASE 4
         * --------------------------------------------------------
         * Day 18 → Last Cycle Day
         *
         * Example for 28-day cycle:
         *
         * Day 18 → Day 28
         *       ↓
         * LUTEAL
         */

        if (cycleDay <= cycleLength) {
            return CyclePhase.LUTEAL;
        }

        /*
         * Safety fallback.
         *
         * Normally this should never be reached because
         * cycleDay is calculated between 1 and cycleLength.
         */

        return CyclePhase.LUTEAL;
    }
}