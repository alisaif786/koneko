package com.koneko.backend.service;

import com.koneko.backend.dto.PredictionResponse;
import com.koneko.backend.entity.CycleProfile;
import com.koneko.backend.repository.CycleProfileRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class PredictionService {

    private final CycleProfileRepository cycleProfileRepository;
    private final UserRepository userRepository;
    private final PeriodHistoryService periodHistoryService;

    public PredictionService(
            CycleProfileRepository cycleProfileRepository,
            UserRepository userRepository,
            PeriodHistoryService periodHistoryService) {

        this.cycleProfileRepository = cycleProfileRepository;
        this.userRepository = userRepository;
        this.periodHistoryService = periodHistoryService;
    }

    public PredictionResponse getPrediction(String username) {

        var user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        CycleProfile profile = cycleProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cycle profile not found"));

        LocalDate lastPeriod =
                profile.getLastPeriodStartDate();

        int averageCycle =
                periodHistoryService
                        .getAverageCycleLength(username);

        LocalDate predictedDate =
                lastPeriod.plusDays(averageCycle);

        long daysLeft =
                ChronoUnit.DAYS.between(
                        LocalDate.now(),
                        predictedDate
                );

        if (daysLeft == 3) {

            return new PredictionResponse(
                    "PERIOD_3_DAYS",
                    "🐱 Lisa",
                    "Your next cycle is getting closer. Take care of yourself 🌸",
                    3
            );
        }

        if (daysLeft == 1) {

            return new PredictionResponse(
                    "PERIOD_TOMORROW",
                    "🐱 Lisa",
                    "Pyariii!!!😚I think your period may start tomorrow. Carry a pad today 🌸",
                    1
            );
        }

        if (daysLeft == 0) {

            return new PredictionResponse(
                    "PERIOD_TODAY",
                    "🐱 Lisa",
                    "Good morning Saru! Your period may begin today. I'm here for you 🤍",
                    0
            );
        }

        if (daysLeft < 0 && daysLeft >= -7) {

            return new PredictionResponse(
                    "PERIOD_LATE",
                    "🐱 Lisa",
                    "Ummm, It's a little later than usual. Sometimes cycles vary. I'll keep watching with you 🌸",
                    (int) daysLeft
            );
        }

        return new PredictionResponse(
                "NONE",
                "",
                "",
                (int) daysLeft
        );
    }
}