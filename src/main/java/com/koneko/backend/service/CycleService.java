package com.koneko.backend.service;

import com.koneko.backend.dto.CycleSetupRequest;
import com.koneko.backend.entity.CycleProfile;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.CycleProfileRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.koneko.backend.dto.CycleStatusResponse;
import com.koneko.backend.entity.CycleProfile;
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
    public CycleStatusResponse getCurrentCycleStatus(String username) {

        CycleProfile profile = getCycle(username);

        LocalDate today = LocalDate.now();

        long daysSinceStart =
                java.time.temporal.ChronoUnit.DAYS.between(
                        profile.getLastPeriodStartDate(),
                        today
                );

        int cycleDay =
                (int) (daysSinceStart % profile.getCycleLength()) + 1;

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
    private CyclePhase calculatePhase(
            int cycleDay,
            int periodLength,
            int cycleLength) {

        if (cycleDay <= periodLength) {
            return CyclePhase.MENSTRUAL;
        }

        int ovulationDay = cycleLength - 14;

        if (cycleDay < ovulationDay) {
            return CyclePhase.FOLLICULAR;
        }

        if (cycleDay == ovulationDay) {
            return CyclePhase.OVULATION;
        }

        return CyclePhase.LUTEAL;
    }
}