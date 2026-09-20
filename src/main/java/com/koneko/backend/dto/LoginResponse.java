package com.koneko.backend.dto;

public class LoginResponse {

    private Long id;
    private String username;
    private String displayName;
    private String token;

    public LoginResponse(
            Long id,
            String username,
            String displayName,
            String token) {

        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getToken() {
        return token;
    }
}