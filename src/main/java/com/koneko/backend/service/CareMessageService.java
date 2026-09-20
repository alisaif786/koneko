package com.koneko.backend.service;

import com.koneko.backend.entity.CareMessage;
import com.koneko.backend.repository.CareMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class CareMessageService {

    private final CareMessageRepository repository;
    private final Random random = new Random();

    public CareMessageService(CareMessageRepository repository) {
        this.repository = repository;
    }

    public CareMessage getRandomMessage(CyclePhase phase) {

        List<CareMessage> messages =
                repository.findByPhase(phase);

        if (messages.isEmpty()) {
            throw new RuntimeException(
                    "No care messages found for phase: " + phase
            );
        }

        return messages.get(
                random.nextInt(messages.size())
        );
    }
}