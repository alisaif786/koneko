package com.koneko.backend.repository;

import com.koneko.backend.entity.CareMessage;
import com.koneko.backend.service.CyclePhase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareMessageRepository
        extends JpaRepository<CareMessage, Long> {

    List<CareMessage> findByPhase(CyclePhase phase);
}