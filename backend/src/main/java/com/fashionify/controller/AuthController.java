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
        return authService.register(request);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request, HttpSession session) {
        // TODO:
        // 1. Call AuthService.login(request).
        // 2. Store user ID in session ("userId").
        // 3. Store role in session ("role").
        // 4. Return appropriate response (e.g. logged in user).
    	User user=authService.login(request);
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
    public User me(HttpSession session) {
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
