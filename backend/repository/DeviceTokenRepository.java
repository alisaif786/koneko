package com.koneko.backend.repository;

import com.koneko.backend.entity.DeviceToken;
import com.koneko.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceTokenRepository
        extends JpaRepository<DeviceToken, Long> {

    Optional<DeviceToken> findByUser(User user);
}