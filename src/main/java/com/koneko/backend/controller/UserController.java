package com.koneko.backend.controller;

import com.koneko.backend.dto.LoginRequest;
import com.koneko.backend.dto.LoginResponse;
import com.koneko.backend.dto.RegisterRequest;
import com.koneko.backend.dto.UserResponse;
import com.koneko.backend.entity.User;
import com.koneko.backend.service.JwtService;
import com.koneko.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {

        User user = userService.register(request);

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName()
        );
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userService.login(request);

        String token = jwtService.generateToken(user.getUsername());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                token
        );
    }
    @GetMapping("/profile")
    public String profile() {
        return "Koneko private profile 🐱";
    }

}