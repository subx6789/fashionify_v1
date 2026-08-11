package com.fashionify.controller;

import com.fashionify.dto.request.LoginRequest;
import com.fashionify.dto.request.RegisterRequest;
import com.fashionify.dto.response.UserResponse;
import com.fashionify.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        // Call AuthService.register(request) and return the registered user
        return authService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request, HttpSession session) {
        // 1. Call AuthService.login(request)
        UserResponse user = authService.login(request);

        // 2. Store user ID in session ("userId")
        session.setAttribute("userId", user.getId());

        // 3. Store role in session ("role")
        session.setAttribute("role", user.getRole().name());

        // 4. Return logged in user
        return user;
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        authService.logout(session);
        return "Logged out successfully";
    }

    @GetMapping("/me")
    public UserResponse me(HttpSession session) {
        // 1. Read user ID from session
        Long userId = (Long) session.getAttribute("userId");
        // 2. Return null if no user is logged in
        if (userId == null) {
            return null;
        }
        // 3. Find and return current logged-in user
        return authService.getUserById(userId);
    }
}
