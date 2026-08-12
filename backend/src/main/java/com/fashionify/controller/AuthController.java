package com.fashionify.controller;

import com.fashionify.dto.request.LoginRequest;
import com.fashionify.dto.request.RegisterRequest;
import com.fashionify.dto.response.UserResponse;
import com.fashionify.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
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
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        UserResponse user = authService.login(request);
        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole().name());
        return user;
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        authService.logout(session);
        return "Logged out successfully";
    }

    @GetMapping("/me")
    public UserResponse me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return null;
        }
        return authService.getUserById(userId);
    }
}
