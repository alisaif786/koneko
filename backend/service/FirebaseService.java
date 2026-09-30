package com.koneko.backend.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    public String sendNotification(
            String deviceToken,
            String title,
            String body) {

        try {

            Message message = Message.builder()
                    .setToken(deviceToken)
                    .setNotification(
                            Notification.builder()
                                    .setTitle(title)
                                    .setBody(body)
                                    .build()
                    )
                    .build();

            return FirebaseMessaging.getInstance().send(message);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to send notification.",
                    e
            );
        }
    }
}