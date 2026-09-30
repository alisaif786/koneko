package com.koneko.backend.service;

import com.koneko.backend.dto.DeviceTokenRequest;
import com.koneko.backend.entity.DeviceToken;
import com.koneko.backend.entity.User;
import com.koneko.backend.repository.DeviceTokenRepository;
import com.koneko.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;
    private final UserRepository userRepository;

    public DeviceTokenService(
            DeviceTokenRepository deviceTokenRepository,
            UserRepository userRepository) {

        this.deviceTokenRepository = deviceTokenRepository;
        this.userRepository = userRepository;
    }

    public void saveToken(
            String username,
            DeviceTokenRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        DeviceToken deviceToken =
                deviceTokenRepository
                        .findByUser(user)
                        .orElseGet(DeviceToken::new);

        deviceToken.setUser(user);
        deviceToken.setToken(request.getToken());

        deviceTokenRepository.save(deviceToken);
    }
}