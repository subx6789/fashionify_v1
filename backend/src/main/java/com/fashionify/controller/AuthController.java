package com.fashionify.controller;

import com.fashionify.dto.LoginRequest;
import com.fashionify.dto.RegisterRequest;
import com.fashionify.entity.User;
import com.fashionify.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        // TODO:
        // Call AuthService.register(request) and return an appropriate response.
        return null;
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request, HttpSession session) {
        // TODO:
        // 1. Call AuthService.login(request).
        // 2. Store user ID in session ("userId").
        // 3. Store role in session ("role").
        // 4. Return appropriate response (e.g. logged in user).
        return null;
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        // TODO:
        // Invalidate the HTTP session (session.invalidate()).
        return null;
    }

    @GetMapping("/me")
    public User me(HttpSession session) {
        // TODO:
        // 1. Read user ID from session.
        // 2. If no user is logged in, handle that later.
        // 3. Find and return current logged-in user.
        return null;
    }
}
