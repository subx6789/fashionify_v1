package com.fashionify.service;

import com.fashionify.dto.request.LoginRequest;
import com.fashionify.dto.request.RegisterRequest;
import com.fashionify.dto.response.UserResponse;
import jakarta.servlet.http.HttpSession;

public interface AuthService {
    public UserResponse register(RegisterRequest request);
    public UserResponse login(LoginRequest request);
    public void logout(HttpSession session);
    public UserResponse getUserById(Long id);
}