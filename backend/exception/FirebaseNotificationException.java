package com.koneko.backend.exception;

public class FirebaseNotificationException extends RuntimeException {

    public FirebaseNotificationException(String message) {
        super(message);
    }

    public FirebaseNotificationException(
            String message,
            Throwable cause) {

        super(message, cause);
    }

}