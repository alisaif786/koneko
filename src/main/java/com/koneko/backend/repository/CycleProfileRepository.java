package com.koneko.backend.repository;

import com.koneko.backend.entity.CycleProfile;
import com.koneko.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CycleProfileRepository
        extends JpaRepository<CycleProfile, Long> {

    Optional<CycleProfile> findByUser(User user);

    boolean existsByUser(User user);
}