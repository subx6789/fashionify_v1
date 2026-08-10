package com.fashionify.service;

import com.fashionify.dto.LoginRequest;
import com.fashionify.dto.RegisterRequest;
import com.fashionify.entity.User;
import com.fashionify.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        // TODO:
        // 1. Check whether email already exists using userRepository.findByEmail(request.getEmail()).
        // 2. Hash password using BCrypt (e.g., BCryptPasswordEncoder).
        // 3. Create a new User object.
        // 4. Set role to Role.USER.
        // 5. Save user using userRepository.save(user).
        // 6. Return saved user.
        return null;
    }

    public User login(LoginRequest request) {
        // TODO:
        // 1. Find user by email using userRepository.findByEmail(request.getEmail()).
        // 2. Verify password using BCrypt (e.g., passwordEncoder.matches(request.getPassword(), user.getPassword())).
        // 3. Return user if credentials are valid.
        // 4. Handle invalid credentials later (e.g., throw exception or return null).
        return null;
    }
}
